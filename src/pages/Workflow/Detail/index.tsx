import React, { useEffect, useRef, useState } from 'react';
import { Button, Descriptions, message, Modal, Space, Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useParams } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { QueryWorkflowDetail, WorkflowHandle, WorkflowNodeLists } from '@/services/workflow/api';
import { history } from '@@/core/history';
import { useModel } from '@@/plugin-model/useModel';
import Logs from '@/pages/Workflow/Detail/Logs';
import DetailContent from '@/pages/Workflow/Detail/Detail';
import {
  ModalForm,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { isEmpty } from '@/units';
import ProCard from '@ant-design/pro-card';
import BasicException from '@/exceptions/BasicException';

const { confirm } = Modal;
const { Title } = Typography;

const tabList = [
  {
    key: 'detail',
    tab: '详情',
  },
  {
    key: 'logs',
    tab: '日志',
  },
];

const Detail: React.FC = () => {
  const detailContentActionRef = useRef<WorkflowAPI.DetailContentRef>();

  const { initialState } = useModel('@@initialState');
  let currentUser: API.CurrentUser;
  if (initialState?.currentUser) {
    currentUser = initialState?.currentUser;
  } else {
    currentUser = {
      avatar: '',
      createTime: 0,
      lastLoginTime: 0,
      userStatus: 0,
      userLogin: '',
      id: 0,
    };
  }

  // 获取路由参数
  const routeParams: any = useParams();

  const [loading, setLoading] = useState(false);
  const [workflowDetail, setWorkflowDetail] = useState<any>();
  const [workflowId, setWorkflowId] = useState<number>(0);
  const [pageContext, setPageContext] = useState<string>('detail');
  const [stepLists, setStepLists] = useState<WorkflowAPI.WorkflowNode[]>([]);
  const [remarks, setRemarks] = useState<string>('');

  useEffect(() => {
    const { id } = routeParams;
    QueryWorkflowDetail(id).then((result) => {
      if (result.code === 1) {
        const { data } = result;
        if (data?.currAuditors) {
          data.auditorIds = data.currAuditors.map((item: any) => {
            return item.userid ?? 0;
          });
        }
        setWorkflowDetail(data ?? {});
        setWorkflowId(data?.workflow?.id ?? 0);
        setRemarks(data?.workflow?.remarks ?? '');
        // 拉取所有节点
        WorkflowNodeLists({ type_id: data?.workflow?.type_id ?? 0 }).then((res) => {
          if (res.code === 1) {
            setStepLists(res?.data?.items ?? []);
          }
        });
      }
    });
  }, [routeParams]);

  const submitExamineApprove = () => {
    confirm({
      title: '确定?',
      icon: <ExclamationCircleOutlined />,
      content: '通过后将进入下一个审核步骤!',
      onOk: async () => {
        const hide = message.loading('加载中');
        setLoading(true);
        let workflowData: any = {};
        // 先执行子组件的方法
        if (detailContentActionRef.current?.submit !== undefined) {
          try {
            const result = await detailContentActionRef.current?.submit();
            // 工作流子表数据
            workflowData = result.data ?? null;
          } catch (e: any) {
            hide();
            setLoading(false);
            if (e instanceof BasicException) {
              message.error(e.message);
            } else if ('errorFields' in e) {
              // 表单校验失败
              const { errorFields } = e;
              message.error(errorFields[0]?.errors);
            } else {
              console.error(e);
              message.error('提交数据失败');
            }
            return;
          }
        }
        WorkflowHandle({ id: workflowId, data: workflowData, remarks })
          .then((result) => {
            if (result.code === 1) {
              message.success('操作成功');
              // 返回列表页
              history.push(`/workflow/success/${workflowId}`);
            }
          })
          .finally(() => {
            hide();
            setLoading(false);
          });
      },
    });
  };

  const extra = [
    <ModalForm
      key="overrule"
      title="驳回理由"
      trigger={
        <Button
          key="2"
          shape="round"
          size="large"
          loading={loading}
          disabled={workflowDetail?.workflow?.step === 1}
        >
          驳回
        </Button>
      }
      onFinish={async (formData) => {
        setLoading(true);
        const hide = message.loading('加载中');
        // 先执行子组件的方法
        if (detailContentActionRef.current?.overrule !== undefined) {
          const result = await detailContentActionRef.current?.overrule();
          // 判断Ref是否执行成功
          if (!result.success) {
            hide();
            setLoading(false);
            message.error(isEmpty(result?.message) ? '提交数据失败' : result.message);
            return;
          }
        }
        if (formData?.back === true) {
          // 退回上一步
          for (let i = 0; i < stepLists.length; i++) {
            if (stepLists[i].step >= (workflowDetail?.workflow?.step ?? 0)) {
              formData.step = stepLists[i <= 0 ? 0 : i - 1].step;
              break;
            }
          }
        }
        WorkflowHandle({
          id: workflowId,
          overrule: true,
          explain: formData?.explain ?? '',
          step: formData?.step ?? 0,
        }).then((result) => {
          hide();
          if (result.code === 1) {
            message.success('操作成功').then();
            // 返回列表页
            history.push('/workflow/to-do');
          }
          setLoading(false);
        });
      }}
    >
      <ProFormCheckbox name="back" className={`m-b-15`}>
        退回上一步
      </ProFormCheckbox>
      <ProFormSelect
        label="退至步骤"
        name="step"
        options={stepLists.map((item) => {
          return {
            value: item.step,
            label: item.name,
            disabled: (workflowDetail?.workflow?.step ?? 0) <= item.step,
          };
        })}
      />
      <ProFormTextArea
        label="驳回理由"
        name="explain"
        placeholder="请填写驳回理由"
        rules={[{ required: true }]}
      />
    </ModalForm>,
    <Button
      key="1"
      type="primary"
      shape="round"
      size="large"
      loading={loading}
      onClick={submitExamineApprove}
    >
      {workflowDetail?.workflow?.step === 1 ? '提交' : '通过'}
    </Button>,
  ];

  const content = (
    <Descriptions size="small" column={3}>
      <Descriptions.Item label="工作流标题">
        {workflowDetail?.workflow?.title ?? ''}
      </Descriptions.Item>
      <Descriptions.Item label="工作流编号">
        {workflowDetail?.workflow?.serials ?? '-'}
      </Descriptions.Item>
      <Descriptions.Item label="工作流类型">
        {workflowDetail?.workflow?.type_name ?? '-'}
      </Descriptions.Item>
      <Descriptions.Item label="创建人">
        {workflowDetail?.workflow?.user?.clerk?.nickname ?? ''}
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">
        {workflowDetail?.workflow?.created_at ?? '-'}
      </Descriptions.Item>
      <Descriptions.Item label="当前步骤">
        {workflowDetail?.currStep?.name ?? '-'}
      </Descriptions.Item>
      <Descriptions.Item label="当前状态">
        {workflowDetail?.workflow?.status_text ?? '-'}
      </Descriptions.Item>
      <Descriptions.Item label="审批人">
        <Space>
          {workflowDetail?.currAuditors &&
            workflowDetail.currAuditors.map((item: any) => {
              if (item.user?.clerk?.nickname) {
                return <div>{item.user.clerk.nickname ?? ''}</div>;
              }
              return '';
            })}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label="备注">{workflowDetail?.workflow?.remarks ?? '-'}</Descriptions.Item>
    </Descriptions>
  );

  return (
    <PageContainer
      tabList={tabList}
      tabActiveKey={pageContext}
      onTabChange={(key: string) => setPageContext(key)}
      extra={
        workflowDetail?.auditorIds && workflowDetail.auditorIds.indexOf(currentUser.id) !== -1
          ? extra
          : []
      }
      content={content}
    >
      {workflowDetail?.currStep?.step === 1 && (
        <ProCard title={<Title level={5}>备注</Title>} className={`m-b-15`}>
          <ProFormText
            label="说明"
            placeholder="发起的原因或者需要告知审批人的话"
            fieldProps={{
              onChange: (e) => {
                setRemarks(e.target?.value);
              },
            }}
          />
        </ProCard>
      )}
      {pageContext === 'detail' ? (
        <DetailContent Workflow={workflowDetail} actionRef={detailContentActionRef} />
      ) : (
        <Logs workflowId={workflowId} />
      )}
    </PageContainer>
  );
};

export default Detail;

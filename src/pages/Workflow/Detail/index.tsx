import React, { useEffect, useRef, useState } from 'react';
import { Button, Descriptions, message, Space, Typography } from 'antd';
import {fetchWorkflowDetail, WorkflowExamineApprove, WorkflowNodeLists} from '@/services/workflow/api';
import { history } from '@@/core/history';
import { useModel, useParams } from '@umijs/max';
import Logs from '@/pages/Workflow/Detail/Logs';
import DetailContent from '@/pages/Workflow/Detail/Detail';
import {
  ModalForm,
  ProCard,
  PageContainer,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {codeOk, isEmpty} from '@/units';
import BasicException from '@/exceptions/BasicException';
import moment from "moment";
import WorkflowStatusBadge from "@/pages/Workflow/components/WorkflowStatusBadge";

const { Title, Paragraph } = Typography;

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
  let currentUser: Partial<API.CurrentUser>;
  if (initialState?.currentUser) {
    currentUser = initialState?.currentUser;
  } else {
    currentUser = {};
  }

  // 获取路由参数
  const routeParams: any = useParams();

  const [loading, setLoading] = useState(false);
  const [workflowDetail, setWorkflowDetail] = useState<WorkflowAPI.WorkflowDetail>();
  const [workflowId, setWorkflowId] = useState<number>(0);
  const [pageContext, setPageContext] = useState<string>('detail');
  const [nodes, setNodes] = useState<WorkflowAPI.WorkflowNode[]>([]);
  const [remarks, setRemarks] = useState<string>('');

  useEffect(() => {
    const { id } = routeParams;
    fetchWorkflowDetail(id).then((result) => {
      if (codeOk(result.code)) {
        const { data } = result;
        if (data?.operators) {
          data.operatorIds = data.operators.map((item: any) => {
            return item.user_id ?? 0;
          });
        }
        setWorkflowDetail(data);
        setWorkflowId(data?.workflow?.id ?? 0);
        setRemarks(data?.workflow?.remarks ?? '');
        // 拉取所有节点
        WorkflowNodeLists({
          type_id: data?.workflow?.type_id ?? 0,
          page: 1,
          pageSize: 9999,
        }).then((res) => {
          if (codeOk(res.code)) {
            setNodes(res?.data?.items ?? []);
          }
        });
      }
    });
  }, [routeParams]);

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
          disabled={workflowDetail?.workflow?.node === 1}
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
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].node >= (workflowDetail?.workflow?.node ?? 0)) {
              formData.node = nodes[i <= 0 ? 0 : i - 1].node;
              break;
            }
          }
        }
        WorkflowExamineApprove({
          id: workflowId,
          explain: formData?.explain ?? '',
          node: formData?.node ?? 0,
          action: 'overrule',
        }).then((result) => {
          hide();
          if (codeOk(result.code)) {
            message.success('操作成功').then();
            // 返回列表页
            history.push('/workflow/to-do');
          }
          setLoading(false);
        }).finally(() => {
          hide();
        });
      }}
    >
      <ProFormCheckbox name="back" className={`m-b-15`}>
        退回上一个节点
      </ProFormCheckbox>
      <ProFormSelect
        label="退至节点"
        name="node"
        options={nodes.map((item) => {
          return {
            value: item.node,
            label: item.name,
            disabled: (workflowDetail?.workflow?.node ?? 0) <= item.node,
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
    <ModalForm
      key="pass"
      title="确定？通过后将进入下一个审核步骤！"
      trigger={
        <Button
          type="primary"
          shape="round"
          size="large"
          loading={loading}
        >
          {workflowDetail?.workflow?.node === 1 ? '提交' : '通过'}
        </Button>
      }
      onFinish={async (formData) => {
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
              const {errorFields} = e;
              message.error(errorFields[0]?.errors);
            } else {
              console.error(e);
              message.error('提交数据失败');
            }
            return;
          }
        }
        WorkflowExamineApprove({
          id: workflowId,
          data: workflowData,
          explain: formData?.explain ?? '',
          remarks: remarks,
        }).then((result) => {
          if (codeOk(result.code)) {
            message.success('操作成功');
            // 返回列表页
            history.push(`/workflow/success/${workflowId}`);
          }
        }).finally(() => {
          hide();
          setLoading(false);
        });
      }}
    >
      <ProFormTextArea
        label="要不要写点什么?"
        name="explain"
        placeholder="您可以写一些文字来提醒下一个人"
      />
    </ModalForm>,
  ];

  const content = (
    <Descriptions size="small" column={3}>
      <Descriptions.Item label="工作流标题">
        {workflowDetail?.workflow?.title ?? '-'}
      </Descriptions.Item>
      <Descriptions.Item label="工作流编号">
        {
          workflowDetail?.workflow?.serials ? <Paragraph copyable>{workflowDetail.workflow.serials}</Paragraph> : '-'
        }
      </Descriptions.Item>
      <Descriptions.Item label="工作流类型">
        {workflowDetail?.workflow?.type_name ?? '-'}
      </Descriptions.Item>
      <Descriptions.Item label="创建人">
        {
          workflowDetail?.workflow?.nickname ? <Paragraph copyable>{workflowDetail.workflow.nickname}</Paragraph> : '-'
        }
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">
        {
          workflowDetail?.workflow?.create_time ?
          moment(workflowDetail?.workflow?.create_time).format('YYYY-MM-DD HH:mm:ss') : '-'
        }
      </Descriptions.Item>
      <Descriptions.Item label="当前步骤">
        {workflowDetail?.node?.name ?? '-'}
      </Descriptions.Item>
      <Descriptions.Item label="当前状态">
        <WorkflowStatusBadge status={workflowDetail?.workflow?.status ?? -1}/>
      </Descriptions.Item>
      <Descriptions.Item label="审批人">
        <Space>
          {workflowDetail?.operators &&
            workflowDetail.operators.map((item: any) => {
              if (item?.nickname) {
                return <div>{item.nickname ?? ''}</div>;
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
        workflowDetail?.operatorIds && workflowDetail.operatorIds.indexOf(currentUser.id) !== -1
          ? extra
          : []
      }
      content={content}
    >
      {workflowDetail?.workflow?.node === 1 && (
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

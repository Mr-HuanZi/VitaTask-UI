import React, {useEffect, useRef, useState} from 'react';
import {Button, Input, message, Modal, Typography} from 'antd';
import {PageContainer, ProCard} from '@ant-design/pro-components';
import {useParams} from '@umijs/max';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {WorkflowInitiate, WorkflowTypeDetailByOnlyName} from '@/services/workflow/api';
import {history} from '@@/core/history';
import BasicException from '@/exceptions/BasicException';
import {codeOk} from "@/units";

const { confirm } = Modal;
const { Title } = Typography;
const { TextArea } = Input;

const Initiate: React.FC = () => {
  const detailContentActionRef = useRef<WorkflowAPI.DetailContentRef>();

  const [workflowType, setWorkflowType] = useState<WorkflowAPI.WorkflowType>();
  const [remarks, setRemarks] = useState<string>('');

  const [messageApi, contextHolder] = message.useMessage();

  // 获取路由参数
  const routeParams: any = useParams();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { name } = routeParams;
    WorkflowTypeDetailByOnlyName(name).then((result) => {
      if (codeOk(result.code)) {
        setWorkflowType(result.data);
      }
    });
  }, [routeParams]);

  const submitExamineApprove = () => {
    confirm({
      title: '确定?',
      icon: <ExclamationCircleOutlined />,
      content: '请确认数据已经填写完毕',
      onOk: async () => {
        setLoading(true);
        const hide = messageApi.loading('加载中');
        let workflowData: any = {};
        // 先执行子组件的方法
        if (detailContentActionRef.current?.submit !== undefined) {
          try {
            const result = await detailContentActionRef.current?.submit();
            // 工作流子表数据
            workflowData = result?.data ?? null;
          } catch (e: any) {
            hide();
            setLoading(false);
            if (e instanceof BasicException) {
              messageApi.error(e.message);
            } else if ('errorFields' in e) {
              // 表单校验失败
              const { errorFields } = e;
              messageApi.error(errorFields[0]?.errors);
            } else {
              console.error(e);
              messageApi.error('提交数据失败');
            }
            return;
          }
        }
        WorkflowInitiate({
          type_id: workflowType?.id ?? 0,
          remarks,
          data: workflowData,
        })
          .then((result) => {
            if (codeOk(result.code)) {
              messageApi.success('操作成功');
              history.push(`/workflow/success/${result.data?.id ?? 0}`);
            }
          })
          .finally(() => {
            hide();
            setLoading(false);
          });
      },
    });
  };

  const selectInitiatePage = () => {
    return <></>;
  };

  return (
    <>
      {contextHolder}
      <PageContainer
        title={`发起[${workflowType?.name ?? ''}]工作流`}
        extra={[
          <Button
            key="1"
            type="primary"
            shape="round"
            size="large"
            loading={loading}
            onClick={submitExamineApprove}
          >
            提交
          </Button>,
        ]}
      >
        <ProCard title={<Title level={5}>备注</Title>} className={`m-b-15`}>
          <TextArea
            rows={4}
            placeholder="发起的原因或者需要告知审批人的话"
            maxLength={6}
            onChange={(e) => {
              setRemarks(e.target.value);
            }}
          />
        </ProCard>
        {selectInitiatePage()}
      </PageContainer>
    </>
  );
};

export default Initiate;

import React, {useEffect, useState} from 'react';
import {Button, Input, message, Modal, Typography} from 'antd';
import {PageContainer, ProCard} from '@ant-design/pro-components';
import {useParams} from '@umijs/max';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {NewWorkflow, WorkflowInitiate} from '@/services/workflow/api';
import {history} from '@@/core/history';
import {codeOk, isEmpty} from "@/units";
import FormRender, { useForm } from 'form-render';

const { confirm } = Modal;
const { Title } = Typography;
const { TextArea } = Input;

const Initiate: React.FC = () => {
  const formRef = useForm();

  const [workflowName, setWorkflowName] = useState<string>('');
  const [workflowId, setWorkflowId] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [firstNodeSchema, setFirstNodeSchema] = useState<object>();

  const [messageApi, contextHolder] = message.useMessage();

  // 获取路由参数
  const routeParams: any = useParams();

  useEffect(() => {
    const { name } = routeParams;
    NewWorkflow(name).then((result) => {
      if (codeOk(result.code)) {
        setWorkflowName(result.data?.name ?? '');
        setWorkflowId(result.data?.id ?? 0);
        setFirstNodeSchema(JSON.parse(result.data?.first_node_schema ?? ''));
        console.log(JSON.parse(result.data?.first_node_schema ?? ''));
      }
    });
  }, [routeParams]);

  const submitExamineApprove = () => {
    confirm({
      title: '确定?',
      icon: <ExclamationCircleOutlined />,
      content: '请确认数据已经填写完毕',
      onOk: async () => {
        let workflowData: any = {};

        setLoading(true);
        const hide = messageApi.loading('加载中');

        // 获取表单数据
        const moreData = formRef.getValues();

        WorkflowInitiate({
          type_id: workflowId,
          remarks,
          data: workflowData,
          more_data: !isEmpty(moreData) ? moreData : null,
        }).then((result) => {
          if (codeOk(result.code)) {
            messageApi.success('操作成功');
            history.push(`/workflow/success/${result.data?.id ?? 0}`);
          }
        }).finally(() => {
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
        title={`发起[${workflowName}]工作流`}
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
        {firstNodeSchema && (
          <ProCard title={<Title level={5}>附加信息</Title>} className={`m-b-15`}>
            <FormRender
              form={formRef}
              schema={firstNodeSchema}
              footer={false}
            />
          </ProCard>
        )}
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

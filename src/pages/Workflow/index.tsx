import React, {useCallback, useRef, useState} from 'react';
import { PageContainer, ModalForm } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import TableList from "@/pages/Workflow/components/TableList";
import WorkflowTypeSelect from "@/pages/Workflow/components/WorkflowTypeSelect";
import {Button, message} from "antd";
import {CheckCircleOutlined, ClockCircleOutlined, SendOutlined} from "@ant-design/icons";
import {history} from "umi";

const Workflow: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<any>();
  const [TableExcludedField, setTableExcludedField] = useState<string[]>();
  const [tabActiveKey, setTabActiveKey] = useState<string>('todo');
  const [headerTitle, setHeaderTitle] = useState<string>('我的待办');

  const actionRef = useRef<ActionType>();

  const [messageApi, contextHolder] = message.useMessage();

  const handleTabChange = useCallback((key: string) => {
    setTabActiveKey(key);
    switch (key) {
      case 'initiated':
      default:
        setTableExcludedField(undefined);
        setHeaderTitle('我发起的');
        break;
      case 'todo':
        setTableExcludedField(['submit_num', 'operator']);
        setHeaderTitle('我的待办');
        break;
      case 'completed':
        setTableExcludedField(['create_time', 'submit_num', 'operator']);
        setHeaderTitle('我的已办');
    }

    // 刷新表格
    actionRef.current?.reload();
  }, []);

  const WorkflowTypeSelectToolBar = (
    <ModalForm
      autoFocusFirstInput
      layout="horizontal"
      title="发起工作流"
      modalProps={{
        destroyOnClose: true,
      }}
      trigger={
        <Button type="primary">
          <SendOutlined/>
          发起工作流
        </Button>
      }
      onFinish={async () => {
        if (selectedValue) {
          history.push(`/workflow/initiate/${selectedValue}`);
        } else {
          messageApi.error('请选择工作流类型');
        }
      }}
    >
      <WorkflowTypeSelect
        onChange={v => {
          setSelectedValue(v);
        }}
      />
    </ModalForm>
  )

  return (
    <>
      {contextHolder}
      <PageContainer
        onTabChange={handleTabChange}
        tabActiveKey={tabActiveKey}
        header={{title: headerTitle}}
        extra={[
          WorkflowTypeSelectToolBar,
        ]}
        tabList={[
          {
            tab: (<span><ClockCircleOutlined/>我的待办</span>),
            key: 'todo',
          },
          {
            tab: (<span><SendOutlined/>我发起的</span>),
            key: 'initiated',
          },
          {
            tab: (<span><CheckCircleOutlined/>我的已办</span>),
            key: 'completed',
          },
        ]}
      >
        <TableList
          requestType={tabActiveKey}
          ExcludedField={TableExcludedField}
          actionRef={actionRef}
        />
      </PageContainer>
    </>
  );
};

export default Workflow;

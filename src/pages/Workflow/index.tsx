import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {WorkflowList} from '@/services/workflow/api';
import TableList from "@/pages/Workflow/components/TableList";
import WorkflowTypeSelect from "@/pages/Workflow/components/WorkflowTypeSelect";
import {Button, message} from "antd";
import {SendOutlined} from "@ant-design/icons";
import {ModalForm} from "@ant-design/pro-form";
import {history} from "umi";

const Workflow: React.FC = () => {
  const [selectedValue, setSelectedValue] = React.useState<any>();

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
          message.error('请选择工作流类型');
        }
      }}
    >
      <WorkflowTypeSelect
        onChange={v => {
          console.log(v);
          setSelectedValue(v);
        }}
      />
    </ModalForm>
  )

  return (
    <PageContainer>
      <TableList
        requestFn={WorkflowList}
        toolBarRender={[WorkflowTypeSelectToolBar]}
      />
    </PageContainer>
  );
};

export default Workflow;

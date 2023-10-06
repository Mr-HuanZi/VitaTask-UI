import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { WorkflowList } from '@/services/workflow/api';
import TableList from "@/pages/Workflow/components/TableList";

const Workflow: React.FC = () => {
  return (
    <PageContainer>
      <TableList
        requestFn={WorkflowList}
      />
    </PageContainer>
  );
};

export default Workflow;

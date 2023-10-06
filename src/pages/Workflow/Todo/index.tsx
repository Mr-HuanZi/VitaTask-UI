import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { WorkflowTodo } from '@/services/workflow/api';
import TableList from "@/pages/Workflow/components/TableList";

const Messages: React.FC = () => {

  return (
    <PageContainer>
      <TableList
        requestFn={WorkflowTodo}
        ExcludedField={['submit_num', 'operator']}
      />
    </PageContainer>
  );
};

export default Messages;

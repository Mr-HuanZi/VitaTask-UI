import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { WorkflowHandled } from '@/services/workflow/api';
import TableList from "@/pages/Workflow/components/TableList";

const Handled: React.FC = () => {

  return (
    <PageContainer>
      <TableList
        requestFn={WorkflowHandled}
        ExcludedField={['create_time', 'submit_num', 'operator']}
      />
    </PageContainer>
  );
};

export default Handled;

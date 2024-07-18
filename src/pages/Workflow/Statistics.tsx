import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { WorkflowAllList } from '@/services/workflow/api';
import TableList from "@/pages/Workflow/components/TableList";

const Statistics: React.FC = () => {
  return (
    <PageContainer>
      <TableList
        requestFn={WorkflowAllList}
      />
    </PageContainer>
  );
};

export default Statistics;

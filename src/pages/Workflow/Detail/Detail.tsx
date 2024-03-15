import type {MutableRefObject} from 'react';
import React from 'react';

interface DetailContentPropsI {
  Workflow: any;
  actionRef: MutableRefObject<WorkflowAPI.DetailContentRef | undefined>;
}

const DetailContent: React.FC<DetailContentPropsI> = () => {
  return <div>工作流无详情或未配置详情页</div>;
};

export default DetailContent;

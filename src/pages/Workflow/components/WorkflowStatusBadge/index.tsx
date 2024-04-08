import {Badge} from "antd";
import React from "react";

interface WorkflowStatusBadgePropsI {
  status: number;
}

const WorkflowStatusBadge: React.FC<WorkflowStatusBadgePropsI> = (props) => {
  const {status} = props;
  switch (status) {
    case 0:
      return <Badge color="purple" text="已作废"/>;
    case 1:
      return <Badge status="success" text="已完成"/>;
    case 2:
      return <Badge status="processing" text="进行中"/>;
    case 3:
      return <Badge status="error" text="已驳回"/>;
    default:
      return <Badge status="default" text="未知"/>;
  }
}

export default WorkflowStatusBadge;

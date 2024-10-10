import React, {useMemo, useState} from "react";
import WorkflowBase from "@/pages/Settings/Workflow/components/WorkflowBase";
import WorkflowNodeEdit from "@/pages/Settings/Workflow/components/WorkflowNodeEdit";
import WorkflowNodeSchema from "@/pages/Settings/Workflow/components/WorkflowNodeSchema";
import {Drawer, Tabs} from "antd";

interface WorkflowManageDrawerPropsI {
  workflowTypeId: number;
  onDrawerClose: () => void;
  drawerOpen: boolean;
  saveSuccess?: (entity: WorkflowAPI.WorkflowType) => void;
}

/**
 * 工作流管理页抽屉
 * @param workflowTypeId
 * @param onDrawerClose
 * @param drawerOpen
 * @param saveSuccess
 * @constructor
 */
const WorkflowManageDrawer: React.FC<WorkflowManageDrawerPropsI> = ({workflowTypeId, onDrawerClose, drawerOpen,saveSuccess}) => {
  const [updateTime, setUpdateTime] = useState(0);

  const tabsItems = useMemo(() => ([
    {
      label: '基本设置',
      key: 'base',
      children: <WorkflowBase
        id={workflowTypeId}
        saveSuccess={saveSuccess}
      />
    },
    { label: '节点管理', key: 'nodes', children: <WorkflowNodeEdit id={workflowTypeId}/> },
    {
      label: '表单设计',
      key: 'form',
      children: <WorkflowNodeSchema id={workflowTypeId} updateTime={updateTime}/>,
    },
  ]), [workflowTypeId]);

  return (
    <Drawer
      title="工作流管理"
      placement="right"
      width="85vw"
      onClose={onDrawerClose}
      open={drawerOpen}
      destroyOnClose={true}
    >
      <Tabs
        items={tabsItems}
        tabPosition="left"
        onTabClick={(key) => {
          if (key === 'form') {
            setUpdateTime(Date.now());
          }
        }}
      />
    </Drawer>
  );
};

export default WorkflowManageDrawer;

import React, {useRef, useState} from 'react';
import {ActionType, PageContainer} from '@ant-design/pro-components';
import TaskDetail from './components/TaskDetail';
import TaskList from "@/pages/Task/components/TaskList";
import TaskEdit from "@/pages/Task/components/TaskEdit";
import {TaskAPI} from "@/services/task/typings";

const Messages: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [detailVisible, setDetailVisible] = useState(false);
  const [thatTask, setThatTask] = useState<TaskAPI.Task>();
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);

  const handleTaskDetailClose = () => {
    setDetailVisible(false);
    actionRef.current?.reload();
  }

  return (
    <PageContainer>
      <TaskList
        actionRef={actionRef}
        onTitleClick={(entity: TaskAPI.Task) => {
          setThatTask(entity);
          setDetailVisible(true);
        }}
        onEditClick={(entity: TaskAPI.Task) => {
          setThatTask(entity);
          setEditDrawerVisible(true);
        }}
      />
      <TaskDetail
        title="任务详情"
        taskId={thatTask?.id}
        visible={detailVisible}
        onClose={handleTaskDetailClose}
        onEditClick={() => {
          setDetailVisible(false);
          setEditDrawerVisible(true);
        }}
      />
      <TaskEdit
        taskId={thatTask?.id}
        open={editDrawerVisible}
        onClose={() => setEditDrawerVisible(false)}
      />
    </PageContainer>
  );
};

export default Messages;

import React, {useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import TaskDetail from './components/TaskDetail';
import TaskList from "@/pages/Task/components/TaskList";
import TaskEdit from "@/pages/Task/components/TaskEdit";

const Messages: React.FC = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [thatTask, setThatTask] = useState<TaskAPI.Task>();
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);

  return (
    <PageContainer>
      <TaskList
        onTitleClick={(entity) => {
          setThatTask(entity);
          setDetailVisible(true);
        }}
        onEditClick={(entity) => {
          setThatTask(entity);
          setEditDrawerVisible(true);
        }}
      />
      <TaskDetail
        title="任务详情"
        taskId={thatTask?.id}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
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

import type {FC} from "react";
import React, {useEffect, useState} from "react";
import {Badge, Button, Drawer, Dropdown, Empty, message, Popconfirm, Space, Tabs} from "antd";
import {changeProjectTaskStatus, deleteTask, fetchTask, fetchTaskStatus} from "@/services/task/api";
import {codeOk, successMessage} from "@/units";
import {DeleteOutlined, DownOutlined, FormOutlined, ProfileTwoTone, StarTwoTone} from "@ant-design/icons";
import TaskLog from "@/pages/Task/components/TaskLog";
import Dialog from "@/components/Dialog";
import {TaskAPI} from "@/services/task/typings";
import TaskDetailTag from "@/pages/Task/components/TaskDetail/TaskDetailTag";

interface TaskDetailPropsI {
  title?: string;
  visible?: boolean;
  taskId?: number;
  onClose?: () => void;
  onEditClick?: (data: TaskAPI.Task) => void;
  hideAction?: boolean;
}

const TaskDetail: FC<TaskDetailPropsI> = ({title, visible, onClose, taskId, onEditClick, hideAction = false}) => {
  const [taskData, setTaskData] = useState<TaskAPI.Task>();
  const [taskStatusEnum, setTaskStatusEnum] = useState<TaskAPI.TaskStatus[]>([]);
  const [actionItems, setActionItems] = useState<any[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchTaskData = (id: number) => {
    fetchTask({id: id}).then(r => {
      const {code, data} = r;
      if (codeOk(code)) {
        setTaskData(data);
      }
    });
  }

  useEffect(() => {
    if (taskId) {
      fetchTaskData(taskId);
    } else {
      setTaskData(undefined);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTaskStatus().then(r => {
      const {code, data} = r;
      if (codeOk(code) && data) {
        setTaskStatusEnum(data);
        setActionItems(data.map((item: TaskAPI.TaskStatus) => (
          { label: (<Badge status={item?.status ?? 'error'} text={item.label} />), key: item.value }
        )));
      }
    });
  }, []);

  const handleDropdownClick = (key: string) => {
    changeProjectTaskStatus({ id: taskData?.id ?? 0, status: parseInt(key) }).then(({ code }) => {
      if (codeOk(code)) {
        successMessage();
        fetchTaskData(taskData?.id ?? 0); // 更新数据
      }
    });
  };

  const getStatusDropdownDom = (status?: number) => {
    for (const item of taskStatusEnum) {
      if (item.value === status) {
        return (
          <Space>
            <Badge
              status={item.status}
            />
            <span>{item.label}</span>
          </Space>
        );
      }
    }
    return (
      <Space>
        <Badge status="default"/>
        未知
      </Space>
    );
  }

  /**
   * 删除任务
   */
  const onDeleteConfirm = () => {
    if (taskData) {
      deleteTask(taskData.id).then(({code}) => {
        if (codeOk(code)) {
          successMessage();
          if (onClose)
            onClose(); // 调用弹层关闭事件
        }
      });
    }
  }

  const drawerTitleDom = (
    <Space>
      <ProfileTwoTone />
      {title}
      <Dropdown
        trigger={["click"]}
        menu={{ items: actionItems, onClick: ({ key }) => handleDropdownClick(key) }}
      >
        <Button>
          <Space>
            {getStatusDropdownDom(taskData?.status)}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );

  const items = [
    {
      label: '详情',
      key: 'detail',
      children: taskData ? <TaskDetailTag taskData={taskData}/> : <Empty />
    },
    {
      label: '操作记录',
      key: 'logs',
      children: (
        <TaskLog taskIds={[taskId ?? 0]}/>
      )
    },
    {
      label: '聊天',
      key: 'dialog',
      children: (
        <Dialog dialogId={taskData?.dialog_id} />
      )
    },
  ];

  return (
    <>
      {contextHolder}
      <Drawer
        title={hideAction ? title : drawerTitleDom}
        width="60%"
        open={visible}
        onClose={onClose}
        closable={false}
        extra={!hideAction && (
          <Space size="large">
            <StarTwoTone style={{fontSize: "24px"}} onClick={() => messageApi.warning("未开放")} />
            <FormOutlined style={{fontSize: "20px"}} onClick={() => onEditClick && onEditClick(taskData as TaskAPI.Task)} />
            <Popconfirm
              title="确定删除该任务？"
              placement="bottomRight"
              onConfirm={onDeleteConfirm}
            >
              <DeleteOutlined style={{fontSize: "20px"}} />
            </Popconfirm>
          </Space>
        )}
      >
        <Tabs items={items} />
      </Drawer>
    </>
  );
}

export default TaskDetail;

import type {FC} from "react";
import React, {useEffect, useState} from "react";
import {Badge, Button, Col, Drawer, Dropdown, message, Popconfirm, Row, Space, Tabs, Tag, Typography} from "antd";
import {changeProjectTaskStatus, deleteTask, fetchTask, fetchTaskStatus} from "@/services/task/api";
import {codeOk, successMessage, timestampToString, toArray} from "@/units";
import UserItem, {UserInfo} from "@/components/UserItem";
import moment from 'moment';
import {DeleteOutlined, DownOutlined, FormOutlined, ProfileTwoTone, StarTwoTone} from "@ant-design/icons";
import styles from './index.less';
import TaskLog from "@/pages/Task/components/TaskLog";
import Dialog from "@/components/Dialog";
import {TaskAPI} from "@/services/task/typings";

const { Paragraph, Text, Title } = Typography;

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

  const TaskInfoItem: FC<{label: React.ReactNode}> = ({label, children}) => {
    return (
        <div className={styles.describeItemContainer}>
            <span className={styles.describeItemLabel}>{label}</span>
            <span className={styles.describeItemContent}>{children}</span>
        </div>
    );
  }

  const TaskInfoDom: FC<{data?: TaskAPI.Task}> = ({data}) => (
      <div className={styles.infoContainer}>
          <TaskInfoItem label="负责人">
              <UserItem users={data?.leader?.user_info}/>
          </TaskInfoItem>
          <TaskInfoItem label="协作人">
              <UserItem
                  users={toArray(data?.collaborator).map((item: any): UserInfo => ({
                      id: item.user_id,
                      avatar: item.user_info.avatar,
                      userLogin: item.user_info.userLogin,
                      userNickname: item.user_info.userNickname,
                  }))}
              />
          </TaskInfoItem>
          <TaskInfoItem label="计划时间">
              <Space split="~">
                  {toArray(taskData?.plan_time).map(item => timestampToString(item, "YYYY-MM-DD")) }
              </Space>
          </TaskInfoItem>
          <TaskInfoItem label="所属项目">
              {taskData?.project?.name}
          </TaskInfoItem>
          <TaskInfoItem label="任务组">
              {taskData?.group?.name}
          </TaskInfoItem>
      </div>
  );

  const TaskDescribe: FC<{describe: string}> = ({describe}) => (
    <>
      <Text type="secondary" strong>描述：</Text>
      <div className={styles.describe}><Paragraph><div dangerouslySetInnerHTML={{ __html: describe }} /></Paragraph></div>
    </>
  );

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
      children: (
        <>
          <div className={styles.header}>
            <Title level={4}>
              { taskData?.id && <Tag color="blue">{taskData?.id}</Tag> }
              { taskData?.title }
            </Title>
            <Space size="small" className={styles.content}>
              <UserItem users={taskData?.creator?.user_info} />
              <Text type="secondary">
                创建于{moment(taskData?.create_time).format('YYYY年M月D日 HH:mm')}，最后更新于
                {moment(taskData?.update_time).format('YYYY年M月D日 HH:mm')}
              </Text>
            </Space>
          </div>
          <Row>
            <Col span={17}>
              <TaskDescribe describe={taskData?.describe ?? ''}/>
            </Col>
            <Col span={7}>
              <TaskInfoDom data={taskData}/>
            </Col>
          </Row>
        </>
      )
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
    <Drawer
      title={hideAction ? title : drawerTitleDom}
      width="60%"
      open={visible}
      onClose={onClose}
      closable={false}
      extra={!hideAction && (
        <Space size="large">
          <StarTwoTone style={{fontSize: "24px"}} onClick={() => message.warning("未开放")} />
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
  );
}

export default TaskDetail;

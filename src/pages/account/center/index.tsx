import {HomeOutlined, LinkOutlined, MailOutlined, MobileOutlined} from '@ant-design/icons';
import {Avatar, Card, Col, Divider, Flex, Row, Space, Timeline, Typography} from 'antd';
import React, {useEffect, useMemo, useState} from 'react';
import {GridContent} from '@ant-design/pro-layout';
import type {RouteChildrenProps} from 'react-router';
import styles from './Center.less';
import { useModel, Link } from '@umijs/max';
import NotLoggedIn from "@/pages/user/components/NotLoggedIn";
import {queryProjects} from "@/services/project/api";
import {codeOk, errorMessage, timestampToString, toArray} from "@/units";
import UserItem from "@/components/UserItem";
import { ProCard } from "@ant-design/pro-components";
import {fetchTaskLogs} from "@/services/task/api";
import TaskDetail from "@/pages/Task/components/TaskDetail";
import {TaskAPI} from "@/services/task/typings";

const {Text} = Typography;

const Center: React.FC<RouteChildrenProps> = () => {
  const {initialState} = useModel('@@initialState');

  const [projects, setProjects] = useState<ProjectAPI.Project[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskAPI.TaskLog[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [taskId, setTaskId] = useState<number>(0);

  useEffect(() => {
    // 查询项目列表
    queryProjects({
      page: 1,
      pageSize: 6,
    }).then(({code, data}) => {
      if (codeOk(code)) {
        setProjects(data?.items ?? [])
      }
    });
    if (initialState?.currentUser?.id) {
      // 任务动态
      fetchTaskLogs({
        operator: initialState?.currentUser?.id,
        page: 1,
        pageSize: 10,
      }).then(({data}) => setTaskLogs(data?.items ?? []) );
    }

  }, [initialState?.currentUser?.id]);

  const timelineItems = useMemo(() => {
    const logs = [];
    for (const item: TaskAPI.TaskLog of toArray(taskLogs)) {
      logs.push({
        children: (
          <Flex justify="space-between">
            <Space>
              <UserItem users={item.operator_info}/>
              {item.message}
              <Text ellipsis={{ tooltip: item.task?.title }} style={{width: '255px'}}>
                任务：
                <a
                  onClick={() => {
                    setTaskId(item.task_id);
                    setDetailVisible(true);
                  }}
                >
                  {item.task?.title}
                </a>
              </Text>
            </Space>
            <div>
              {timestampToString(item.operate_time)}
            </div>
          </Flex>
        ),
      });
    }

    return logs;
  }, [taskLogs]);

  if (!initialState) {
    return <NotLoggedIn/>;
  }

  const {currentUser} = initialState;

  if (!currentUser || !currentUser.userNickname) {
    return <NotLoggedIn/>;
  }

  //  渲染用户信息
  const renderUserInfo = () => {
    return (
      <div className={styles.detail}>
        <p>
          <Space>
            <MailOutlined />
            {currentUser.userEmail}
          </Space>
        </p>
        <p>
          <Space>
            <MobileOutlined />
            {currentUser.mobile}
          </Space>
        </p>
        <p>
          <HomeOutlined
            style={{
              marginRight: 8,
            }}
          />
          广西南宁市良庆区
        </p>
      </div>
    );
  };

  return (
    <>
      <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card bordered={false} style={{marginBottom: 24}}>
            <div>
              <div className={styles.avatarHolder}>
                <Avatar src={currentUser.avatar} size={120} className={`m-b-15`}/>
                <div className={styles.name}>{currentUser.userNickname}</div>
                <div>{currentUser?.signature}</div>
              </div>
              {renderUserInfo()}
              <Divider style={{marginTop: 16}} dashed/>
              <div className={styles.projects}>
                <div className={styles.projectsTitle}>项目</div>
                <Row gutter={36}>
                  {projects &&
                    projects.map((item) => (
                      <Col key={item.id} lg={24} xl={12}>
                        <Link to={`/project/detail/${item.id}`}>
                          <Space>
                            <LinkOutlined/>
                            {item.name}
                          </Space>
                        </Link>
                      </Col>
                    ))}
                </Row>
              </div>
            </div>
          </Card>
        </Col>
        <Col lg={17} md={24}>
          <ProCard title="动态">
            <Timeline items={timelineItems}/>
          </ProCard>
        </Col>
      </Row>
    </GridContent>
      <TaskDetail
      hideAction
      title="任务详情"
      taskId={taskId}
      visible={detailVisible}
      onClose={() => setDetailVisible(false)}
      onEditClick={() => {
        errorMessage("此处不得修改任务信息");
      }}/>
    </>
  );
};
export default Center;

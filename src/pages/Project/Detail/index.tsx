import React, {useEffect, useState} from "react";
import {useParams} from '@umijs/max';
import {DashboardOutlined, ProfileOutlined, TeamOutlined} from "@ant-design/icons";
import TaskList from "@/pages/Task/components/TaskList";
import {fetchProjectDetail} from "@/services/project/api";
import {codeOk} from "@/units";
import {PageContainer} from "@ant-design/pro-components";
import type { MenuProps} from "antd";
import {Menu} from "antd";
import TaskDetail from "@/pages/Task/components/TaskDetail";
import TaskEdit from "@/pages/Task/components/TaskEdit";
import ProjectMember from "../components/ProjectMember";
import ProjectOverview from "@/pages/Project/components/ProjectOverview";
import {TaskAPI} from "@/services/task/typings";

const items: MenuProps['items'] = [
  {
    label: '项目概述',
    key: 'overview',
    icon: <DashboardOutlined />,
  },
  {
    label: '任务',
    key: 'task',
    icon: <ProfileOutlined />,
  },
  {
    label: '成员',
    key: 'member',
    icon: <TeamOutlined />,
  },
];

const ProjectDetail: React.FC = () => {
  // 获取路由参数
  const routeParams: any = useParams();

  const [current, setCurrent] = useState('overview');
  const [projectData, setProjectData] = useState<ProjectAPI.Project>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [thatTask, setThatTask] = useState<TaskAPI.Task>();

  useEffect(() => {
    const { id: projectId } = routeParams;
    fetchProjectDetail(parseInt(projectId)).then(r => {
      const {code, data} = r;
      if (codeOk(code)) {
        setProjectData(data);
      }
    });
  }, [routeParams]);

  const handleMenuClick: MenuProps['onClick'] = e => {
    setCurrent(e.key);
  }

  const currentDom = (curr: string) => {
    if (curr === 'task')
      return (
        <TaskList
          projectId={projectData?.id ?? 0}
          onTitleClick={(entity: TaskAPI.Task) => {
            setThatTask(entity);
            setDetailVisible(true);
          }}
          onEditClick={(entity: TaskAPI.Task) => {
            setThatTask(entity);
            setEditDrawerVisible(true);
          }}
        />
      );
    else if (curr === 'member'){
      return <ProjectMember projectId={projectData?.id ?? 0}/>
    } else if (curr === 'overview' && projectData) {
      return <ProjectOverview projectData={projectData} />
    }
    else {
      return <></>
    }
  }

  return (
    <>
      <PageContainer
        header={{
          title: projectData?.name
        }}
      >
        <Menu onClick={handleMenuClick} selectedKeys={[current]} mode="horizontal" items={items}/>
        <div className={`m-t-15`}>
          {currentDom(current)}
        </div>
      </PageContainer>
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
    </>
  );
}

export default ProjectDetail;

import {ProCard} from "@ant-design/pro-components";
import {Col, Flex, Row, Space, Timeline, Typography} from "antd";
import type {FC} from "react";
import {useEffect, useMemo, useState} from "react";
import UserItem from "@/components/UserItem";
import {errorMessage, timestampToString, toArray} from "@/units";
import {Area} from "@ant-design/charts";
import {fetchTaskLogs, getTaskDailySituation} from "@/services/task/api";
import TaskGroup from "@/pages/Project/components/TaskGroup";
import TaskDetail from "@/pages/Task/components/TaskDetail";
import {TaskAPI} from "@/services/task/typings";
import ProjectInfoCard from "@/pages/Project/components/ProjectInfoCard";

const {Text} = Typography;

const areaConfig = {
  height: 335,
  xField: 'date',
  yField: 'value',
  seriesField: 'label',
};

interface ProjectOverviewProps {
  projectData: ProjectAPI.Project
}

const ProjectOverview: FC<ProjectOverviewProps> = ({projectData}) => {
  const [areaData, setAreaData] = useState([]);


  const [taskLogs, setTaskLogs] = useState<TaskAPI.TaskLog[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [taskId, setTaskId] = useState<number>(0);

  useEffect(() => {
    // 每日任务统计(后端默认是最近7天)
    getTaskDailySituation({
      project: projectData.id,
    }).then(({data}) => setAreaData(data ?? []));
    // 任务动态
    fetchTaskLogs({
      project_id: projectData.id,
      page: 1,
      pageSize: 10,
    }).then(({data}) => setTaskLogs(data?.items ?? []) );
  }, [projectData]);

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

  return (
    <>
      <Row gutter={[32, 16]}>
        <Col span={6}>
          <ProjectInfoCard projectId={projectData.id} projectArchive={projectData?.archive} leaderInfo={projectData?.leader?.userInfo} createTime={projectData.create_time}/>
        </Col>
        <Col span={18}>
          <Area {...areaConfig} data={areaData} />
        </Col>
        <Col xxl={10} lg={12}>
          <TaskGroup project={projectData?.id ?? 0} />
        </Col>
        <Col xxl={14} lg={12}>
          <ProCard title="动态">
            <Timeline items={timelineItems}/>
          </ProCard>
        </Col>
      </Row>
      <TaskDetail
        hideAction
        title="任务详情"
        taskId={taskId}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        onEditClick={() => {
          errorMessage("此处不得修改任务信息");
        }}
      />
    </>
  )
}

export default ProjectOverview;

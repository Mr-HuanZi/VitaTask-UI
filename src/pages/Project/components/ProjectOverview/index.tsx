import {ProCard} from "@ant-design/pro-components";
import {Col, Flex, Row, Space, Tag, Timeline, Typography} from "antd";
import type {FC} from "react";
import {useEffect, useMemo, useState} from "react";
import UserItem from "@/components/UserItem";
import {codeOk, errorMessage, timestampToString, toArray} from "@/units";
import {Area, Pie} from "@ant-design/charts";
import {fetchTaskLogs, fetchTaskStatistics, getTaskDailySituation} from "@/services/task/api";
import TaskGroup from "@/pages/Project/components/TaskGroup";
import TaskDetail from "@/pages/Task/components/TaskDetail";
import {TaskAPI} from "@/services/task/typings";

const {Text} = Typography;

const taskCompletionRatePieConfig = {
  width: 100,
  height: 100,
  appendPadding: 10,
  angleField: 'value',
  colorField: 'type',
  radius: 1,
  innerRadius: 0.6,
  label: {
    type: 'inner',
    offset: '-50%',
    content: '{value}',
    style: {
      textAlign: 'center',
      fontSize: 14,
    },
  },
  interactions: [
    {
      type: 'element-selected',
    },
    {
      type: 'element-active',
    },
  ],
};

const taskDelayRatePieConfig = {
  width: 100,
  height: 100,
  appendPadding: 10,
  angleField: 'value',
  colorField: 'type',
  radius: 1,
  innerRadius: 0.6,
  label: {
    type: 'inner',
    offset: '-50%',
    content: '{value}',
    style: {
      textAlign: 'center',
      fontSize: 14,
    },
  },
  interactions: [
    {
      type: 'element-selected',
    },
    {
      type: 'element-active',
    },
  ],
};

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
  const [projectArchiveStatus, setProjectArchiveStatus] = useState<{
    text: string,
    color: string,
  }>();
  const [taskCompletionRate, setTaskCompletionRate] = useState<{type: string, value: number}[]>([]);
  const [taskDelayRate, setTaskDelayRate] = useState<{type: string, value: number}[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskAPI.TaskLog[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [taskId, setTaskId] = useState<number>(0);

  useEffect(() => {
    // 归档状态
    const projectStatusEnum = {
      0: {
        text: '开始',
        color: 'processing',
      },
      1: {
        text: '归档',
        color: 'success',
      },
    }
    setProjectArchiveStatus(projectStatusEnum[projectData?.archive ?? 0]);
    if (projectData) {
      fetchTaskStatistics(projectData.id).then(({code, data}) => {
        if (codeOk(code)) {
          setTaskCompletionRate([
            {
              type: '已完成',
              value: data?.completed ?? 0,
            },
            {
              type: '待处理',
              value: data?.processing ?? 0,
            },
          ]);
          setTaskDelayRate([
            {
              type: '按时完成',
              value: data?.finish_on_time ?? 0,
            },
            {
              type: '超时完成',
              value: data?.timeout_completion ?? 0,
            },
          ]);
        }
      });
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
    }
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
          <ProCard title="项目信息">
            <div className={`flex-space-around m-b-20`}>
              <Space direction="vertical" align="center">
                <Pie
                  {...taskCompletionRatePieConfig}
                  data={taskCompletionRate}
                  legend={false} // 关闭图例
                  // statistic 放在对象里IDE会报类型不正确
                  statistic={{
                    title: false,
                    content: false,
                  }}
                />
                <Text strong>任务完成率</Text>
              </Space>
              <Space direction="vertical" align="center">
                <Pie
                  {...taskDelayRatePieConfig}
                  data={taskDelayRate}
                  legend={false} // 关闭图例
                  // statistic 放在对象里IDE会报类型不正确
                  statistic={{
                    title: false,
                    content: false,
                  }}
                />
                <Text strong>任务延误率</Text>
              </Space>
            </div>
            <div className="m-b-10">
              <Text>负责人：</Text>
              <UserItem users={projectData?.leader?.userInfo} />
            </div>
            <div className="m-b-10">
              <Text>创建时间：</Text>
              <Text>{timestampToString(projectData?.create_time ?? 0)}</Text>
            </div>
            <div>
              <Text>任务状态：</Text>
              <Tag color={projectArchiveStatus?.color}>{projectArchiveStatus?.text}</Tag>
            </div>
          </ProCard>
        </Col>
        <Col span={18}>
          <Area {...areaConfig} data={areaData} />
        </Col>
        <Col span={12}>
          <TaskGroup project={projectData?.id ?? 0} />
        </Col>
        <Col span={12}>
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

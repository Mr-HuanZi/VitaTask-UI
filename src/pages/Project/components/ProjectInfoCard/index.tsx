import {FC, useEffect, useMemo, useState} from "react";
import {fetchTaskStatistics} from "@/services/task/api";
import {codeOk, timestampToString} from "@/units";
import {Space, Tag, Typography} from "antd";
import {Pie} from "@ant-design/charts";
import UserItem from "@/components/UserItem";
import {ProCard} from "@ant-design/pro-components";

const {Text} = Typography;

export interface ProjectInfoCardProps {
  projectId: number;
  projectArchive?: number;
  leaderInfo?: MemberAPI.Member;
  createTime?: number;
}

type projectStatus = {text: string, color: string};

// 归档状态
const projectStatusEnum: Record<number, projectStatus> = {
  0: {
    text: '开始',
    color: 'processing',
  },
  1: {
    text: '归档',
    color: 'success',
  },
}

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

const ProjectInfoCard: FC<ProjectInfoCardProps> = ({projectId, leaderInfo, projectArchive, createTime}) => {

  const [taskCompletionRate, setTaskCompletionRate] = useState<{type: string, value: number}[]>([]);
  const [taskDelayRate, setTaskDelayRate] = useState<{type: string, value: number}[]>([]);

  useEffect(() => {
    if (projectId && projectId <= 0)
      return;

    fetchTaskStatistics(projectId).then(({code, data}) => {
      if (codeOk(code)) {
        setTaskCompletionRate([
          {type: '已完成', value: data?.completed ?? 0},
          {type: '待处理', value: data?.processing ?? 0},
        ]);
        setTaskDelayRate([
          {type: '按时完成', value: data?.finish_on_time ?? 0},
          {type: '超时完成', value: data?.timeout_completion ?? 0},
        ]);
      }
    });
  }, [projectId]);

  const projectArchiveStatus = useMemo(() => {
    return projectStatusEnum[projectArchive || 0];
  }, [projectArchive]);

  return (
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
        <UserItem users={leaderInfo} />
      </div>
      <div className="m-b-10">
        <Text>创建时间：</Text>
        <Text>{timestampToString(createTime ?? 0)}</Text>
      </div>
      <div>
        <Text>任务状态：</Text>
        <Tag color={projectArchiveStatus?.color}>{projectArchiveStatus?.text}</Tag>
      </div>
    </ProCard>
  )
}

export default ProjectInfoCard;

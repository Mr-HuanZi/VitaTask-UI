import {FC} from "react";
import styles from './index.less';
import {timestampToString, toArray} from "@/units";
import UserItem, {UserInfo} from "@/components/UserItem";
import TaskInfoItem from "./TaskInfoItem";
import {Space} from "antd";
import {TaskAPI} from "@/services/task/typings";

interface TaskInfoProps {
  leaderInfo?: MemberAPI.Member;
  collaborator?: TaskAPI.TaskMember[];
  projectName?: string;
  groupName?: string;
  planTime?: string[]|number[];
}

const TaskInfo: FC<TaskInfoProps> = (props) => {
  const { leaderInfo, collaborator, projectName, groupName, planTime } = props;

  return (
    <div className={styles.infoContainer}>
      <TaskInfoItem label="负责人">
        {leaderInfo && <UserItem users={leaderInfo}/>}
      </TaskInfoItem>
      <TaskInfoItem label="协作人">
        <UserItem
          users={toArray(collaborator).map((item: any): UserInfo => ({
            id: item.user_id,
            avatar: item.user_info.avatar,
            userLogin: item.user_info.userLogin,
            userNickname: item.user_info.userNickname,
          }))}
        />
      </TaskInfoItem>
      <TaskInfoItem label="计划时间">
        <Space split="~">
          {toArray(planTime).map(item => timestampToString(item, "YYYY-MM-DD")) }
        </Space>
      </TaskInfoItem>
      <TaskInfoItem label="所属项目">
        {projectName}
      </TaskInfoItem>
      <TaskInfoItem label="任务组">
        {groupName}
      </TaskInfoItem>
    </div>
  );
};

export default TaskInfo;

// @ts-ignore
/* eslint-disable */

declare namespace TaskAPI {
  type Task = {
    id: number;
    project_id: string;
    group_id: number;
    title: string;
    describe: string;
    status: number;
    level: number;
    complete_date: string;
    archived_date: string;
    start_date: string;
    end_date: string;
    enclosure_num: string;
    dialog_id: number;
    create_time: string;
    update_time?: string;
    deleted: string;
    plan_time?: number[];
    project?: ProjectAPI.Project;
    leader?: TaskMember;
    member?: TaskMember[];
    creator?: TaskMember;
    collaborator?: TaskMember[];
    group?: TaskGroup;
  };

  type TaskForm = {
    id?: number;
    project: number;
    group: number;
    title: string;
    describe?: string;
    level: number;
    plan_time?: string[];
    leader: number;
    collaborator: number[];
  }

  type TaskListSearchParam = API.PageParams & {
    id?: number;
    project?: number;
    group?: number;
    title?: string;
    level?: number;
    plan_time?: string[];
    leader?: number;
    collaborator?: number[];
    project_search?: number
  }

  type TaskMember = {
    id: number;
    task_id: number;
    user_id: number;
    role: number;
    user_info: MemberAPI.Member;
  }

  type TaskStatus = {
    label: string;
    value: number;
    status: TaskStatusEnum;
  };

  type TaskGroup = {
    id: number;
    project_id?: string;
    name?: string;
    create_time?: number;
  }

  type TaskGroupListSearchParam = API.PageParams & {
    create_time?: string[];
    project?: number;
    name?: string;
  }

  type TaskGroupForm = {
    id?: number;
    project: number;
    name: string;
  }

  type TaskStatistics = {
    completed?: number;
    processing?: number;
    finish_on_time?: number;
    timeout_completion?: number;
  }

  type TaskDailySituationQuery = {
    project: number;
    start_date?: string;
    end_date?: string;
  }

  type TaskLogQueryParams = API.PageParams & {
    project_id?: number;
    task_id?: number[];
    operate_type?: string;
    operator?: number;
    operate_time?: string[];
    create_time?: string[];
  }

  type TaskLog = {
    id: number;
    task_id: number;
    operate_type: string;
    operator: number;
    operate_time: number;
    message: string;
    create_time?: number;
    task?: Task;
    operator_info?: MemberAPI.Member;
  }
}

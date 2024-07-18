// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 任务列表接口 POST /task/list */
export async function queryTaskList(params: any, options?: { [key: string]: any }) {
  return request<API.CResult<API.PageResult<TaskAPI.Task[]>>>('/task/list', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建任务接口 POST /task/create */
export async function createTask(params: TaskAPI.TaskForm, options?: { [key: string]: any }) {
  return request<API.CResult<TaskAPI.Task>>('/task/create', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 任务详情接口 POST /task/detail */
export async function fetchTask(body: { id: number }, options?: { [key: string]: any }) {
  return request<API.CResult<TaskAPI.Task>>('/task/detail', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 任务详情接口 POST /task/detail */
export async function fetchTaskStatus(options?: { [key: string]: any }) {
  return request<API.CResult<TaskAPI.TaskStatus[]>>('/task/status', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 任务状态列表接口 POST /task/change-status */
export async function changeProjectTaskStatus(
  body: { id: number; status: number },
  options?: { [key: string]: any },
) {
  return request<API.CResult>('/task/change-status', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 创建任务接口 POST /task/update */
export async function updateTask(params: TaskAPI.TaskForm, options?: { [key: string]: any }) {
  return request<API.CResult<TaskAPI.Task>>('/task/update', {
    method: 'POST',
    data: {
      ...params,
    },
    params: {id: params.id},
    ...(options || {}),
  });
}

/** 删除任务接口 POST /task/delete */
export async function deleteTask(id: number, options?: { [key: string]: any }) {
  return request<API.CResult<TaskAPI.Task>>('/task/delete', {
    method: 'POST',
    data: {id},
    params: {id}, // 备用，兼容
    ...(options || {}),
  });
}

/** 任务组简单列表接口 POST /task/delete */
export async function taskGroupSimpleList(projectId: number, options?: { [key: string]: any }) {
  return request<API.CResult<API.SimpleList[]>>('/task/group/simple-list', {
    method: 'POST',
    data: {id: projectId},
    params: {id: projectId}, // 备用，兼容
    ...(options || {}),
  });
}

/** 任务每日状态接口 POST /task/daily-situation */
export async function getTaskDailySituation(body: TaskAPI.TaskDailySituationQuery, options?: { [key: string]: any }) {
  return request<API.CResult<any>>('/task/daily-situation', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取任务完成量接口 POST /mock/task/statistics */
export async function fetchTaskStatistics(projectId: number, options?: { [key: string]: any }) {
  return request<API.CResult<TaskAPI.TaskStatistics>>('/task/statistics', {
    method: 'POST',
    data: {id: projectId},
    params: {id: projectId}, // 备用，兼容
    ...(options || {}),
  });
}

/** 任务组列表接口 POST /task/group/list */
export async function queryTaskGroupList(body: TaskAPI.TaskGroupListSearchParam, options?: { [key: string]: any }) {
  return request<API.CResult<API.PageResult<TaskAPI.TaskGroup[]>>>('/task/group/list', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 任务组简单列表接口 POST /task/group/simple-list */
export async function queryTaskGroupSimpleList(body: {id: number}, options?: { [key: string]: any }) {
  return request<API.CResult<TaskAPI.TaskGroup[]>>('/task/group/simple-list', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 新增任务组接口 POST /task/group/add */
export async function addTaskGroup(body: TaskAPI.TaskGroupForm, options?: { [key: string]: any }) {
  return request<API.CResult<TaskAPI.TaskGroup>>('/task/group/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 更新任务组接口 POST /task/group/update */
export async function updateTaskGroup(body: TaskAPI.TaskGroupForm, options?: { [key: string]: any }) {
  return request<API.CResult<TaskAPI.TaskGroup>>('/task/group/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 删除任务组接口 POST /task/group/delete */
export async function deleteTaskGroup(id: number, options?: { [key: string]: any }) {
  return request<API.CResult<API.PageResult<TaskAPI.TaskGroup[]>>>('/task/group/delete', {
    method: 'POST',
    data: {id},
    ...(options || {}),
  });
}

/** 任务日志列表接口 POST /task/log/list */
export async function fetchTaskLogs(body: TaskAPI.TaskLogQueryParams, options?: { [key: string]: any }) {
  return request<API.CResult<API.PageResult<TaskAPI.TaskLog[]>>>('/task/log/list', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 获取任务操作类型接口 POST /task/log/operators */
export async function fetchTaskLogOperators(options?: { [key: string]: any }) {
  return request<API.CResult<any>>('/task/log/operators', {
    method: 'POST',
    ...(options || {}),
  });
}


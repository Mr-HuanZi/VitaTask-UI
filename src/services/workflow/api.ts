// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {ProSchemaValueEnumType} from "@ant-design/pro-utils/lib/typing";

/******************* 工作流类型 *******************/
/** 工作流类型列表(下拉框专用) GET /workflow/type/options */
export async function WorkflowTypeOptions(params: any, options?: { [key: string]: any }) {
  return request<API.CResult<WorkflowAPI.WorkflowType[]>>('/workflow/type/options', {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

/** 工作流类型列表 POST /workflow/type/list */
export async function WorkflowTypeList(
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.CResult<API.PageResult<WorkflowAPI.WorkflowType[]>>>('/workflow/type/list', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 工作流类型名称修改 POST /workflow/type/update */
export async function WorkflowTypeUpdate(
  body: { id: number; name: string },
  options?: { [key: string]: any },
) {
  return request<API.CResult<WorkflowAPI.WorkflowType>>('/workflow/type/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 创建工作流模板 POST /workflow/type/add */
export async function WorkflowTypeAdd(
  body: { id: number; name: string },
  options?: { [key: string]: any },
) {
  return request<API.CResult<WorkflowAPI.WorkflowType>>('/workflow/type/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 工作流类型详情接口 POST /workflow/type/detail */
export async function WorkflowTypeDetail(id: number, options?: { [key: string]: any }) {
  return request<API.CResult<WorkflowAPI.WorkflowType>>('/workflow/type/detail', {
    method: 'POST',
    data: { id },
    ...(options || {}),
  });
}

/** 工作流类型详情(根据OnlyName)接口 POST /workflow/type/detail/only */
export async function WorkflowTypeDetailByOnlyName(onlyName: string, options?: { [key: string]: any }) {
  return request<API.CResult<WorkflowAPI.WorkflowType>>('/workflow/type/detail/only', {
    method: 'POST',
    data: { id: onlyName },
    ...(options || {}),
  });
}


/******************* 工作流节点 *******************/
/** 工作流节点列表 POST /workflow/node/list */
export async function WorkflowNodeLists(
  body: WorkflowAPI.NodePageParams,
  options?: { [key: string]: any },
) {
  return request<API.CResult<API.PageResult<WorkflowAPI.WorkflowNode[]>>>('/workflow/node/list', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 工作流节点删除 POST /workflow/node/delete */
export async function WorkflowNodeDelete(
  body: { id: number; workflow_type_id: number },
  options?: { [key: string]: any },
) {
  return request<API.CResult>('/workflow/node/delete', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 工作流节点修改 POST /workflow/node/update */
export async function WorkflowNodeUpdate(
  body: WorkflowAPI.WorkflowNode,
  options?: { [key: string]: any },
) {
  return request<API.CResult<WorkflowAPI.WorkflowNode>>('/workflow/node/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 工作流节点创建 POST /workflow/node/add */
export async function WorkflowNodeAdd(
  body: WorkflowAPI.WorkflowNode,
  options?: { [key: string]: any },
) {
  return request<API.CResult<WorkflowAPI.WorkflowNode>>('/workflow/node/add', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 工作流节点修改 POST /workflow/node/actions */
export async function FetchWorkflowNodeActions(options?: { [key: string]: any }) {
  return request<API.CResult<{ name: string; value: string }[]>>('/workflow/node/actions', {
    method: 'POST',
    ...(options || {}),
  });
}









/** 工作流状态类型列表(无分页) GET /workflow/status/list */
export async function WorkflowStatusList(options?: { [key: string]: any }) {
  return request<API.CResult<Map<number, ProSchemaValueEnumType>>>('/workflow/status/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 工作流流转处理 POST /workflow/examine-approve */
export async function WorkflowExamineApprove(
  body: {
    id: number;
    action?: 'next' | 'overrule' | 'cancel';
    explain?: string;
    node?: number;
    data?: any;
  },
  options?: { [keys: string]: any }
) {
  return request<API.CResult>('/workflow/examine-approve', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 工作流发起 POST /workflow/initiate */
export async function WorkflowInitiate(
  body: {
    type_id: number;
    remarks?: string;
    data?: any;
  },
  options?: { [keys: string]: any },
) {
  return request<API.CResult<any>>('/workflow/initiate', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 工作流日志列表 POST /workflow/log/lists */
export async function QueryWorkflowLogList(
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.CResult<API.PageResult<WorkflowAPI.WorkflowLogVo[]>>>('/workflow/log/lists', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 工作流详情 POST /workflow/detail */
export async function fetchWorkflowDetail(id: number, options?: { [keys: string]: any }) {
  return request<API.CResult<WorkflowAPI.WorkflowDetail>>('/workflow/detail', {
    method: 'POST',
    params: { id },
    ...(options || {}),
  });
}

/** 我的代办工作流列表 POST /workflow/todo */
export async function WorkflowTodo(
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pageSize?: number;
    type?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.CResult<API.PageResult<WorkflowAPI.Workflow[]>>>('/workflow/todo', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 我发起的工作流列表 POST /workflow/list */
export async function WorkflowList(
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.CResult<API.PageResult<WorkflowAPI.Workflow[]>>>('/workflow/list', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 足迹 POST /workflow/footprint */
export async function QueryFootprint(workflow_id: number, options?: { [key: string]: any }) {
  return request<API.CResult<any>>('/workflow/footprint', {
    method: 'POST',
    data: { workflow_id },
    ...(options || {}),
  });
}

/** 我已处理的工作流列表 POST /workflow/lists */
export async function WorkflowHandled(
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.CResult<API.PageResult<WorkflowAPI.Workflow[]>>>('/workflow/handled', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 所有工作流列表 POST /workflow/all */
export async function WorkflowAllList(
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.CResult<API.PageResult<WorkflowAPI.Workflow[]>>>('/workflow/all', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 导出工作流列表 POST /workflow/export */
export async function WorkflowExport(params: any, options?: { [key: string]: any }) {
  return request('/workflow/export', {
    method: 'POST',
    data: {
      ...params,
    },
    responseType: 'blob', // 必须声明响应为二进制
    ...(options || {}),
  });
}

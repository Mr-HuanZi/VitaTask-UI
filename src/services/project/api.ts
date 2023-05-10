/* eslint-disable */
// @ts-ignore
import { request } from 'umi';

/** 项目列表接口 POST /project/list */
export async function queryProjects(params: any, options?: { [key: string]: any }) {
  return request<API.CResult<API.PageResult<ProjectAPI.Project[]>>>('/project/list', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 项目简单列表接口 POST /project/list/simple */
export async function projectSimpleList(params: any, options?: { [key: string]: any }) {
  return request<API.CResult<API.SimpleList[]>>('/project/list/simple', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建项目接口 POST /project/create */
export async function projectCreate(body: any, options?: { [key: string]: any }) {
  return request<API.CResult<ProjectAPI.Project>>('/project/create', {
    method: 'POST',
    data: {
      ...body,
    },
    ...(options || {}),
  });
}

/** 编辑项目接口 POST /project/edit */
export async function projectEdit(body: {
  id: number;
  name: string;
  leader?: number;
}, options?: { [key: string]: any }) {
  return request<API.CResult<ProjectAPI.Project>>('/project/edit', {
    method: 'POST',
    data: {
      ...body,
    },
    ...(options || {}),
  });
}

/** 删除项目接口 POST /project/del */
export async function projectDelete(body: {
  id: number
}, options?: { [key: string]: any }) {
  return request<API.CResult>('/project/del', {
    method: 'POST',
    data: {
      ...body,
    },
    ...(options || {}),
  });
}

/** 项目归档接口 POST /project/archive */
export async function projectArchive(body: {
  id: number
}, options?: { [key: string]: any }) {
  return request<API.CResult>('/project/archive', {
    method: 'POST',
    data: {
      ...body,
    },
    ...(options || {}),
  });
}

/** 项目取消归档接口 POST /project/un-archive */
export async function projectUnArchive(body: {
  id: number
}, options?: { [key: string]: any }) {
  return request<API.CResult>('/project/un-archive', {
    method: 'POST',
    data: {
      ...body,
    },
    ...(options || {}),
  });
}

/** 成员列表查询接口 POST /project/member/list */
export async function projectMemberList(params: any, options?: { [key: string]: any }) {
  return request<API.CResult<API.PageResult<ProjectAPI.ProjectMember[]>>>('/project/member/list', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 项目详情接口 POST /project/detail */
export async function fetchProjectDetail(id: number, options?: { [key: string]: any }) {
  return request<API.CResult<ProjectAPI.Project>>('/project/detail', {
    method: 'POST',
    data: {id},
    ...(options || {}),
  });
}

/** 移除项目成员接口 POST /project/member/remove */
export async function projectMemberRemove(body: ProjectAPI.ProjectMemberBind, options?: { [key: string]: any }) {
  return request<API.CResult>('/project/member/remove', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 添加项目成员接口 POST /project/member/bind */
export async function projectMemberBind(body: ProjectAPI.ProjectMemberBind, options?: { [key: string]: any }) {
  return request<API.CResult>('/project/member/bind', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

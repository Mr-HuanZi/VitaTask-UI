// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/backstage/login/out', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST /backstage/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.CResult<API.LoginResult>>('/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 保存当前登录用户个人信息接口 POST /user/store */
export async function storeSelf(body: API.StoreSelfForm, options?: { [key: string]: any }) {
  return request<API.CResult<API.CurrentUser>>('/user/store', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 变更当前用户头像接口 POST /user/change-avatar */
export async function changeAvatar(body: API.FileSimple, options?: { [key: string]: any }) {
  return request<API.CResult<undefined>>('/user/change-avatar', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 修改当前用户密码接口 POST /user/change-pass */
export async function changePassword(body: API.changePasswordDto, options?: { [key: string]: any }) {
  return request<API.CResult<undefined>>('/user/change-pass', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 修改用户单个信息接口 POST /user/change-pass */
export async function changeSingleInfo(body: {type: "email" | "mobile", value: string}, options?: { [key: string]: any }) {
  let path = "";
  let data: {email?: string, mobile?: string} = {
    email: undefined,
    mobile: undefined,
  };
  switch (body.type) {
    case "email":
      path = "change-email";
      data.email = body.value;
      break;
    case "mobile":
      path = "change-mobile";
      data.mobile = body.value;
      break;
  }
  return request<API.CResult<undefined>>(`/user/${path}`, {
    method: 'POST',
    params: data,
    ...(options || {}),
  });
}



















/** 此处往下全是Mock */

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

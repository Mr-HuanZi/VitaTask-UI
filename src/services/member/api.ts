// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 成员列表接口 POST /member/lists */
export async function MemberLists(
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.CResult<API.PageResult<MemberAPI.Member[]>>>('/member/lists', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 所有成员列表接口 POST /member/create */
export async function MemberCreate(body: MemberAPI.Member, options?: { [key: string]: any }) {
  return request<API.CResult<MemberAPI.Member[]>>('/member/create', {
    method: 'POST',
    data: {
      ...body,
    },
    ...(options || {}),
  });
}

/** 启用或禁用成员接口 POST /member/reset/pass */
export async function MemberChangeStatus(
  body: {
    uid: number;
    type: 'enable' | 'disable';
  },
  options?: { [key: string]: any },
) {
  return request<API.CResult>(`/member/${body.type}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 重置成员密码接口 POST /member/reset-pass */
export async function ResetPassword(
  body: {
    uid: number;
    password?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.CResult>('/member/reset-pass', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 简单成员列表 GET /member/list/simple */
export function QueryMemberSimpleLists(body: any, options?: { [key: string]: any }) {
  return request<API.CResult<MemberAPI.Simple[]>>('/member/list/simple', {
    method: 'POST',
    params: body,
    ...(options || {}),
  });
}

/** 简单成员列表 GET /member/change-super */
export function ChangeMemberSuper(body: MemberAPI.ChangeSuperDto, options?: { [key: string]: any }) {
  return request<API.CResult<MemberAPI.Simple[]>>('/member/change-super', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

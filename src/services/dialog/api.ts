// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取对话消息列表接口 POST /dialog/msg-list */
export async function dialogMsgList(dialogId: number, options?: { [key: string]: any }) {
  return request<API.CResult<DialogAPI.DialogMsg[]>>('/dialog/msg-list', {
    method: 'POST',
    data: {dialog_id: dialogId},
    ...(options || {}),
  });
}

/** 获取对话消息列表接口 POST /dialog/send-text */
export async function dialogSendText(body: DialogAPI.SendTextDto, options?: { [key: string]: any }) {
  return request<API.CResult<DialogAPI.DialogMsg>>('/dialog/send-text', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

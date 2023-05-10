// @ts-ignore
/* eslint-disable */

declare namespace DialogAPI {
  type Dialog = {
    id: number;
    create_time: number;
    type: string;
    name: string;
    last_at: number;
  }

  type DialogMsg = {
    id: number;
    dialog_id: number;
    user_id: number;
    type: string;
    content: string;
    dialog?: Dialog;
    create_time: number;
    user_info?: MemberAPI.Member;
  }

  type SendTextDto = {
    dialog_id: number;
    content: string;
  }
}

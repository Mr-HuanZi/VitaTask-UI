// @ts-ignore
/* eslint-disable */

declare namespace MemberAPI {
  type Member = {
    id: number;
    sex: number;
    birthday: string;
    lastLoginTime: number;
    createTime: number;
    updateTime: number;
    userStatus: number;
    userLogin: string;
    userNickname: string;
    userEmail: string;
    mobile: string;
    lastEditPass: number;
    avatar?: string;
    super: number;
  };

  type Simple = {
    label: string;
    text: string;
    value: number;
    avatar: string;
  };

  type ChangeSuperDto = {
    uid: number;
    super: number;
  }
}

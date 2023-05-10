// @ts-ignore
/* eslint-disable */

declare namespace ProjectAPI {
  type Project = {
    id: number;
    name: string;
    complete: number;
    archive: number;
    leader?: ProjectMember;
    member?: ProjectMember[];
    create_time: number;
    update_time?: number;
  };

  type ProjectMember = {
    id: number;
    projectId: number;
    userId: number;
    role: number;
    userInfo: MemberAPI.Member;
  }

  type ProjectMemberQueryParams = API.PageParams & {
    project: number;
    role?: number;
    nickname?: string;
    username?: string;
  }


  type ProjectMemberBind = {
    project: number;
    users: number[];
    role: number;
  }
}

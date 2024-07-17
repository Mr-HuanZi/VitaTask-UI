// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    id: number;
    avatar: string;
    birthday: string;
    createTime: number;
    first: number;
    lastEditPass: number;
    lastLoginTime: number;
    sex: number;
    updateTime: number;
    userLogin: string;
    userNickname: string;
    userStatus: number;
    userEmail: string;
    mobile: string;
    signature: string;
  };

  type LoginResult = {
    id: number;
    token: string;
    user_nickname: string;
    user_login: string;
    ws_token: string;
  };

  type PageParams = {
    current?: number;
    page?: number;
    pageSize?: number;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
  };

  /* Start */
  type CResult<T = []> = {
    code?: number;
    data?: T;
    message?: string;
  };

  type PageResult<T = []> = {
    items?: T;
    page: number;
    total: number;
  };

  type FileVo = {
    "name": string; // 文件名
    "url": string; // 相对路径
    "tag": string; // 文件Tag
    "ext": string; // 文件扩展，带 . 号，例如：.jpg
    "size": number; // 文件大小（字节）
    "base64"?: string;
  };

  type FileSimple = {
    url: string;
    uid: string;
    name: string;
    height?: number;
    width?: number;
    size?: number;
  };

  type SimpleList = {
    id: number;
    name: string;
    label: string;
    value: string;
    [key: string]: any;
  }

  type StoreSelfForm = {
    nickname: string;
    email: string;
    mobile: string;
    signature: string;
    avatar: string;
    sex: number;
    birthday: string;
  }

  type changePasswordDto = {
    old_password: string;
    password: string;
    confirm_password: string;
  }


  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type OptionItem = {
    label: string;
    value: any;
  }
}

// import { PageLoading } from '@ant-design/pro-layout';
import { history } from '@umijs/max';
import type {RequestConfig} from "@umijs/max";
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import AvatarDropdown from "@/components/RightContent/AvatarDropdown";
import {codeOk} from "@/units";
import Notice, { message, notification } from './Notice';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
// export const initialStateConfig = {
//   // loading: <PageLoading />,
// };


/**
 * 全局初始化数据配置，用于 Layout 用户信息和权限初始化
 * 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();

      return msg?.data ?? {};
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
    };
  }
  return {
    fetchUserInfo,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout = ({ initialState }) => {
  return {
    fixSiderbar: true,
    headerRender: () => <span>Header</span>,
    actionsRender: () => [<RightContent key="RightContent"/>],
    menuFooterRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    avatarProps:{
      src: initialState?.currentUser?.avatar ?? 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      size: 'large',
      title: initialState?.currentUser?.userNickname ?? '',
      render: (props, dom) => {
        return (
          <AvatarDropdown>
            {dom}
          </AvatarDropdown>
        );
      },
    },
  };
};

// 请求前拦截器： 在请求头加入 Authorization
const authHeaderInterceptor = (url: string, options: any) => {
  const headers = { 'Authorization': localStorage.getItem("Authorization"), 'Content-Type': 'application/json' };

  return {
    url: `/v1${url.indexOf("/") !== 0 ? '/' : ''}${url}`,
    options: { ...options, interceptors: true, headers },
  };
};
// 响应拦截器
const responseInterceptors = (response) => {
  if (response?.status === 200) {
    const resultData = response?.data;
    if (!codeOk(resultData?.code)) {
      message.open({
        type: 'error',
        content: resultData?.message ? resultData?.message : "请求错误",
      });
    }
  } else if (response.status === 401) {
    // 如果Token失效跳转到登录页
    history.push(loginPath);
  }
  return response;
};

export const request: RequestConfig = {
  // 新增自动添加AccessToken的请求前拦截器
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [responseInterceptors],
  errorConfig: {
    errorHandler: (error: any) => {
      const { data, response } = error;
      if (response && response?.status === 401) {
        notification.open({
          type: 'error',
          description: '您的登录签名已失效，请重新登录',
          message: '签名失效',
        });
      } else {
        notification.open({
          type: 'error',
          description: data?.msg ?? '您的网络发生异常，无法连接服务器',
          message: '系统异常',
        });
        throw error;
      }
    },
  },
};

export const innerProvider = (container) => {
  return (
    <>
      <Notice />
      {container}
    </>
  );
}

import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import type {RequestConfig} from "@@/plugin-request/request";
import {message, notification} from "antd";

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
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
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      // content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
        </>
      );
    },
    ...initialState?.settings,
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
const responseInterceptors = (response: Response) => {
  if (response.ok) {
    const result: Promise<any> = response.clone().json();
    result.then((res) => {
      const {code} = res;
      const msg = res?.message ?? '';
      if (code !== 200) {
        message.error(!msg ? "请求错误" : msg).then();
      }
    }).catch((reason) => {
      console.log(reason);
    });
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
  errorHandler: (error: any) => {
    const { data, response } = error;
    if (response.status === 401) {
      notification.error({
        description: '您的登录签名已失效，请重新登录',
        message: '签名失效',
      });
    } else {
      notification.error({
        description: data?.msg ?? '您的网络发生异常，无法连接服务器',
        message: '系统异常',
      });
    }
    throw error;
  },
};

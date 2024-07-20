import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Alert, message} from 'antd';
import React, {useState} from 'react';
import {LoginForm, ProFormCheckbox, ProFormText} from '@ant-design/pro-components';
import { useModel, history } from '@umijs/max';
import Footer from '@/components/Footer';
import {login} from '@/services/ant-design-pro/api';
import styles from './index.less';
import {errorMessage} from "@/units";

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [loginStatus, setLoginStatus] = useState(true);
  const { initialState, setInitialState } = useModel('@@initialState');
  const {setToken} = useModel('chat');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const result = await login({ ...values });

      if (result.code === 200 && result?.data?.token) {
        message.success('登录成功！'); // 设置token
        localStorage.setItem('Authorization', result.data.token ?? '');
        // 将Token传递给WebSocket
        setToken(result.data.token);
        await fetchUserInfo();
        // 0.5秒后跳转
        setTimeout(() => {
          /** 此方法会跳转到 redirect 参数所在的位置 */

          if (!history) return;
          const { query } = history.location;
          if (query) {
            const { redirect } = query as {
              redirect: string;
            };
            history.push(redirect || '/');
          } else {
            history.push('/');
          }
        }, 500);

        return;
      } else {
        setLoginStatus(false);
      } // 如果失败去设置用户错误信息
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      errorMessage(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Vita Task"
          subTitle='Vita Task轻量级的任务协同系统'
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {!loginStatus && <LoginMessage content={'错误的用户名和密码'} />}

          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </>

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin" disabled={true}>
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

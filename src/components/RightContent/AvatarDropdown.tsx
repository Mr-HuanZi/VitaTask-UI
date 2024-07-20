import React, {useCallback} from 'react';
import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {Dropdown, Spin} from 'antd';
import {history, useModel} from '@umijs/max';
import {stringify} from 'querystring';
import styles from './index.less';

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query;
  // 清除Token
  localStorage.removeItem('Authorization');
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const AvatarDropdown: React.FC = ({ children }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    ({ key }) => {
      if (key === 'logout') {
        setInitialState((s) => ({...s, currentUser: undefined})).then();
        loginOut().then();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.userNickname) {
    return loading;
  }

  return (
    <Dropdown
      placement="topLeft"
      menu={{
        onClick: onMenuClick,
        items: [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
          },
        ],
      }}
    >
      {children}
    </Dropdown>
  );
};

export default AvatarDropdown;

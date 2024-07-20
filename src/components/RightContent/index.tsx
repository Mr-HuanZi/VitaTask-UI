import {useModel} from '@umijs/max';
import React, {useEffect} from "react";

export type SiderTheme = 'light' | 'dark';

/**
 * 这个组件现在只用来做全局Websocket加载了
 * @constructor
 */
const GlobalHeaderRight: React.FC = () => {
  const {setToken} = useModel('chat');

  // 载入组件时设置WebsocketToken
  useEffect(() => {
    setToken(localStorage.getItem("Authorization") ?? '');
  }, [setToken]);

  return (
    <></>
  );
};

export default GlobalHeaderRight;

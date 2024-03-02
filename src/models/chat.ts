import {useEffect, useState} from "react";
import {notification} from 'antd';
import type {Payload} from "@/services/websocket";
import { ws } from "@/services/websocket";

export default () => {
  const url: string = 'ws://127.0.0.1:8082/chat';
  const [messages, setMessages] = useState<Payload>();
  const [token, setToken] = useState<string>('');

  // 初始化
  useEffect(() => {
    // 先销毁
    ws.destroyed();
    if (!token) {
      return;
    }

    // 连接websocket
    ws.connect(url);

    // 重连失败的回调
    ws.reconnectLimitCallback = () => {
      notification.error({
        message: '聊天服务连接失败',
        description: '已达到最大重连次数，请检查服务端是否正常运行',
      });
    };

    // 注册消息钩子
    ws.registerHook(['chatData', 'ping'], 'chatModel', (d: Payload) => {
      setMessages(d);
    });

  }, [token]);


  return {messages, setToken};
}

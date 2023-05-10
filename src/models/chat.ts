import {useCallback, useEffect, useState} from "react";
import {notification} from 'antd';

export type Payload = {
  module: string;
  data: any;
}

export default () => {
  const [messages, setMessages] = useState<any>();
  const [token, setToken] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket>();

  // 初始化
  useEffect(() => {
    if (!token) {
      return;
    }
    // 初始化
    const ws = init(token);
    setSocket(ws);
    // 每50秒发送一个心跳包
    const timer = setInterval(() => {
      if (ws.readyState == ws.CLOSED) {
        clearInterval(timer);
        return;
      }
      const payload: Payload = {module: 'heartbeat', data: undefined}
      ws.send(JSON.stringify(payload));
    }, 1000*50);

    return () => {
      // 清除计时器
      clearInterval(timer);
      // 关闭连接
      ws.close();
    }
  }, [token]);

  // 发送消息
  const sendMessage = useCallback((module: string, data: any) => {
    console.log('接收到要发送的消息', data);
    if (!socket) {
      return
    }

    const payload: Payload = {module, data}
    socket.send(JSON.stringify(payload));
  }, [socket]);

  function init(t: string) {
      const ws = new WebSocket(`ws://127.0.0.1:8081/chat/`, [t]);
      function onConnect() {
        console.log('已连接服务端');
      }
      function onDisconnect() {
        notification.error({
          message: '聊天服务已断开连接',
          description:
            '聊天服务已断开连接，请按F5刷新页面尝试重新连接',
        });
      }
      function onMessage(ev: any) {
        // 解析JSON
        try {
          const d = JSON.parse(ev.data);
          setMessages(d);
        } catch (e) {
          console.error('尝试解析WebSocket接收数据失败', e);
        }
      }
      ws.onopen = onConnect;
      ws.onclose = onDisconnect;
      // 监听消息
      ws.onmessage = onMessage;
      ws.onerror = (ev) => {
        console.error("出错了", ev)
      }
      return ws;
  }

  return {messages, sendMessage, setToken};
}

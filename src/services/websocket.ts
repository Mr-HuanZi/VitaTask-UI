export type Payload = {
  event: string;
  data: any;
}

export type HookType = 'chatData' | 'clientLink' | 'readNotice' | 'newFriend' | 'getFriendList' | 'memberIsOnline' | 'getChatList' | 'ping';

export const ws: {
  url: string,
  socket?: WebSocket,
  // 消息处理钩子
  hooks: Record<string, Record<string, (data: any) => void>>,
  // 当前的重连次数
  reconnectCount: number,
  // 锁定重连
  lockReconnect: boolean,
  // 每次重连间隔
  reconnectTimeout: number,
  // 最大重连次数
  reconnectLimit: number,
  // 重连定时器
  reconnectTimer: any,
  // 重连次数达到最大时的回调
  reconnectLimitCallback: () => void,
  // 重连任务是否正在执行
  lockReconnectTask: boolean,
  // 连接操作
  connect: (url: string) => void,
  // 发送心跳包间隔
  pingTimeout: number,
  // 心跳包定时器
  pingTimer: any,
  // 最长未接收消息的间隔 必须大于 pingTimeout
  pongTimeout: number,
  // 接收消息定时器
  pongTimer: any,
  close: () => void,
  registerHook: (
    name: HookType | HookType[],
    id: string,
    handle: (d: Payload) => void
  ) => void,
  sendMessage: (event: 'checkToken' | 'ping' | 'offline', data: any) => void,
  waitForConnection: (callback: () => void, interval: any) => void,
  onmessage: (handle: (event: any) => void) => void,
  // 准备重连
  readyReconnect: () => void,
  // 重连
  reconnect: () => void,
  // 清除所有定时器
  clearAllTimer: () => void,
  // 发送心跳
  heartBeat: () => void,
  // 是否手动关闭
  forbidReconnect: boolean,
  // 主动销毁
  destroyed: () => void,
} = {
  url: 'ws://127.0.0.1:8082',
  socket: undefined,
  // 消息处理钩子
  hooks: {
    chatData: {}, // 收到聊天消息
    clientLink: {}, // 客户端连接消息
    readNotice: {}, // 有未读消息通知
    newFriend: {}, // 新的朋友
    getFriendList: {}, // Websocket发来的事件名，要求重新获取好友列表
    memberIsOnline: {}, // Websocket发来的事件名，通知群主成员上线
    getChatList: {}, // Websocket发来的事件名，要求重新获取聊天列表
    ping: {}, // 心跳包
  },
  reconnectCount: 0, // 当前的重连次数
  lockReconnect: false, // 锁定重连
  reconnectTimeout: 10000, // 每次重连间隔
  reconnectLimit: 10, // 最大重连次数
  reconnectTimer: null, // 重连定时器
  pingTimeout: 30000, // 发送心跳包间隔
  pingTimer: null, // 心跳包定时器
  pongTimeout: 55000, // 接收消息定时器
  pongTimer: null, // 接收消息定时器
  reconnectLimitCallback: () => {},
  forbidReconnect: false, // 是否手动关闭
  lockReconnectTask: false, // 重连任务是否正在执行

  connect: (url: string) => {
    ws.socket = new WebSocket(url);
    ws.url = url; // 保存url
    // 重置 手动关闭 状态
    ws.forbidReconnect = false;

    ws.socket.onerror = (e) => {
      console.error('Websocket连接失败', e);
      // 重连
      ws.readyReconnect();
    };

    ws.socket.onclose = (e) => {
      console.warn('Websocket连接关闭', e);
      // 重连
      ws.readyReconnect();
    };

    ws.socket.onopen = () => {
      // 连接成功后清除所有定时器
      ws.clearAllTimer();
      // 重连次数清零
      ws.reconnectCount = 0;
      // 解锁，可以重连
      ws.lockReconnect = false;
      // 解锁任务执行状态，可以重连
      ws.lockReconnectTask = false;
      // 启动心跳
      ws.heartBeat();
    };

    ws.socket.onmessage = (event: MessageEvent) => {
      const content = event.data;
      // 尝试解析字符串
      try {
        const json = JSON.parse(content);
        if (json?.event && ws.hooks?.[json.event]) {
          for (const i in ws.hooks[json.event]) {
            if (ws.hooks[json.event].hasOwnProperty(i))
              ws.hooks[json.event][i](json?.data ?? {});
          }
        }
      } catch (e) {
        console.warn('Websocket: 处理消息发生错误', e);
      }

      // 超时定时器
      clearTimeout(ws.pongTimer);
      ws.pongTimer = setTimeout(() => {
        ws.readyReconnect();
      }, ws.pongTimeout);
    };
  },

  heartBeat: () => {
    ws.pingTimer = setTimeout(() => {
      ws.sendMessage('ping', new Date().getTime());
      ws.heartBeat();
    }, ws.pingTimeout);
  },

  /**
   * 发送消息到Websocket
   */
  sendMessage: (event, data) => {
    if (ws.socket === null)
      return;

    const sendData = JSON.stringify({event, data});
    // 延时发送消息
    ws.waitForConnection(() => {
      if (ws?.socket)
        ws.socket.send(sendData);
    }, 100);
  },

  /**
   * 延时发送消息
   * 连续多次调用send方法可能会报' Still in CONNECTING state '错误，所以需要这么处理
   * @param callback
   * @param interval
   */
  waitForConnection: function (callback: () => void, interval: any) {
    if (!ws?.socket)
      return;

    if (ws.socket.readyState === ws.socket.OPEN) {
      callback();
    } else {
      setTimeout(function () {
        ws.waitForConnection(callback, interval);
      }, interval);
    }
  },

  /**
   * 消息接收器
   * Note 会覆盖默认的
   * @param handle {(event: any) => void}
   */
  onmessage: (handle: (event: any) => void) => {
    if (!ws?.socket)
      return;

    ws.socket.onmessage = handle;
  },

  /**
   * 注册Hook
   * 重复注册相同的ID会覆盖之前的
   */
  registerHook: (
    name,
    id,
    handle,
  ) => {
    if (typeof name === 'string') {
      if (!ws.hooks?.[name]) {
        ws.hooks[name] = {};
      }
      ws.hooks[name][id] = handle;
    } else {
      if (Array.isArray(name)) {
        name.forEach((item) => {
          ws.registerHook(item, id, handle);
        });
      }
    }
  },

  /**
   * 关闭websocket
   */
  close: () => {
    if (!ws?.socket)
      return;

    ws.socket.close();
  },
  /**
   * 准备重连
   */
  readyReconnect: () => {
    // 避免循环重连，当一个重连任务进行时，不进行重连
    // 加入该机制是因为该方法调用了close()方法，该方法会触发onclose事件重复执行readyReconnect，导致重连定时器被清除
    if (ws.lockReconnectTask) return;
    ws.lockReconnectTask = true;

    console.warn(`websocket连接可能断开，准备重连...`);
    // 防止连接没有被真正关闭的情况
    // 由于浏览器性能优化的问题，标签页被切换到后台时会导致定时器不准而导致假断开，触发重连
    if (ws.socket) {
      ws.socket.close();
      ws.socket = undefined;
    }

    ws.clearAllTimer(); // 无论怎样都要先清除定时器
    ws.reconnect();
  },

  /**
   * 重连
   */
  reconnect: () => {
    // 如果手动关闭连接，不重连
    if (ws.forbidReconnect) return;
    // 重连锁
    if (ws.lockReconnect) return;
    // 重连次数达到最大值，不再重连
    if (ws.reconnectCount >= ws.reconnectLimit) {
      if (ws.reconnectLimitCallback)
        ws.reconnectLimitCallback();

      return;
    }

    console.log(`第${ws.reconnectCount+1}次重连中...`);
    // 加锁，禁止重连
    ws.lockReconnect = true;
    ws.reconnectCount += 1;
    ws.connect(ws.url);
    // 重复执行重连操作
    // ws.connect 成功连接后，会调用clearAllTimer()清除该定时器
    ws.reconnectTimer = setTimeout(() => {
      // 解锁，可以重连
      ws.lockReconnect = false;
      // 递归调用
      ws.reconnect();
    }, ws.reconnectTimeout);
  },

  /**
   * 清除所有定时器
   */
  clearAllTimer:() => {
    if (ws.pingTimer)
      clearTimeout(ws.pingTimer);
    if (ws.pongTimer)
      clearTimeout(ws.pongTimer);
    if (ws.reconnectTimer)
      clearTimeout(ws.reconnectTimer);
  },

  // 销毁 ws
  destroyed() {
    // 如果手动关闭连接，不再重连
    ws.forbidReconnect = true;
    ws.clearAllTimer();
    if (ws.socket) {
      ws.socket.close();
      ws.socket = undefined;
    }
  }
};

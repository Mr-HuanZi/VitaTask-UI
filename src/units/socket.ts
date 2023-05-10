// import { io } from 'socket.io-client';

// export const socket = io('ws://127.0.0.1:8081/', {
//   path: '/chat/',
//   transports: ["websocket"],
//   reconnection: false,
// });

export const socket = (new WebSocket('ws://127.0.0.1:8081/chat/'))

import { config } from '../constants/confjg';

window.WebSocket = window.WebSocket || window.MozWebSocket;

let websocket;

const get = () => websocket;

const close = () => {
   websocket && websocket.close();
};

const connect = (deviceId) => {
   if (websocket) return websocket;
   websocket = new WebSocket(config.SOCKET_URL);
   websocket.onopen = (e) => {
      websocket.send(
         JSON.stringify({
            type: 'joined',
            payload: {
               deviceId,
            },
         })
      );
   };
   return websocket;
};

const emit = (event, payload) => {
   console.log(event);
   console.log(payload);
   switch (event) {
      case '':
         break;

      default:
         break;
   }
};

const socket = {
   get,
   connect,
   close,
   emit,
};

export default socket;

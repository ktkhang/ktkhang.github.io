import { config } from '../constants/confjg';

window.WebSocket = window.WebSocket || window.MozWebSocket;

const HOST = config.API_URL.replace(/^http/, 'ws') + '/ws';

let websocket;

const get = () => websocket;

const close = () => {
   websocket && websocket.close();
   websocket = null;
};

const connect = () => {
   close();
   websocket = new WebSocket(HOST);
   return websocket;
};

const emit = (event, payload) => {
   if (!websocket) return false;
   websocket.send(
      JSON.stringify({
         type: event,
         payload,
      })
   );
};

const isOpen = () => {
   return websocket && websocket.readyState === websocket.OPEN;
};

const socket = {
   get,
   connect,
   close,
   emit,
   isOpen,
};

export default socket;

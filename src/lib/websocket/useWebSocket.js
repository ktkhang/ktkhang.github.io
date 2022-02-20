import { useContext, useRef, useEffect } from 'react';
import { WebSocketContext } from './WebSocketProvider';

const useWebSocket = () => {
   const { reconnect: onReconnect, send: onSend } = useContext(WebSocketContext);
   const callbackRef = useRef({
      onReconnect,
      onSend,
   });
   useEffect(() => {
      callbackRef.current = { onReconnect, onSend };
   });

   return {
      reconnect: callbackRef.current.onReconnect,
      send: callbackRef.current.onSend,
   };
};

export default useWebSocket;

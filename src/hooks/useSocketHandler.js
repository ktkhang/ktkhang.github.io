import { useRef, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { chatLogState, messagesState, socketState } from '../store/atoms';
import { getSavedDeviceId, uuidv4 } from '../utils/common';

const useSocketHandler = () => {
   const setChatLog = useSetRecoilState(chatLogState);
   const setMessages = useSetRecoilState(messagesState);
   const setSocketState = useSetRecoilState(socketState);
   const deviceId = getSavedDeviceId();
   const timer = useRef();
   const pingInterval = useRef();
   const retryTimer = useRef();

   useEffect(() => {
      return () => {
         clearTimeout(timer.current);
         clearInterval(pingInterval.current);
         clearInterval(retryTimer.current);
      };
   }, []);

   const _handleUserJoined = (payload) => {
      const { user, time } = payload;
      setChatLog((prev) => [
         ...prev,
         {
            id: uuidv4(),
            msg: `${
               deviceId === user.deviceId ? 'You' : `"${user.name || 'Anonymous'}"`
            } have joined the chat.`,
            time,
         },
      ]);
   };

   const _handleUserLeft = (payload) => {
      const { name, time } = payload;
      setChatLog((prev) => [
         ...prev,
         {
            id: uuidv4(),
            msg: `"${name || 'Anonymous'}" have left the chat.`,
            time,
         },
      ]);
   };

   const _handleMessage = (payload) => {
      setMessages((prev) => [...prev, ...payload]);
   };

   const _ping = (websocket, retryCallback) => {
      websocket.send(
         JSON.stringify({
            type: '__ping__',
         })
      );
      timer.current = setTimeout(function () {
         retryCallback && retryCallback();
      }, 5000);
   };

   const _pong = () => {
      clearTimeout(timer.current);
   };

   // handle message
   const handleMessage = (msg) => {
      console.log(JSON.parse(msg.data));
      const { type, payload } = JSON.parse(msg.data);

      switch (type) {
         case 'joined':
            return _handleUserJoined(payload);

         case 'leave':
            return _handleUserLeft(payload);

         case 'message':
            return _handleMessage(payload);

         case '__pong__':
            return _pong();

         default:
            break;
      }
   };

   // handle connection open
   const handleOpen = (websocket, retryCallback) => (e) => {
      clearInterval(retryTimer.current);
      websocket.send(
         JSON.stringify({
            type: 'joined',
            payload: {
               deviceId,
            },
         })
      );
      setSocketState((prev) => ({ ...prev, errorCode: 0 }));

      // ping ws keep alive
      pingInterval.current = setInterval(() => _ping(websocket, retryCallback), 30000);
   };

   // handle connection close
   const handleClose = (retryCallback) => (e) => {
      setSocketState((prev) => ({ ...prev, errorCode: e.code !== 1005 ? e.code : 0 }));
      if (retryCallback) {
         retryTimer.current = setInterval(() => {
            retryCallback();
         }, 1000);
      }
   };

   // handle error
   const handleError = (e) => {
      console.log(e);
   };

   return {
      handleOpen,
      handleClose,
      handleMessage,
      handleError,
   };
};

export default useSocketHandler;

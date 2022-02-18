import React, { useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import useSocketHandler from '../hooks/useSocketHandler';
import { socketState } from '../store/atoms';
import { getSavedDeviceId } from '../utils/common';
import socket from '../utils/socket';
import BackgroundSync from './BackgroundSync';
import ChatBox from './ChatBox';
import ChatContent from './ChatContent';
import ChatLog from './ChatLog';

const Main = () => {
   const { errorCode } = useRecoilValue(socketState);
   const { handleOpen, handleClose, handleMessage, handleError } = useSocketHandler();

   const isDisconnected = !socket.isOpen();

   const connect = useCallback(() => {
      const websocket = socket.connect(getSavedDeviceId());
      websocket.onopen = handleOpen(websocket, connect);
      websocket.onclose = handleClose(connect);
      websocket.onmessage = handleMessage;
      websocket.onerror = handleError;
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      return () => {
         socket.close();
      };
   }, []);

   useEffect(() => {
      if (isDisconnected) {
         connect();
      }
   }, [isDisconnected, connect]);

   const reconnect = useCallback(() => {
      if (!socket.isOpen()) {
         connect();
      }
   }, [connect]);

   return (
      <div className="main">
         <div className="main__header">
            <h2>Global Chat</h2>
         </div>
         <div className="main__body">
            {errorCode !== 0 && (
               <div className="main__error">
                  Connection error. Error code: {errorCode}
               </div>
            )}
            <ChatContent />
            <ChatBox />
         </div>
         <ChatLog />
         <BackgroundSync reconnect={reconnect} />
      </div>
   );
};

export default Main;

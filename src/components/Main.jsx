import React, { useEffect, useState } from 'react';
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
   const [reconnectFlag, setReconnectFlag] = useState(false);
   const { handleOpen, handleClose, handleMessage, handleError } = useSocketHandler();

   useEffect(() => {
      const websocket = socket.connect(getSavedDeviceId());
      websocket.onopen = handleOpen(websocket, () => {
         setReconnectFlag((v) => !v);
      });
      websocket.onclose = handleClose;
      websocket.onmessage = handleMessage;
      websocket.onerror = handleError;

      return () => {
         socket.close();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [reconnectFlag]);

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
         <BackgroundSync />
      </div>
   );
};

export default Main;

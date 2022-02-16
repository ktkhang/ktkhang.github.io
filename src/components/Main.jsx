import React, { useEffect } from 'react';
import useSocketMessageHandler from '../hooks/useSocketMessageHandler';
import { getSavedDeviceId } from '../utils/common';
import socket from '../utils/socket';
import ChatBox from './ChatBox';
import ChatContent from './ChatContent';
import ChatLog from './ChatLog';

const Main = () => {
   const { handleMessage } = useSocketMessageHandler();

   useEffect(() => {
      const websocket = socket.connect(getSavedDeviceId());
      websocket.onmessage = handleMessage;

      return () => {
         socket.close();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <div className="main">
         <div className="main__header">
            <h2>Chat</h2>
         </div>
         <div className="main__body">
            <ChatContent />
            <ChatBox />
         </div>
         <ChatLog />
      </div>
   );
};

export default Main;

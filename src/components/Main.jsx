import React from 'react';
import { useRecoilValue } from 'recoil';
import { config } from '../constants/confjg';
import useSocketHandler from '../hooks/useSocketHandler';
import WebSocketProvider from '../lib/websocket/WebSocketProvider';
import { socketState } from '../store/atoms';
import BackgroundSync from './BackgroundSync';
import ChatBox from './ChatBox';
import ChatContent from './ChatContent';
import ChatLog from './ChatLog';

const socketUrl = config.API_URL.replace(/^http/, 'ws') + '/ws';

const Main = () => {
   const { errorCode } = useRecoilValue(socketState);
   const { handleOpen, handleClose, handleMessage, handleError } = useSocketHandler();

   return (
      <WebSocketProvider
         url={socketUrl}
         onOpen={handleOpen}
         onClose={handleClose}
         onError={handleError}
         onMessage={handleMessage}
      >
         <div className="main">
            <div className="main__header">
               <h2>Global Chat</h2>
            </div>
            <div className="main__body">
               {errorCode !== 0 && (
                  <div className="main__error">Waiting for network...</div>
               )}
               <ChatContent />
               <ChatBox />
            </div>
            <ChatLog />
            <BackgroundSync />
         </div>
      </WebSocketProvider>
   );
};

export default Main;

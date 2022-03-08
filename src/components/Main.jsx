import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { config } from '../constants/confjg';
import useSocketHandler from '../hooks/useSocketHandler';
import withSignalProtocolManager from '../lib/e2ee/SignalProtocolManager';
import WebSocketProvider from '../lib/websocket/WebSocketProvider';
import pushNotifications from '../pushNotifications';
import { commonState, socketState } from '../store/atoms';
import BackgroundSync from './BackgroundSync';
import ChatBox from './ChatBox';
import ChatContent from './ChatContent';
import ChatLog from './ChatLog';

const socketUrl = config.API_URL.replace(/^http/, 'ws') + '/ws';

const Main = () => {
   const { errorCode } = useRecoilValue(socketState);
   const { permission } = useRecoilValue(commonState);
   const { handleOpen, handleClose, handleMessage, handleError } = useSocketHandler();

   useEffect(() => {
      if (permission === 'granted') {
         pushNotifications.subscribe();
      }
   }, [permission]);

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
               <button onClick={() => pushNotifications.broadcast()}>broadcast</button>
            </div>
            <div className="main__body">
               {errorCode !== 0 && <div className="main__error">Waiting for network...</div>}
               <ChatContent />
               <ChatBox />
            </div>
            <ChatLog />
            <BackgroundSync />
         </div>
      </WebSocketProvider>
   );
};

export default withSignalProtocolManager()(Main);

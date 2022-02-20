// import localforage from 'localforage';
// import { memo, useEffect, useRef } from 'react';
// import { useRecoilState } from 'recoil';
// import { LAST_SYNC_MESSAGE_ID, LOCAL_MESSAGES } from '../constants/variables';
// import useHasChanged from '../hooks/useHasChanged';
// import { messageService } from '../services/messageService';
// import { messagesState } from '../store/atoms';

// const BackgroundSync = memo(() => {
//    const [messages, setMessages] = useRecoilState(messagesState);
//    const lastMessageId = messages[messages.length - 1]?.id || '';
//    const hasMessagesChanged = useHasChanged(`${lastMessageId}_${messages.length}`);

//    const syncTimeout = useRef(null);

//    const saveMessage = (newMessages) => {
//       setMessages((prevData) => {
//          const newData = [
//             ...prevData,
//             ...(newMessages.filter((i) => !prevData.find((j) => j.id === i.id)) || []),
//          ];
//          return newData;
//       });
//    };

//    const loadDataFromLocal = async () => {
//       const data = await localforage.getItem(LOCAL_MESSAGES);
//       if (data?.length) {
//          saveMessage(data);
//       }
//    };

//    const loadDataFromServer = async () => {
//       try {
//          const lastSyncMsgId = await localforage.getItem(LAST_SYNC_MESSAGE_ID);
//          if (lastSyncMsgId) {
//             const response = await messageService.getAll(lastSyncMsgId);
//             if (response.errorCode === 0) {
//                saveMessage(response.data);
//             }
//          }
//       } catch {}
//    };

//    useEffect(() => {
//       const handleSwPostMessage = (e) => {
//          // if (e.data.msg === RESET_PENDING_MESSAGES) {
//          //    setPendingMessages([]);
//          // }
//       };
//       const init = async () => {
//          await loadDataFromLocal();
//          loadDataFromServer();
//       };
//       init();
//       navigator.serviceWorker.addEventListener('message', handleSwPostMessage);

//       return () => {
//          if (syncTimeout.current) {
//             clearTimeout(syncTimeout.current);
//          }
//          navigator.serviceWorker.removeEventListener('message', handleSwPostMessage);
//       };
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//    }, []);

//    useEffect(() => {
//       if (hasMessagesChanged) {
//          if (syncTimeout.current) clearTimeout(syncTimeout.current);
//          syncTimeout.current = setTimeout(() => {
//             localforage.setItem(LOCAL_MESSAGES, messages).then(() => {
//                localforage.setItem(LAST_SYNC_MESSAGE_ID, lastMessageId);
//             });
//          }, 3000);
//       }
//    }, [messages, lastMessageId, hasMessagesChanged]);

//    // useEffect(() => {
//    //    if (hasPendingMessagesChanged) {
//    //       localforage.setItem(SYNC_PENDING_MESSAGE_TAG, pendingMessages).then(async () => {
//    //          if (pendingMessages.length) {
//    //             const registration = await navigator.serviceWorker.ready;
//    //             try {
//    //                await registration.sync.register(SYNC_PENDING_MESSAGE_TAG);
//    //             } catch {
//    //                console.log('Background Sync could not be registered.');
//    //             }
//    //          }
//    //       });
//    //    }
//    // }, [pendingMessages, hasPendingMessagesChanged]);

//    return null;
// });

// export default BackgroundSync;

import localforage from 'localforage';
import React, { PureComponent } from 'react';
import { useRecoilState } from 'recoil';
import {
   CONTINUE_SEND_MESSAGES,
   LAST_SYNC_MESSAGE_ID,
   LOCAL_MESSAGES,
} from '../constants/variables';
import { messagesState } from '../store/atoms';
import useWebSocket from '../lib/websocket/useWebSocket';
import useHasChanged from '../hooks/useHasChanged';
import MessageStatus from '../enums/MessageStatus';
import { getSavedDeviceId } from '../utils/common';

class BackgroundSyncHandler extends PureComponent {
   deviceId = getSavedDeviceId();
   lastSyncMsgId = null;

   componentDidMount() {
      this.init();
      navigator.serviceWorker.addEventListener('message', this.handleSwPostMessage);
   }

   componentWillUnmount() {
      navigator.serviceWorker.removeEventListener('message', this.handleSwPostMessage);
   }

   componentDidUpdate(prevProps, prevState) {
      if (this.props.messages !== prevProps.messages && this.props.hasMessagesChanged) {
         this.syncMessagesInLocal();
      }
   }

   syncMessagesInLocal = () => {
      clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
         localforage.setItem(LOCAL_MESSAGES, this.props.messages).then(() => {
            this.lastSyncMsgId &&
               localforage.setItem(LAST_SYNC_MESSAGE_ID, this.lastMessageId);
         });
      }, 3000);
   };

   init = async () => {
      const localMessages = (await localforage.getItem(LOCAL_MESSAGES)) || [];
      await this.props.setMessages(localMessages);
      // load from server
      const lastSyncMsgId = await localforage.getItem(LAST_SYNC_MESSAGE_ID);
      if (lastSyncMsgId) {
         this.lastSyncMsgId = lastSyncMsgId;
         this.props.send('get_messages', {
            fromId: lastSyncMsgId,
         });
      }
   };

   handleSwPostMessage = (e) => {
      const { type, payload } = e.data;
      if (type === CONTINUE_SEND_MESSAGES) {
         this.props.send('message', {
            deviceId: this.deviceId,
            messages: payload.messages,
         });
      }
   };

   render() {
      return null;
   }
}

const BackgroundSync = () => {
   const { send } = useWebSocket();
   const [messages, setMessages] = useRecoilState(messagesState);
   const lastMessageId = messages[messages.length - 1]?.id || '';
   const hasMessagesChanged = useHasChanged(
      `${lastMessageId}_${messages.length}_${
         messages.filter((m) => m.status === MessageStatus.SENDING).length
      }`
   );

   return (
      <BackgroundSyncHandler
         messages={messages}
         lastMessageId={lastMessageId}
         hasMessagesChanged={hasMessagesChanged}
         setMessages={setMessages}
         send={send}
      />
   );
};

export default BackgroundSync;

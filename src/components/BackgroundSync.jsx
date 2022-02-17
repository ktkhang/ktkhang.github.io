import localforage from 'localforage';
import { memo, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import {
   LAST_SYNC_MESSAGE_ID,
   LOCAL_MESSAGES,
   SYNC_PENDING_MESSAGE_TAG,
} from '../constants/variables';
import useHasChanged from '../hooks/useHasChanged';
import { messageService } from '../services/messageService';
import { messagesState, pendingMessagesState } from '../store/atoms';

const BackgroundSync = memo(() => {
   const [messages, setMessages] = useRecoilState(messagesState);
   const [pendingMessages, setPendingMessages] = useRecoilState(pendingMessagesState);
   const lastMessageId = messages[messages.length - 1]?.id || '';
   const hasMessagesChanged = useHasChanged(`${lastMessageId}_${messages.length}`);
   const hasPendingMessagesChanged = useHasChanged(
      pendingMessages[pendingMessages.length - 1]?.id
   );
   const syncTimeout = useRef(null);

   const saveMessage = (newMessages) => {
      setMessages((prevData) => {
         const newData = [
            ...prevData,
            ...(newMessages.filter((i) => !prevData.find((j) => j.id === i.id)) || []),
         ];
         return newData;
      });
   };

   const loadDataFromLocal = async () => {
      const data = await localforage.getItem(LOCAL_MESSAGES);
      if (data?.length) {
         saveMessage(data);
      }
   };

   const loadDataFromServer = async () => {
      try {
         const lastSyncMsgId = await localforage.getItem(LAST_SYNC_MESSAGE_ID);
         if (lastSyncMsgId) {
            const response = await messageService.getAll(lastSyncMsgId);
            if (response.errorCode === 0) {
               saveMessage(response.data);
            }
         }
      } catch {}
   };

   useEffect(() => {
      const init = async () => {
         await loadDataFromLocal();
         loadDataFromServer();
      };
      init();

      return () => {
         if (syncTimeout.current) {
            clearTimeout(syncTimeout.current);
         }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      if (hasMessagesChanged) {
         if (syncTimeout.current) clearTimeout(syncTimeout.current);
         syncTimeout.current = setTimeout(() => {
            localforage.setItem(LOCAL_MESSAGES, messages).then(() => {
               localforage.setItem(LAST_SYNC_MESSAGE_ID, lastMessageId);
            });
         }, 3000);
      }
   }, [messages, lastMessageId, hasMessagesChanged]);

   useEffect(() => {
      if (hasPendingMessagesChanged) {
         localforage.setItem(SYNC_PENDING_MESSAGE_TAG, pendingMessages).then(async () => {
            const registration = await navigator.serviceWorker.ready;
            try {
               await registration.sync.register(SYNC_PENDING_MESSAGE_TAG);
            } catch {
               console.log('Background Sync could not be registered!');
            }
         });
      }
   }, [pendingMessages, hasPendingMessagesChanged]);

   return null;
});

export default BackgroundSync;
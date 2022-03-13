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
import { useAES } from '../lib/aes/AESWrapper';

class BackgroundSyncHandler extends PureComponent {
   deviceId = getSavedDeviceId();

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
      this.syncTimeout = setTimeout(async () => {
         const { lastMessageId, encrypt } = this.props;
         const savedMessages = (await localforage.getItem(LOCAL_MESSAGES)) || [];
         const newMesssges = this.props.messages.filter(
            (m) => !savedMessages.some((i) => i.id === m.id)
         );
         const encryptedMessages = [...savedMessages];

         for (const msgObj of newMesssges) {
            let content = await encrypt(msgObj.content);
            encryptedMessages.push({
               ...msgObj,
               content,
            });
         }

         localforage.setItem(LOCAL_MESSAGES, encryptedMessages).then(() => {
            localforage.setItem(LAST_SYNC_MESSAGE_ID, lastMessageId);
         });
      }, 500);
   };

   init = async () => {
      const { decrypt } = this.props;

      const encryptedLocalMessages = (await localforage.getItem(LOCAL_MESSAGES)) || [];
      // console.log('encryptedLocalMessages length: ', encryptedLocalMessages.length);
      // console.log('start decrypt');
      // let repeatCount = 0;
      // let totalTime = 0;
      let decryptedMessages = [];

      // const test = async () => {
      //    const t0 = performance.now();
      //    for (const msgObj of encryptedLocalMessages) {
      //       let content = await decrypt(msgObj.content);

      //       decryptedMessages.push({
      //          ...msgObj,
      //          content,
      //       });
      //    }
      //    const t1 = performance.now();
      //    const time = t1 - t0;
      //    repeatCount++;
      //    totalTime += time;
      // };
      // for (let i = 0; i < 10; i++) {
      //    await test();
      // }
      // console.log('repeatCount: ', repeatCount);
      // console.log('average time: ', totalTime / repeatCount);
      // console.log(decryptedMessages);

      for (const msgObj of encryptedLocalMessages) {
         let content = await decrypt(msgObj.content);

         decryptedMessages.push({
            ...msgObj,
            content,
         });
      }

      await this.props.setMessages(decryptedMessages);
      // load from server
      const lastSyncMsgId = await localforage.getItem(LAST_SYNC_MESSAGE_ID);
      if (lastSyncMsgId) {
         console.log(lastSyncMsgId);
         this.props.send('get_messages', {
            fromId: lastSyncMsgId,
         });
      }
   };

   handleSwPostMessage = (e) => {
      const { type, payload } = e.data;
      const { decrypt } = this.props;
      if (type === CONTINUE_SEND_MESSAGES) {
         const messages = (payload.messages || []).map((msgObj) => ({
            ...msgObj,
            content: decrypt(msgObj.content),
         }));
         this.props.send('message', {
            deviceId: this.deviceId,
            messages: messages,
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
   const { encrypt, decrypt } = useAES();
   const lastMessageId =
      messages[messages.length - 1]?.resolvedId || messages[messages.length - 1]?.id || '';
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
         encrypt={encrypt}
         decrypt={decrypt}
      />
   );
};

export default BackgroundSync;

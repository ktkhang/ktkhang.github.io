import React, { memo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import MessageStatus from '../enums/MessageStatus';
import pushNotifications from '../pushNotifications';
import { chatLogState, userInfoState } from '../store/atoms';
import { displayDateTime, getSavedDeviceId, uuidv4 } from '../utils/common';
import localforage from 'localforage';
import { LOCAL_MESSAGES } from '../constants/variables';
import { useAES } from '../lib/aes/AESWrapper';

const ChatLog = memo(() => {
   const { encrypt } = useAES();
   const deviceId = getSavedDeviceId();
   const chatLog = useRecoilValue(chatLogState);
   const userInfo = useRecoilValue(userInfoState);
   const [loading, setLoading] = useState(false);

   const pushRandomLargeMessages = async () => {
      await setLoading(true);
      const msgLength = 1000;
      const msgContentCharacterLength = 10000;
      let messageList = [];
      for (let i = 0; i < msgLength; i++) {
         // random content with character length is msgContentCharacterLength
         let content = '';
         for (let j = 0; j < msgContentCharacterLength; j++) {
            content += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
         }
         console.log(content.length);
         messageList.push({
            id: uuidv4(),
            deviceId,
            content,
            status: MessageStatus.SENT,
            dateTime: displayDateTime(new Date()),
            sender: {
               ...(userInfo || {}),
               deviceId,
            },
            sendAt: new Date(),
         });
      }

      let encryptedMessages = [];
      for (const msgObj of messageList) {
         let content = await encrypt(msgObj.content);
         encryptedMessages.push({
            ...msgObj,
            content,
         });
      }

      await localforage.setItem(LOCAL_MESSAGES, encryptedMessages);
      setLoading(false);
   };

   return (
      <div className="main__log">
         <div className="main__log--header">
            <h2>TEST</h2>
         </div>
         <div className="main__log--container">
            {chatLog.map((log) => (
               <div className="main__log--item" key={log.id}>
                  <div className="time">{displayDateTime(log.time)}: </div>
                  <div>{log.msg}</div>
               </div>
            ))}
            <button onClick={() => pushNotifications.broadcast()}>broadcast</button>
            <button onClick={pushRandomLargeMessages} disabled={loading}>
               push 1000 random large messages size
            </button>
         </div>
      </div>
   );
});

export default ChatLog;

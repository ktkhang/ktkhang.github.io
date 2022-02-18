import React, { memo, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import IconClock from '../icons/IconClock';
import IconUser from '../icons/IconUser';
import { messagesState, pendingMessagesState } from '../store/atoms';
import { displayTime, getSavedDeviceId } from '../utils/common';
import TypingUsersDisplay from './TypingUsersDisplay';

const ChatContent = memo(() => {
   const messages = useRecoilValue(messagesState);
   const pendingMessages = useRecoilValue(pendingMessagesState);
   const deviceId = getSavedDeviceId();
   const messagesBottomRef = useRef();

   const messageLength = messages.length + pendingMessages.length;

   useEffect(() => {
      if (messagesBottomRef.current) {
         messagesBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messageLength]);

   return (
      <div className="main__messages">
         {messages.map((msgItem, idx) => (
            <MessageItem
               key={msgItem.id}
               {...msgItem}
               isMe={msgItem.deviceId === deviceId}
               prevIsMe={
                  idx > 0 ? messages[idx - 1].deviceId === msgItem.deviceId : false
               }
            />
         ))}
         {pendingMessages.map((msgItem, idx) => {
            const isPrevIsMe =
               idx > 0 ? true : messages[messages.length - 1]?.deviceId === deviceId;
            return (
               <MessageItem
                  key={msgItem.id}
                  {...msgItem}
                  prevIsMe={isPrevIsMe}
                  isMe
                  isPending
               />
            );
         })}
         <TypingUsersDisplay />
         <div ref={messagesBottomRef} />
      </div>
   );
});

const MessageItem = memo((props) => {
   const { sender, sendAt, content, isMe, prevIsMe, isPending } = props;
   return (
      <div className={`message-item-container ${isMe ? 'me' : ''}`}>
         <div className="message-item">
            <div className="message-item__avatar">
               {!prevIsMe && <IconUser alt={sender.name} />}
            </div>
            <div className="message-item__info">
               {!prevIsMe && <label>{sender.name}</label>}
               <p>{content}</p>
               {!isPending ? (
                  <span className="message-item__time">{displayTime(sendAt)}</span>
               ) : (
                  <span className="message-item__pending">
                     <IconClock />
                     Sending...
                  </span>
               )}
            </div>
         </div>
      </div>
   );
});

export default ChatContent;

import React, { memo, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { messagesState } from '../store/atoms';
import { displayTime, getSavedDeviceId } from '../utils/common';

const ChatContent = memo(() => {
   const messages = useRecoilValue(messagesState);
   const deviceId = getSavedDeviceId();
   const messagesBottomRef = useRef();

   const messageLength = messages.length;

   useEffect(() => {
      if (messagesBottomRef.current) {
         messagesBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messageLength]);

   return (
      <div className="main__messages">
         {messages.map((msgItem, index) => {
            return (
               <MessageItem
                  key={msgItem.id}
                  {...msgItem}
                  isMe={msgItem.deviceId === deviceId}
                  prevIsMe={
                     index > 0 ? messages[index - 1].deviceId === msgItem.deviceId : false
                  }
               />
            );
         })}
         <div ref={messagesBottomRef} />
      </div>
   );
});

const MessageItem = memo((props) => {
   const { sender, sendAt, content, isMe, prevIsMe } = props;
   return (
      <div className={`message-item-container ${isMe ? 'me' : ''}`}>
         <div className="message-item">
            <div className="message-item__avatar">
               {!prevIsMe && (
                  <img
                     src={`https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png`}
                     alt={sender.name}
                  />
               )}
            </div>
            <div className="message-item__info">
               {!prevIsMe && <label>{sender.name}</label>}
               <p>{content}</p>
               <span className="message-item__time">{displayTime(sendAt)}</span>
            </div>
         </div>
      </div>
   );
});

export default ChatContent;

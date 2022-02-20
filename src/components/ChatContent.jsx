import React, { memo, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import MessageStatus from '../enums/MessageStatus';
import IconUser from '../icons/IconUser';
import { messagesState } from '../store/atoms';
import { displayTime, getSavedDeviceId } from '../utils/common';
import TypingUsersDisplay from './TypingUsersDisplay';

const ChatContent = memo(() => {
   const messages = useRecoilValue(messagesState);
   const deviceId = getSavedDeviceId();
   const messagesBottomRef = useRef();

   const messagesLength = messages.length;

   useEffect(() => {
      if (messagesBottomRef.current) {
         messagesBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messagesLength]);

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
         <TypingUsersDisplay />
         <div ref={messagesBottomRef} />
      </div>
   );
});

const MessageItem = memo((props) => {
   const { sender, sendAt, content, isMe, prevIsMe, status } = props;
   const [displayStatus, setDisplayStatus] = useState(MessageStatus.SENT);
   const statusRef = useRef(status);
   const delayTimer = useRef(null);

   useEffect(() => {
      statusRef.current = status;
   });

   useEffect(() => {
      if (status !== MessageStatus.SENDING) {
         setDisplayStatus(status);
      } else {
         delayTimer.current = setTimeout(() => {
            if (statusRef.current !== MessageStatus.SENT) {
               setDisplayStatus(status);
            }
         }, 1000);
      }

      return () => {
         clearTimeout(delayTimer.current);
      };
   }, [status]);

   return (
      <div className={`message-item-container ${isMe ? 'me' : ''}`}>
         <div className="message-item">
            <div className="message-item__avatar">
               {!prevIsMe && <IconUser alt={sender.name} />}
            </div>
            <div className="message-item__info">
               {!prevIsMe && <label>{sender.name}</label>}
               <p>{content}</p>
               <div className="message-item__subinfo">
                  <span className="message-item__time">{displayTime(sendAt)}</span>
                  {isMe &&
                     (() => {
                        if (displayStatus === MessageStatus.SENDING) {
                           return <span className="message-item__sending">Sending</span>;
                        }
                        if (status === MessageStatus.SENT) {
                           return <span className="message-item__sent">Sent</span>;
                        }
                     })()}
               </div>
            </div>
         </div>
      </div>
   );
});

export default ChatContent;

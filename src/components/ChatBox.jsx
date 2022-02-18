import React, { memo, useState, useEffect, useRef } from 'react';
import { messageService } from '../services/messageService';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { pendingMessagesState, userInfoState } from '../store/atoms';
import { getSavedDeviceId, uuidv4 } from '../utils/common';
import useDebounce from '../hooks/useDebounce';
import socket from '../utils/socket';

const ChatBox = memo(() => {
   const [msg, setMsg] = useState('');
   const setPendingMessages = useSetRecoilState(pendingMessagesState);
   const userInfo = useRecoilValue(userInfoState);
   const isTyping = useDebounce(msg.trim() !== '', 500);
   const selfChanged = useRef(false);

   useEffect(() => {
      if (selfChanged.current) {
         socket.emit('set_typing', {
            deviceId: getSavedDeviceId(),
            isTyping,
         });
      }
   }, [isTyping]);

   const sendMessage = async () => {
      if (!msg.trim()) return;
      setMsg('');
      // socket.emit('message', {
      //    deviceId: getSavedDeviceId(),
      //    msg: msg.trim(),
      // });
      const response = await messageService.send(msg.trim());

      if (response.errorCode !== 0) {
         // internet disconnected
         if (response.errorCode === 'ERR_INTERNET_DISCONNECTED') {
            const deviceId = getSavedDeviceId();
            setPendingMessages((prevData) => [
               ...prevData,
               {
                  id: uuidv4(),
                  deviceId,
                  content: msg.trim(),
                  sendAt: new Date(),
                  sender: { ...(userInfo || {}) },
               },
            ]);
         }
      }
   };

   const handleChange = (e) => {
      setMsg(e.target.value);
      selfChanged.current = true;
   };
   return (
      <div className="main__chatbox">
         <input
            value={msg}
            placeholder="Type a message..."
            onChange={handleChange}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
         />
         <button onClick={sendMessage}>Send</button>
      </div>
   );
});

export default ChatBox;

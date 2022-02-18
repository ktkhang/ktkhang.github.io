import React, { memo, useState, useRef } from 'react';
import { messageService } from '../services/messageService';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { pendingMessagesState, userInfoState } from '../store/atoms';
import { getSavedDeviceId, uuidv4 } from '../utils/common';
// import { getSavedDeviceId } from '../utils/common';
// import socket from '../utils/socket';

const ChatBox = memo(() => {
   const [msg, setMsg] = useState('');
   const setPendingMessages = useSetRecoilState(pendingMessagesState);
   const userInfo = useRecoilValue(userInfoState);

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

   return (
      <div className="main__chatbox">
         <input
            value={msg}
            placeholder="Type a message..."
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
         />
         <button onClick={sendMessage}>Send</button>
      </div>
   );
});

export default ChatBox;

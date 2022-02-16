import React, { memo, useState } from 'react';
import { getSavedDeviceId } from '../utils/common';
import socket from '../utils/socket';

const ChatBox = memo(() => {
   const [msg, setMsg] = useState('');

   const sendMessage = () => {
      if (!msg.trim()) return;
      setMsg('');
      socket.emit('message', {
         deviceId: getSavedDeviceId(),
         msg: msg.trim(),
      });
   };

   return (
      <div className="main__chatbox">
         <input
            value={msg}
            placeholder="Type a message..."
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
         />
         <button onClick={sendMessage}>Send</button>
      </div>
   );
});

export default ChatBox;

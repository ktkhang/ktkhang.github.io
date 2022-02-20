import React, { memo, useState, useEffect, useRef } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { messagesState, userInfoState } from '../store/atoms';
import { getSavedDeviceId, uuidv4 } from '../utils/common';
import useDebounce from '../hooks/useDebounce';
import useWebSocket from '../lib/websocket/useWebSocket';
import MessageStatus from '../enums/MessageStatus';

const ChatBox = memo(() => {
   const deviceId = getSavedDeviceId();

   const [msg, setMsg] = useState('');
   // const [submiting, setSubmiting] = useState(false);
   const { send } = useWebSocket();
   const setMessages = useSetRecoilState(messagesState);
   const userInfo = useRecoilValue(userInfoState);

   const isTyping = useDebounce(msg.trim() !== '', 500);
   const selfChanged = useRef(false);

   useEffect(() => {
      if (selfChanged.current) {
         send('set_typing', {
            deviceId,
            isTyping,
         });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isTyping]);

   const sendMessage = async () => {
      if (!msg.trim()) return;
      // await setSubmiting(true);
      setMsg('');
      const newMessage = {
         id: uuidv4(),
         deviceId,
         content: msg.trim(),
         sender: {
            ...(userInfo || {}),
            deviceId,
         },
         sendAt: new Date(),
         status: MessageStatus.SENDING,
      };
      await setMessages((prevMessages) => [...prevMessages, newMessage]);
      send('message', {
         deviceId,
         messages: [newMessage],
      });

      // setSubmiting(false);
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
            onKeyUp={(e) => (e.key === 'Enter' || e.keyCode === 13) && sendMessage()}
         />
         <button onClick={sendMessage}>Send</button>
      </div>
   );
});

export default ChatBox;

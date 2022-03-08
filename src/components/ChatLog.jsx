import React, { memo } from 'react';
import { useRecoilValue } from 'recoil';
import pushNotifications from '../pushNotifications';
import { chatLogState } from '../store/atoms';
import { displayDateTime } from '../utils/common';

const ChatLog = memo(() => {
   const chatLog = useRecoilValue(chatLogState);

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
         </div>
      </div>
   );
});

export default ChatLog;

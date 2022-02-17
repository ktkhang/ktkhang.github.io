import React, { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { chatLogState } from '../store/atoms';
import { displayTime } from '../utils/common';

const ChatLog = memo(() => {
   const chatLog = useRecoilValue(chatLogState);

   return (
      <div className="main__log">
         <div className="main__log--header">
            <h2>Log</h2>
         </div>
         <div className="main__log--container">
            {chatLog.map((log) => (
               <div className="main__log--item" key={log.id}>
                  <div className="time">{displayTime(log.time)}: </div>
                  <div>{log.msg}</div>
               </div>
            ))}
         </div>
      </div>
   );
});

export default ChatLog;

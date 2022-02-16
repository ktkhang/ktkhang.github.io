import React, { memo, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { chatLogState } from '../store/atoms';

const ChatLog = memo(() => {
   const chatLog = useRecoilValue(chatLogState);
   console.log(chatLog);

   return (
      <div className="main__log">
         {chatLog.map((log) => (
            <div key={log.id}>{log.msg}</div>
         ))}
      </div>
   );
});

export default ChatLog;

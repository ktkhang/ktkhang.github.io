import React from 'react';
import { useSetRecoilState } from 'recoil';
import { chatLogState } from '../store/atoms';
import { uuidv4 } from '../utils/common';

const useSocketMessageHandler = () => {
   const setChatLogState = useSetRecoilState(chatLogState);

   const _handleUserJoined = (payload) => {
      const { user } = payload;
      setChatLogState((prev) => [
         ...prev,
         {
            id: uuidv4(),
            msg: `"${user.name || 'Anonymous'}" have joined the chat.`,
         },
      ]);
   };

   const _handleUserLeft = (payload) => {
      const { name } = payload;
      setChatLogState((prev) => [
         ...prev,
         {
            id: uuidv4(),
            msg: `"${name || 'Anonymous'}" have left the chat.`,
         },
      ]);
   };

   // handle message
   const handleMessage = (msg) => {
      console.log(JSON.parse(msg.data));
      const { type, payload } = JSON.parse(msg.data);

      switch (type) {
         case 'joined':
            return _handleUserJoined(payload);
         case 'leave':
            return _handleUserLeft(payload);

         default:
            break;
      }
   };

   return {
      handleMessage,
   };
};

export default useSocketMessageHandler;

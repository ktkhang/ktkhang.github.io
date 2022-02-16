import { useSetRecoilState } from 'recoil';
import { chatLogState, messagesState } from '../store/atoms';
import { uuidv4 } from '../utils/common';

const useSocketMessageHandler = () => {
   const setChatLogState = useSetRecoilState(chatLogState);
   const setMessagesState = useSetRecoilState(messagesState);

   const _handleUserJoined = (payload) => {
      const { user, time } = payload;
      setChatLogState((prev) => [
         ...prev,
         {
            id: uuidv4(),
            msg: `"${user.name || 'Anonymous'}" have joined the chat.`,
            time,
         },
      ]);
   };

   const _handleUserLeft = (payload) => {
      const { name, time } = payload;
      setChatLogState((prev) => [
         ...prev,
         {
            id: uuidv4(),
            msg: `"${name || 'Anonymous'}" have left the chat.`,
            time,
         },
      ]);
   };

   const _handleMessage = (payload) => {
      setMessagesState((prev) => [...prev, { ...payload }]);
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

         case 'message':
            return _handleMessage(payload);

         default:
            break;
      }
   };

   return {
      handleMessage,
   };
};

export default useSocketMessageHandler;

import { useSetRecoilState } from 'recoil';
import { chatLogState, messagesState, socketState } from '../store/atoms';
import { getSavedDeviceId, uuidv4 } from '../utils/common';

const useSocketHandler = () => {
   const setChatLogState = useSetRecoilState(chatLogState);
   const setMessagesState = useSetRecoilState(messagesState);
   const setSocketState = useSetRecoilState(socketState);
   const deviceId = getSavedDeviceId();

   const _handleUserJoined = (payload) => {
      const { user, time } = payload;
      setChatLogState((prev) => [
         ...prev,
         {
            id: uuidv4(),
            msg: `${
               deviceId === user.deviceId ? 'You' : `"${user.name || 'Anonymous'}"`
            } have joined the chat.`,
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

   // handle connection open
   const handleOpen = (websocket) => (e) => {
      websocket.send(
         JSON.stringify({
            type: 'joined',
            payload: {
               deviceId,
            },
         })
      );
      setSocketState((prev) => ({ ...prev, errorCode: 0 }));
   };

   // handle connection close
   const handleClose = (e) => {
      console.log(e);
      setSocketState((prev) => ({ ...prev, errorCode: e.code !== 1005 ? e.code : 0 }));
   };

   // handle error
   const handleError = (e) => {
      console.log(e);
   };

   return {
      handleOpen,
      handleClose,
      handleMessage,
      handleError,
   };
};

export default useSocketHandler;

import { useSetRecoilState } from 'recoil';
import MessageStatus from '../enums/MessageStatus';
import { chatLogState, messagesState, socketState, typingUsersState } from '../store/atoms';
import { getSavedDeviceId, uuidv4 } from '../utils/common';

const useSocketHandler = () => {
   const setChatLog = useSetRecoilState(chatLogState);
   const setMessages = useSetRecoilState(messagesState);
   const setTypingUsers = useSetRecoilState(typingUsersState);
   const setSocketState = useSetRecoilState(socketState);
   const deviceId = getSavedDeviceId();

   const _handleUserJoined = (payload) => {
      const { user, time } = payload;
      setChatLog((prev) => [
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
      setChatLog((prev) => [
         ...prev,
         {
            id: uuidv4(),
            msg: `"${name || 'Anonymous'}" have left the chat.`,
            time,
         },
      ]);
   };

   const _handleMessage = (msgList) => {
      setMessages((prevMessages) => {
         let deliveredMessages = prevMessages.filter(
            (msg) =>
               msg.status === MessageStatus.SENDING && msgList.some((m) => m.resolvedId === msg.id)
         );
         const retainedMessages = prevMessages.filter(
            (msg) => !deliveredMessages.some((m) => m.id === msg.id)
         );
         let newMessages = msgList.filter(
            (msg) =>
               !deliveredMessages.some((m) => m.id === msg.resolvedId) &&
               !retainedMessages.some((m) => m.id === msg.id)
         );
         if (deliveredMessages.length) {
            deliveredMessages = deliveredMessages.map((msg) => ({
               ...msg,
               status: MessageStatus.SENT,
            }));
         }
         if (newMessages.length) {
            newMessages = newMessages.map((msg) => ({
               ...msg,
               status: MessageStatus.SENT,
            }));
         }
         return [...retainedMessages, ...deliveredMessages, ...newMessages];
      });
   };

   const _handleSetTypingUsers = (payload = {}) => {
      setTypingUsers({ ...payload });
   };

   // handle message
   const handleMessage = (data) => {
      const { type, payload } = data;

      switch (type) {
         case 'joined':
            return _handleUserJoined(payload);

         case 'leave':
            return _handleUserLeft(payload);

         case 'message':
            return _handleMessage(payload);

         case 'set_typing':
            return _handleSetTypingUsers(payload);

         default:
            return;
      }
   };

   // handle connection open
   const handleOpen = (ws) => {
      ws.send(
         JSON.stringify({
            type: 'joined',
            payload: {
               deviceId,
            },
         })
      );
      setSocketState((prev) => ({ ...prev, errorCode: 0 }));
   };

   // handle close
   const handleClose = (e) => {
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

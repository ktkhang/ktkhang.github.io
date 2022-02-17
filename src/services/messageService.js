import { config } from '../constants/confjg';
import { getSavedDeviceId } from '../utils/common';

const send = (msg) => {
   const deviceId = getSavedDeviceId();
   return fetch(`${config.API_URL}/message/send`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         deviceId,
         msg,
      }),
   })
      .then((response) => response.json())
      .catch((error) => {
         return {
            errorCode: !navigator.onLine ? 'ERR_INTERNET_DISCONNECTED' : 500,
            message: error.message,
         };
      });
};

const getAll = (msgId) => {
   return fetch(`${config.API_URL}/message/get?msgId=${msgId}`, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
      },
   })
      .then((response) => response.json())
      .catch((error) => {
         console.log(error);
      });
};

export const messageService = {
   send,
   getAll,
};

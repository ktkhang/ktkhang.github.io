import { config } from '../constants/confjg';
import { getSavedDeviceId } from '../utils/common';

const getMe = (deviceId) => {
   return fetch(`${config.API_URL}/me?device_id=${deviceId}`, {
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

const login = (body) => {
   const deviceId = getSavedDeviceId();
   return fetch(`${config.API_URL}/login`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         deviceId,
         data: {
            ...(body || {}),
            deviceId,
         },
      }),
   })
      .then((response) => response.json())
      .catch((error) => {
         console.log(error);
      });
};

export const userService = {
   getMe,
   login,
};

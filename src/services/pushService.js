import { config } from '../constants/confjg';
import { getSavedDeviceId } from '../utils/common';

const subscribe = (subscription) => {
   return fetch(`${config.API_URL}/subscription`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         deviceId: getSavedDeviceId(),
         subscription,
      }),
   })
      .then((response) => response.json())
      .catch((error) => {
         console.log(error);
      });
};

const unsubscribe = (endpoint) => {
   return fetch(`${config.API_URL}/subscription?endpoint=${endpoint}`, {
      method: 'DELETE',
      headers: {
         'Content-Type': 'application/json',
      },
   })
      .then((response) => response.json())
      .catch((error) => {
         console.log(error);
      });
};

const broadcast = () => {
   return fetch(`${config.API_URL}/broadcast`, {
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

export const pushService = {
   subscribe,
   unsubscribe,
   broadcast,
};

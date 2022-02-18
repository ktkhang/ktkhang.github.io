import { DEVICE_ID_VARIABLE } from '../constants/variables';
import moment from 'moment-timezone';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getDeviceId = async () => {
   const savedDeviceId = localStorage[DEVICE_ID_VARIABLE];
   if (savedDeviceId) return savedDeviceId;
   const _fpPromise = FingerprintJS.load();
   const fp = await _fpPromise;
   const result = await fp.get();
   localStorage[DEVICE_ID_VARIABLE] = result.visitorId;
   return result.visitorId;
};

export const getSavedDeviceId = () => {
   const savedDeviceId = localStorage[DEVICE_ID_VARIABLE];
   if (savedDeviceId) return savedDeviceId;
   return null;
};

export const uuidv4 = () => {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
         v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
   });
};

export const getTimeZone = () => {
   return moment.tz.guess();
};

export const displayTime = (isoString) => {
   return moment(isoString).tz(getTimeZone()).format('MMM DD, YYYY hh:mm A');
};

import { pushService } from './services/pushService';
import util from './utils/util';

const isSupported = () => {
   return 'serviceWorker' in navigator && 'PushManager' in window;
};

const requestPermission = () => {
   // request user grant to show notification
   return Notification.requestPermission((result) => {
      return result;
   });
};

const registerServiceWorker = () => {
   navigator.serviceWorker
      .register('./service-worker.js')
      .then((registration) => {
         //you can do something with the service wrker registration (swRegistration)
         if (registration.installing) {
            console.log('Service worker installing');
         } else if (registration.waiting) {
            console.log('Service worker installed');
         } else if (registration.active) {
            console.log('Service worker active');
         }
      })
      .catch((e) => {
         console.log('Registration failed. Error: ' + e);
      });
};

const send = () => {
   const body = 'Khang test';
   const title = 'Welcome';
   const options = {
      body,
      vibrate: [200, 100, 200],
      actions: [{ action: 'Detail', title: 'View' }],
   };
   navigator.serviceWorker.ready.then((serviceWorker) => {
      serviceWorker.showNotification(title, options);
   });
};

/**
 * push api
 */

const publicVapidKey =
   'BMrfFtMtL9IWl9vchDbbbYzJlbQwplyZ_fbv8Pei8gPNna_Dr1O-Ng7U7fy0LLqz5RKIxEytTIzyk6TLrcKbN30';

const subscribe = async () => {
   const registration = await navigator.serviceWorker.ready;
   // Subscribe to push notifications
   const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: util.urlBase64ToUint8Array(publicVapidKey),
   });
   const response = await pushService.subscribe(subscription);
   console.log(response);
};

const unsubscribe = async () => {
   const registration = await navigator.serviceWorker.ready;
   const subscription = await registration.pushManager.getSubscription();
   if (!subscription) return;
   const { endpoint } = subscription;
   const response = await pushService.unsubscribe(endpoint);
   console.log(response);
   if (response.errorCode === 0) {
      await subscription.unsubscribe();
   }
};

const broadcast = async () => {
   await pushService.broadcast();
};

const pushNotifications = {
   isSupported,
   requestPermission,
   registerServiceWorker,
   send,
   subscribe,
   unsubscribe,
   broadcast,
};

export default pushNotifications;

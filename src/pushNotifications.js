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

const pushNotifications = {
   isSupported,
   requestPermission,
   registerServiceWorker,
   send,
};

export default pushNotifications;

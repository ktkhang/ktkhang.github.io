/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

importScripts('/localforage-1.10.0.min.js');

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
   // Return false to exempt requests from being fulfilled by index.html.
   ({ request, url }) => {
      // If this isn't a navigation, skip.
      if (request.mode !== 'navigate') {
         return false;
      } // If this is a URL that starts with /_, skip.

      if (url.pathname.startsWith('/_')) {
         return false;
      } // If this looks like a URL for a resource, because it contains // a file extension, skip.

      if (url.pathname.match(fileExtensionRegexp)) {
         return false;
      } // Return true to signal that we want to use the handler.

      return true;
   },
   createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
   // Add in any other file extensions or routing criteria as needed.
   ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
   new StaleWhileRevalidate({
      cacheName: 'images',
      plugins: [
         // Ensure that once this runtime cache reaches a maximum size the
         // least-recently used images are removed.
         new ExpirationPlugin({ maxEntries: 50 }),
      ],
   })
);

// Allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
   if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
   }
});

self.addEventListener('install', function (e) {
   e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
   console.log('[SW] on activate');
   event.waitUntil(self.clients.claim());
});

// const sendPendingMessages = (deviceId, messages) => {
//    return fetch('https://ktkhang.onrender.com/message/send', {
//       method: 'POST',
//       headers: {
//          'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//          deviceId,
//          messages,
//       }),
//    })
//       .then((response) => response.json())
//       .catch((error) => {
//          console.log(error);
//       });
// };

// const CLIENT_ID = 'client_id';
const LOCAL_MESSAGES = 'local_messages';
const CONTINUE_SEND_MESSAGES = 'continue_send_messages';

// self.addEventListener('fetch', (event) => {
//    // localforage.setItem(CLIENT_ID, event.clientId);
// });

async function getClients() {
   const appUrl = new URL(self.registration.scope).origin;
   const clients = await self.clients.matchAll({ type: 'window' });
   return clients.filter((client) => {
      return new URL(client.url).origin === appUrl;
   });
}

// Network is back up
self.addEventListener('sync', (event) => {
   console.log('[SW] sync');
   // send client reconnect websocket server
   event.waitUntil(
      (async () => {
         // sync pending messages
         // if (event.tag === SYNC_PENDING_MESSAGE_TAG) {
         const messages = await localforage.getItem(LOCAL_MESSAGES);
         const pendingMessages = messages.filter((message) => message.status === 'sending');
         if (pendingMessages?.length) {
            self.registration.showNotification(`Messages synced`, {
               icon: '/logo192.png',
               body: 'Your messages have been synced.',
               data: {
                  url: 'https://ktkhang.github.io/',
               },
            });
            const clients = await getClients();
            clients.forEach((client) => {
               client.postMessage({
                  type: CONTINUE_SEND_MESSAGES,
                  payload: {
                     messages: pendingMessages,
                  },
               });
            });
            // const response = await sendPendingMessages(deviceId, pendingMessages);
            // if (response && response.errorCode === 0) {
            //    console.log('resend success');

            //    // if (!clientId) return;
            //    // self.clients.get(clientId).then((client) => {
            //    //    client.postMessage({
            //    //       msg: RESET_PENDING_MESSAGES,
            //    //    });
            //    // });
            // }
         }
         // }
      })()
   );
});

// web push notification
self.addEventListener('push', (e) => {
   const data = e.data.json();
   self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
   });
});

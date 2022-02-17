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

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
   if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
   }
});

const sendPendingMessages = (deviceId, messages) => {
   return fetch('http://127.0.0.1:8080/message/send', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         deviceId,
         messages,
      }),
   })
      .then((response) => response.json())
      .catch((error) => {
         console.log(error);
      });
};

const DEVICE_ID_VARIABLE = 'client_device_id';
const SYNC_PENDING_MESSAGE_TAG = 'sync_pending_messages';
const RESET_PENDING_MESSAGES = 'reset_pending_messages';

// Network is back up, we're being awaken, let's do the requests we were trying to do before if any.
self.addEventListener('sync', (event) => {
   if (event.tag === SYNC_PENDING_MESSAGE_TAG) {
      console.log('SYNC_PENDING_MESSAGE_TAG');
      event.waitUntil(async () => {
         console.log('oke');

         // const deviceId = await localforage.getItem(DEVICE_ID_VARIABLE);
         // const msgs = await localforage.getItem(SYNC_PENDING_MESSAGE_TAG);
         // if (deviceId && msgs?.length) {
         //    const pendingMessages = msgs.map((msg) => msg.content);
         //    const response = await sendPendingMessages(deviceId, pendingMessages);
         //    if (response.errorCode === 0) {
         //       console.log('sync success');

         //       if (!event.clientId) return;
         //       console.log(self.clients);
         //       self.clients.matchAll().then(async (clients) => {
         //          console.log(clients);
         //          const client = await clients.get(event.clientId);
         //          console.log(client);
         //          if (!client) return;

         //          // Send a message to the client.
         //          client.postMessage({
         //             msg: RESET_PENDING_MESSAGES,
         //          });
         //       });
         //    }
         // }
      });
   }
});

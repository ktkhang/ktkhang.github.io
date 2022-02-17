/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';
precacheAndRoute(self.__WB_MANIFEST);

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
         function readDB() {
            idb.open('localforage', 1)
               .then(function (db) {
                  var tx = db.transaction(['keyvaluepairs'], 'readonly');
                  var store = tx.objectStore('keyvaluepairs');
                  return store.getAll();
               })
               .then(function (items) {
                  // Use beverage data
                  console.log(items);
               });
         }
         readDB();

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

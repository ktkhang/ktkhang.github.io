import util from '../../utils/util';
import SignalProtocolStore from './SignalProtocolStore';

const libsignal = window.libsignal;
const KeyHelper = libsignal.KeyHelper;
/**
 * Dummy signal server connector.
 *
 * In a real application this component would connect to your signal
 * server for storing and fetching user public keys over HTTP.
 */
export class SignalServerStore {
   /**
    * When a user logs on they should generate their keys and then register them with the server.
    *
    * @param userId The user ID.
    * @param preKeyBundle The user's generated pre-key bundle.
    */
   registerNewPreKeyBundle(userId, preKeyBundle) {
      let storageBundle = { ...preKeyBundle };
      storageBundle.identityKey = util.arrayBufferToBase64(storageBundle.identityKey);
      storageBundle.preKey.publicKey = util.arrayBufferToBase64(storageBundle.preKey.publicKey);
      storageBundle.signedPreKey.publicKey = util.arrayBufferToBase64(
         storageBundle.signedPreKey.publicKey
      );
      storageBundle.signedPreKey.signature = util.arrayBufferToBase64(
         storageBundle.signedPreKey.signature
      );
      localStorage.setItem(userId, JSON.stringify(storageBundle));
   }

   /**
    * Gets the pre-key bundle for the given user ID.
    * If you want to start a conversation with a user, you need to fetch their pre-key bundle first.
    *
    * @param userId The ID of the user.
    */
   getPreKeyBundle(userId) {
      let storageBundle = JSON.parse(localStorage.getItem(userId));
      storageBundle.identityKey = util.base64ToArrayBuffer(storageBundle.identityKey);
      storageBundle.preKey.publicKey = util.base64ToArrayBuffer(storageBundle.preKey.publicKey);
      storageBundle.signedPreKey.publicKey = util.base64ToArrayBuffer(
         storageBundle.signedPreKey.publicKey
      );
      storageBundle.signedPreKey.signature = util.base64ToArrayBuffer(
         storageBundle.signedPreKey.signature
      );
      return storageBundle;
   }
}

/**
 * A signal protocol manager.
 */
class SignalProtocol {
   userId = '';
   store = null;
   signalServerStore = null;
   #identityKeyPair = null;
   #registrationId = null;

   constructor(userId, signalServerStore) {
      this.userId = userId;
      this.store = new SignalProtocolStore();
      this.signalServerStore = signalServerStore;
   }

   /**
    * Initialize the manager when the user logs on.
    */
   async initialize() {
      const [identityKeyPair, registrationId] = await Promise.all([
         KeyHelper.generateIdentityKeyPair(),
         KeyHelper.generateRegistrationId(),
      ]);
      this.#identityKeyPair = identityKeyPair;
      this.#registrationId = registrationId;
      this.store.put('identityKey', identityKeyPair);
      this.store.put('registrationId', registrationId);

      console.log(identityKeyPair);
      console.log(registrationId);
      const preKeyBundle = await this.#generatePreKeyBundle();
      console.log(preKeyBundle);
      this.signalServerStore.registerNewPreKeyBundle(this.userId, preKeyBundle);
   }

   /**
    * Generates a new pre-key bundle.
    *
    * @returns A pre-key bundle.
    */
   async #generatePreKeyBundle() {
      const [preKey, signedPreKey] = await Promise.all([
         KeyHelper.generatePreKey(this.#registrationId + 1),
         KeyHelper.generateSignedPreKey(this.#identityKeyPair, this.#registrationId + 1),
      ]);
      console.log(preKey);
      console.log(signedPreKey);

      this.store.storePreKey(preKey.keyId, preKey.keyPair);
      this.store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);

      return {
         identityKey: this.#identityKeyPair.pubKey,
         registrationId: this.#registrationId,
         preKey: {
            keyId: preKey.keyId,
            publicKey: preKey.keyPair.pubKey,
         },
         signedPreKey: {
            keyId: signedPreKey.keyId,
            publicKey: signedPreKey.keyPair.pubKey,
            signature: signedPreKey.signature,
         },
      };
   }

   /**
    * Encrypt a message to recipient.
    * @param {*} recipientId
    * @param {*} message
    */
   async encryptMessage(recipientId, message) {
      let sessionCipher = this.store.loadSessionCipher(recipientId);
      if (!sessionCipher) {
         const recipientDeviceId = recipientId;
         const address = new libsignal.SignalProtocolAddress(recipientId, recipientDeviceId);

         // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
         const sessionBuilder = new libsignal.SessionBuilder(this.store, address);
         const recipientPreKeyBundle = this.signalServerStore.getPreKeyBundle(recipientId);

         // Process a prekey fetched from the server. Returns a promise that resolves
         // once a session is created and saved in the store, or rejects if the
         // identityKey differs from a previously seen identity for this address.
         try {
            await sessionBuilder.processPreKey(recipientPreKeyBundle);
            sessionCipher = new libsignal.SessionCipher(this.store, address);
            this.store.storeSessionCipher(recipientId, sessionCipher);
         } catch (err) {
            // handle identity key conflict
            console.log(err);
         }
      }
      if (sessionCipher) {
         let cipherText = await sessionCipher.encrypt(util.toArrayBuffer(message));
         return cipherText;
      }
   }

   /**
    * Decrypt a message from a sender.
    * @param {*} senderId
    * @param {*} cipherText
    */
   async decryptMessage(senderId, cipherText) {
      let sessionCipher = this.store.loadSessionCipher(senderId);
      if (!sessionCipher) {
         const senderDeviceId = senderId;
         const address = new libsignal.SignalProtocolAddress(senderId, senderDeviceId);
         sessionCipher = new libsignal.SessionCipher(this.store, address);
         this.store.storeSessionCipher(senderId, sessionCipher);
      }

      let decryptedMessage = '';
      try {
         if (cipherText.type === 3) {
            // Decrypt a PreKeyWhisperMessage by first establishing a new session.
            // Returns a promise that resolves when the message is decrypted or
            // rejects if the identityKey differs from a previously seen identity for this address.
            decryptedMessage = await sessionCipher.decryptPreKeyWhisperMessage(
               cipherText.body,
               'binary'
            );
         } else {
            // Decrypt a normal message using an existing session
            decryptedMessage = await sessionCipher.decryptWhisperMessage(cipherText.body, 'binary');
         }
      } catch (err) {
         console.log(err);
      }
      return util.toString(decryptedMessage);
   }
}

export const createSignalProtocol = async (userId, dummySignalServer) => {
   let signalProtocolManager = new SignalProtocol(userId, dummySignalServer);
   await Promise.all([signalProtocolManager.initialize()]);
   return signalProtocolManager;
};

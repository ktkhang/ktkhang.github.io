import util from '../../utils/util';
import { PBKDF2_HMAC_SHA256 } from '../pbkdf2';

const SALT_SIZE = 16;
const IV_SIZE = 16;
const ALGORITHM = 'AES-GCM';

const encoder = new TextEncoder();

const deriveKey = async (password, salt) => {
   const derivedKey = PBKDF2_HMAC_SHA256(password, salt);
   return await crypto.subtle.importKey('raw', derivedKey, ALGORITHM, false, [
      'encrypt',
      'decrypt',
   ]);
};

class AES {
   #secret = null;
   constructor(secret) {
      this.#secret = encoder.encode(secret);
   }

   encrypt = async (value) => {
      const salt = window.crypto.getRandomValues(new Uint8Array(SALT_SIZE));
      const iv = window.crypto.getRandomValues(new Uint8Array(IV_SIZE));
      const plain_text = util.utf8ToUint8Array(value);
      const key = await deriveKey(this.#secret, salt);

      const encrypted = await window.crypto.subtle.encrypt(
         { name: ALGORITHM, iv },
         key,
         plain_text
      );

      const concatenned = util.arrayBufferToBase64([...salt, ...iv, ...new Uint8Array(encrypted)]);
      return concatenned;
   };

   decrypt = async (cipher) => {
      const encrypted = util.base64ToUint8Array(cipher);
      const salt = encrypted.slice(0, SALT_SIZE);
      const iv = encrypted.slice(SALT_SIZE, SALT_SIZE + IV_SIZE);
      const key = await deriveKey(this.#secret, salt);
      const decrypted = await window.crypto.subtle.decrypt(
         { name: ALGORITHM, iv },
         key,
         encrypted.slice(SALT_SIZE + IV_SIZE)
      );
      const result = util.arrayBufferToUtf8(decrypted);
      return result;
   };
}

export default AES;

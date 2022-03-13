import util from '../../utils/util';

const SALT_LENGTH = 128 / 8;
const IV_LENGTH = 128 / 8;
const AES_KEY_SIZE = 256;
const KDF_ITERATIONS = 5000;
const ALGORITHM = 'AES-GCM';
const HASH = 'SHA-256';

const encoder = new TextEncoder();

const generateDerivedKey = async (password, salt) => {
   const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      util.utf8ToUint8Array(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
   );
   return await window.crypto.subtle.deriveKey(
      {
         name: 'PBKDF2',
         salt: util.utf8ToUint8Array(salt),
         iterations: KDF_ITERATIONS,
         hash: HASH,
      },
      keyMaterial,
      { name: ALGORITHM, length: AES_KEY_SIZE },
      false,
      ['encrypt', 'decrypt']
   );
};

class AesWebCrypto {
   #secret = null;
   constructor(secret) {
      this.#secret = encoder.encode(secret);
   }

   encrypt = async (value) => {
      const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
      const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
      const plain_text = util.utf8ToUint8Array(value);
      const key = await generateDerivedKey(this.#secret, salt);

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
      const salt = encrypted.slice(0, SALT_LENGTH);
      const iv = encrypted.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const key = await generateDerivedKey(this.#secret, salt);
      const decrypted = await window.crypto.subtle.decrypt(
         { name: ALGORITHM, iv },
         key,
         encrypted.slice(SALT_LENGTH + IV_LENGTH)
      );
      const result = util.arrayBufferToUtf8(decrypted);
      return result;
   };
}

// export const aesWebCrypto = {
//    encrypt,
//    decrypt,
// };

export default AesWebCrypto;

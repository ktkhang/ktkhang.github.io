import CryptoJS from 'crypto-js';

const SALT_LENGTH = 16;
const IV_LENGTH = 16;
const AES_KEY_SIZE = 256 / 32;

class AES {
   #salt = null;
   #iv = null;
   #key = null;
   #secret = null;
   constructor(secret) {
      this.#secret = secret;
      this.#salt = CryptoJS.lib.WordArray.random(SALT_LENGTH);
      this.#iv = CryptoJS.lib.WordArray.random(IV_LENGTH);
      this.#key = CryptoJS.PBKDF2(secret, this.#salt, {
         keySize: AES_KEY_SIZE,
         iterations: 10000,
         hasher: CryptoJS.algo.SHA256,
      });
   }

   encrypt = (message) => {
      const encrypted = CryptoJS.AES.encrypt(message, this.#key, {
         iv: this.#iv,
      }).ciphertext;
      const concatennedCipher = CryptoJS.lib.WordArray.create()
         .concat(this.#salt)
         .concat(this.#iv)
         .concat(encrypted);

      return concatennedCipher.toString(CryptoJS.enc.Base64);
   };

   decrypt = (cipherMessage) => {
      const encrypted = CryptoJS.enc.Base64.parse(cipherMessage);
      const salt = CryptoJS.lib.WordArray.create(encrypted.words.slice(0, SALT_LENGTH / 4));
      const iv = CryptoJS.lib.WordArray.create(
         encrypted.words.slice(0 + SALT_LENGTH / 4, (SALT_LENGTH + IV_LENGTH) / 4)
      );
      const key = CryptoJS.PBKDF2(this.#secret, salt, {
         keySize: AES_KEY_SIZE,
         iterations: 10000,
         hasher: CryptoJS.algo.SHA256,
      });
      const decrypted = CryptoJS.AES.decrypt(
         {
            ciphertext: CryptoJS.lib.WordArray.create(
               encrypted.words.slice((SALT_LENGTH + IV_LENGTH) / 4)
            ),
         },
         key,
         { iv: iv }
      );

      return decrypted.toString(CryptoJS.enc.Utf8);
   };
}

export default AES;

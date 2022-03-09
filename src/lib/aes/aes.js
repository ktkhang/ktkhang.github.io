import CryptoJS from 'crypto-js';
import scrypt from 'scrypt-js';
import util from '../../utils/util';

const SALT_SIZE = 128;
const IV_SIZE = 128;
// const AES_KEY_SIZE = 256;
// const KDF_ITERATIONS = 5000;
const N = 1024; // increases both memory usage and iterations - CPU/memory cost parameter
const r = 8; // increases memory usage.
const p = 1; // parallelization factor. Always set = 1
const dkLen = 32; // desired key length in bytes

class AES {
   #salt = null;
   #iv = null;
   #key = null;
   #secret = null;
   constructor(secret) {
      this.#secret = CryptoJS.enc.Base64.parse(secret);
      this.#salt = CryptoJS.lib.WordArray.random(SALT_SIZE / 8);
      this.#iv = CryptoJS.lib.WordArray.random(IV_SIZE / 8);
      // this.#key = CryptoJS.PBKDF2(secret, this.#salt, {
      //    keySize: AES_KEY_SIZE,
      //    iterations: KDF_ITERATIONS,
      //    hasher: CryptoJS.algo.SHA256,
      // });
      this.#key = CryptoJS.lib.WordArray.create(
         scrypt.syncScrypt(
            util.convertWordArrayToUint8Array(this.#secret),
            util.convertWordArrayToUint8Array(this.#salt),
            N,
            r,
            p,
            dkLen
         )
      );
   }

   encrypt = (value) => {
      const encrypted = CryptoJS.AES.encrypt(value, this.#key, {
         iv: this.#iv,
      }).ciphertext;
      const concatennedCipher = CryptoJS.lib.WordArray.create()
         .concat(this.#salt)
         .concat(this.#iv)
         .concat(encrypted);

      const encryptedValue = concatennedCipher.toString(CryptoJS.enc.Base64);

      return encryptedValue;
   };

   decrypt = (cipher) => {
      const encrypted = CryptoJS.enc.Base64.parse(cipher);
      const salt = CryptoJS.lib.WordArray.create(encrypted.words.slice(0, SALT_SIZE / 8 / 4));
      const iv = CryptoJS.lib.WordArray.create(
         encrypted.words.slice(0 + SALT_SIZE / 8 / 4, (SALT_SIZE / 8 + IV_SIZE / 8) / 4)
      );
      // const key = CryptoJS.PBKDF2(this.#secret, salt, {
      //    keySize: AES_KEY_SIZE,
      //    iterations: KDF_ITERATIONS,
      //    hasher: CryptoJS.algo.SHA256,
      // });
      const key = CryptoJS.lib.WordArray.create(
         scrypt.syncScrypt(
            util.convertWordArrayToUint8Array(this.#secret),
            util.convertWordArrayToUint8Array(salt),
            N,
            r,
            p,
            dkLen
         )
      );
      const decrypted = CryptoJS.AES.decrypt(
         {
            ciphertext: CryptoJS.lib.WordArray.create(
               encrypted.words.slice((SALT_SIZE / 8 + IV_SIZE / 8) / 4)
            ),
         },
         key,
         { iv }
      );
      return decrypted.toString(CryptoJS.enc.Utf8);
   };
}

export default AES;

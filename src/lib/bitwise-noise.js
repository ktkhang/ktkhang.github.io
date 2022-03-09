function encrypt(value, key) {
   let keyPointer = 0;
   let encrypted = [];
   for (let i = 0; i < value.length; i++) {
      encrypted.push(String.fromCharCode(value.charCodeAt(i) ^ key.charCodeAt(keyPointer)));
      keyPointer++;
      if (keyPointer > key.length - 1) {
         keyPointer = 0;
      }
   }
   return encrypted.join('');
}
function decrypt(encrypted, key) {
   let keyPointer = 0;
   let decrypted = [];
   for (let i = 0; i < encrypted.length; i++) {
      decrypted.push(String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(keyPointer)));

      keyPointer++;
      if (keyPointer > key.length - 1) {
         keyPointer = 0;
      }
   }
   return decrypted.join('');
}

const noise = {
   encrypt,
   decrypt,
};
export default noise;

import SHA256 from './sha256';

export const PBKDF2_HMAC_SHA256 = (password, salt, dkLen = 16) => {
   // compress password if it's longer than hash block length
   if (password.length > 64) {
      // SHA256 expects password to be an Array. If it's not
      // (i.e. it doesn't have .push method), convert it to one.
      password = SHA256(password.push ? password : Array.prototype.slice.call(password, 0));
   }
   let i,
      innerLen = 64 + salt.length + 4,
      inner = new Array(innerLen),
      outerKey = new Array(64),
      dk = [];

   // inner = (password ^ ipad) || salt || counter
   for (i = 0; i < 64; i++) inner[i] = 0x36;
   for (i = 0; i < password.length; i++) inner[i] ^= password[i];
   for (i = 0; i < salt.length; i++) inner[64 + i] = salt[i];
   for (i = innerLen - 4; i < innerLen; i++) inner[i] = 0;

   // outerKey = password ^ opad
   for (i = 0; i < 64; i++) outerKey[i] = 0x5c;
   for (i = 0; i < password.length; i++) outerKey[i] ^= password[i];

   // increments counter inside inner
   function incrementCounter() {
      for (let i = innerLen - 1; i >= innerLen - 4; i--) {
         inner[i]++;
         if (inner[i] <= 0xff) return;
         inner[i] = 0;
      }
   }

   // output blocks = SHA256(outerKey || SHA256(inner)) ...
   while (dkLen >= 32) {
      incrementCounter();
      dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))));
      dkLen -= 32;
   }
   if (dkLen > 0) {
      incrementCounter();
      dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))).slice(0, dkLen));
   }
   return new Uint8Array(dk);
};

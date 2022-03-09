/* eslint-disable no-undef */
const arrayBufferToBase64 = (buffer) => {
   let binary = '';
   let bytes = new Uint8Array(buffer);
   let len = bytes.byteLength;
   for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
   }
   return window.btoa(binary);
};

const base64ToArrayBuffer = (base64) => {
   let binaryStr = window.atob(base64);
   let len = binaryStr.length;
   let bytes = new Uint8Array(len);
   for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
   }
   return bytes.buffer;
};

const toString = (thing) => {
   if (typeof thing === 'string') {
      return thing;
   }
   return new dcodeIO.ByteBuffer.wrap(thing).toString('binary');
};

const toArrayBuffer = (thing) => {
   const StaticArrayBufferProto = new ArrayBuffer().__proto__;
   if (thing === undefined) {
      return undefined;
   }
   if (thing === Object(thing)) {
      if (thing.__proto__ === StaticArrayBufferProto) {
         return thing;
      }
   }

   if (typeof thing !== 'string') {
      throw new Error(
         'Tried to convert a non-string of type ' + typeof thing + ' to an array buffer'
      );
   }
   return new dcodeIO.ByteBuffer.wrap(thing, 'binary').toArrayBuffer();
};

const urlBase64ToUint8Array = (base64String) => {
   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
   const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

   const rawData = window.atob(base64);
   const outputArray = new Uint8Array(rawData.length);

   for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
   }
   return outputArray;
};

const convertWordArrayToUint8Array = (wordArray) => {
   let len = wordArray.words.length,
      u8_array = new Uint8Array(len << 2),
      offset = 0,
      word,
      i;
   for (i = 0; i < len; i++) {
      word = wordArray.words[i];
      u8_array[offset++] = word >> 24;
      u8_array[offset++] = (word >> 16) & 0xff;
      u8_array[offset++] = (word >> 8) & 0xff;
      u8_array[offset++] = word & 0xff;
   }
   return u8_array;
};
const convertUint8ArrayToWordArray = (u8Array) => {
   let words = [],
      i = 0,
      len = u8Array.length;

   while (i < len) {
      words.push((u8Array[i++] << 24) | (u8Array[i++] << 16) | (u8Array[i++] << 8) | u8Array[i++]);
   }

   return {
      sigBytes: words.length * 4,
      words: words,
   };
};

const stringToUint8Array = (str) => {
   const arr = new Uint8Array(str.length);
   for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i);
   }
   return arr;
};

const util = {
   arrayBufferToBase64,
   base64ToArrayBuffer,
   toString,
   toArrayBuffer,
   urlBase64ToUint8Array,
   convertWordArrayToUint8Array,
   convertUint8ArrayToWordArray,
   stringToUint8Array,
};

export default util;

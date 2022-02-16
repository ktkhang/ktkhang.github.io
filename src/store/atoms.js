import { atom } from 'recoil';

export const userInfoState = atom({
   key: 'userInfoState',
   default: null,
});

export const chatLogState = atom({
   key: 'chatLogState',
   default: [],
});

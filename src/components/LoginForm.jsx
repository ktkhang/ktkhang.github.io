import React, { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { userService } from '../services/userService';
import { userInfoState } from '../store/atoms';

const LoginForm = () => {
   const [name, setName] = useState('');
   const setUserInfo = useSetRecoilState(userInfoState);

   const login = useCallback(async () => {
      if (!name.trim()) return;
      const response = await userService.login({
         name,
      });
      if (response.errorCode === 0) {
         setUserInfo(response.data);
      } else {
         console.log(response.message);
      }
   }, [name, setUserInfo]);

   useEffect(() => {
      const keyDownEventHandler = async (event) => {
         if (event.key === 'Enter') {
            login();
         }
      };
      document.addEventListener('keydown', keyDownEventHandler);
      return () => {
         document.removeEventListener('keydown', keyDownEventHandler);
      };
   }, [login]);

   return (
      <div>
         <h3>Your name?</h3>
         <input value={name} onChange={(e) => setName(e.target.value)} required />
         <button onClick={login}>Submit</button>
      </div>
   );
};

export default LoginForm;

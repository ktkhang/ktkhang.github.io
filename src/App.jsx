import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import { userService } from './services/userService';
import { getDeviceId } from './utils/common';
import { useRecoilState } from 'recoil';
import { userInfoState } from './store/atoms';
import Main from './components/Main';
import localforage from 'localforage';
import './scss/styles.scss';
import { DEVICE_ID_VARIABLE } from './constants/variables';
import AESWrapper from './lib/aes/AESWrapper';

const App = () => {
   const [userInfo, setUserInfo] = useRecoilState(userInfoState);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const init = async () => {
         const deviceId = await getDeviceId();
         const response = await userService.getMe(deviceId);
         try {
            await localforage.setItem(DEVICE_ID_VARIABLE, deviceId);
         } catch {}
         if (response.errorCode === 0) {
            setUserInfo(response.data);
         }
         setLoading(false);
      };

      init();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   console.log(userInfo);
   return (
      <div className="App">
         {loading ? (
            <>Loading...</>
         ) : userInfo ? (
            <AESWrapper>
               <Main />
            </AESWrapper>
         ) : (
            <LoginForm />
         )}
      </div>
   );
};

export default App;

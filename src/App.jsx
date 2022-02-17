import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import { userService } from './services/userService';
import { getDeviceId } from './utils/common';
import { useRecoilState } from 'recoil';
import { userInfoState } from './store/atoms';
import Main from './components/Main';
import './scss/styles.scss';

const App = () => {
   const [userInfo, setUserInfo] = useRecoilState(userInfoState);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const init = async () => {
         const deviceId = await getDeviceId();
         const response = await userService.getMe(deviceId);
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
         {loading ? <>Loading...</> : userInfo ? <Main /> : <LoginForm />}
      </div>
   );
};

export default App;

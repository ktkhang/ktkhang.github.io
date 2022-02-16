import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import { userService } from './services/userService';
import { getDeviceId } from './utils/common';
import { useRecoilState } from 'recoil';
import { userInfoState } from './store/atoms';
import Main from './components/Main';
import './scss/styles.scss';

const App = () => {
   // useEffect(() => {
   //    const socket = new WebSocket(config.SOCKET_URL);
   //    socket.onopen = (event) => {
   //       const messageBody = { x: 100, y: 300 };
   //       socket.send(JSON.stringify(messageBody));
   //    };
   //    socket.onmessage = (message) => {
   //       const body = JSON.parse(message.data);
   //       console.log(body);
   //    };

   //    return () => socket.close();
   // }, []);
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

   return (
      <div className="App">
         {loading ? <>Loading...</> : userInfo ? <Main /> : <LoginForm />}
      </div>
   );
};

export default App;

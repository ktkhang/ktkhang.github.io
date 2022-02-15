import { useEffect } from 'react';
import './App.css';

window.WebSocket = window.WebSocket || window.MozWebSocket;
const wsPort = process.env.REACT_APP_WS_PORT || 8081;
const wsUrl = `ws://127.0.0.1:${wsPort}/ws`;

const App = () => {
   useEffect(() => {
      const ws = new WebSocket(wsUrl);
      ws.onopen = (event) => {
         const messageBody = { x: 100, y: 300 };
         ws.send(JSON.stringify(messageBody));
      };
      ws.onmessage = (message) => {
         const body = JSON.parse(message.data);
         console.log(body);
      };

      return () => ws.close();
   }, []);

   return (
      <div className="App">
         PWA Demo
         <button>Start</button>
      </div>
   );
};

export default App;

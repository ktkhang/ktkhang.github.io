import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';
import reportWebVitals from './reportWebVitals';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
   <React.StrictMode>
      <RecoilRoot>
         <App />
      </RecoilRoot>
   </React.StrictMode>,
   document.getElementById('root')
);

// serviceWorkerRegistration.register();

if ('serviceWorker' in navigator) {
   navigator.serviceWorker
      .register('./service-worker.js')
      .then((reg) => {
         if (reg.installing) {
            console.log('Service worker installing');
         } else if (reg.waiting) {
            console.log('Service worker installed');
         } else if (reg.active) {
            console.log('Service worker active');
         }
      })
      .catch((e) => {
         console.log('Registration failed with ' + e);
      });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

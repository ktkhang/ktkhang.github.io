import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export const WebSocketContext = React.createContext({
   reconnect: () => {},
   send: (type, payload) => {},
});

window.WebSocket = window.WebSocket || window.MozWebSocket;

class WebSocketProvider extends PureComponent {
   state = {
      ws: new window.WebSocket(this.props.url, this.props.protocol),
      attempts: 1,
   };
   shouldReconnect = true;

   componentDidMount() {
      this.setupWebsocket();
   }

   componentWillUnmount() {
      this.shouldReconnect = false;
      clearTimeout(this.reconnectTimeout);
      const { ws } = this.state;
      ws?.close();
   }

   generateInterval(k) {
      return Math.min(30, Math.pow(2, k) - 1) * 1000;
   }

   setupWebsocket = () => {
      clearTimeout(this.reconnectTimeout);
      const { onOpen, onClose, onError, onMessage } = this.props;
      const { ws, attempts } = this.state;
      if (!ws) return;

      ws.onopen = () => {
         console.log('Websocket connected');
         onOpen && onOpen(ws);
      };

      ws.onerror = (e) => {
         onError && onError(e);
      };

      ws.onmessage = (e) => {
         onMessage && onMessage(JSON.parse(e.data));
      };

      ws.onclose = (e) => {
         console.log(`Websocket disconnected. Reason: ${e.reason}. Code: ${e.code}`);
         onClose && onClose(e);
         if (this.shouldReconnect) {
            let time = this.generateInterval(attempts);
            this.reconnectTimeout = setTimeout(this.reconnect, time);
         }
      };
   };

   reconnect = () => {
      this.setState(
         (prevState) => ({
            ws: new window.WebSocket(this.props.url, this.props.protocol),
            attempts: prevState.attempts + 1,
         }),
         this.setupWebsocket
      );
   };

   send = (type, payload) => {
      const { ws } = this.state;
      ws?.send(
         JSON.stringify({
            type,
            payload,
         })
      );
   };

   render() {
      return (
         <WebSocketContext.Provider
            value={{
               reconnect: this.reconnect,
               send: this.send,
            }}
         >
            {this.props.children}
         </WebSocketContext.Provider>
      );
   }
}

WebSocketProvider.propTypes = {
   url: PropTypes.string.isRequired,
   onMessage: PropTypes.func.isRequired,
   onOpen: PropTypes.func,
   onClose: PropTypes.func,
   onError: PropTypes.func,
   protocol: PropTypes.string,
};

export default WebSocketProvider;

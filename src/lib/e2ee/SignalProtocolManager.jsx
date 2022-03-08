import React, { PureComponent } from 'react';
import { getSavedDeviceId } from '../../utils/common';
import { createSignalProtocol } from './signal-protocol';

const SignalProtocolContext = React.createContext({});

const withSignalProtocolManager = () => (WrappedComponent) => {
   return class SignalProtocolManagerHOC extends PureComponent {
      state = {
         deviceId: getSavedDeviceId(),
         signalProtocol: null,
      };

      componentDidMount() {
         // this._initializeSignalProtocol();
      }

      _initializeSignalProtocol = async () => {
         const signalServerStore = {
            registerNewPreKeyBundle: this._registerNewPreKeyBundle,
            getPreKeyBundle: this._getPreKeyBundle,
         };
         const signalProtocol = await createSignalProtocol(this.state.deviceId, signalServerStore);
         console.log(signalProtocol);
         this.setState({ signalProtocol });
      };

      _registerNewPreKeyBundle = () => {};

      _getPreKeyBundle = () => {};

      render() {
         return (
            <SignalProtocolContext.Provider
               value={{
                  signalProtocol: this.state.signalProtocol,
               }}
            >
               <WrappedComponent {...this.props} />
            </SignalProtocolContext.Provider>
         );
      }
   };
};

export default withSignalProtocolManager;

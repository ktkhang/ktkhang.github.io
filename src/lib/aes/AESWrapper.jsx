import React, { useState, useEffect, useContext, memo } from 'react';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store/atoms';
import AES from './aes';

const AESContext = React.createContext({
   AES: {
      encrypt: () => {},
      decrypt: () => {},
   },
});

const AESWrapper = memo((props) => {
   const { encryptionKey } = useRecoilValue(userInfoState) || {};
   const [AESEncryption, setAESEncryption] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      setAESEncryption(new AES(encryptionKey));
      setLoading(false);
   }, [encryptionKey]);

   return (
      <AESContext.Provider
         value={{
            AES: AESEncryption,
         }}
      >
         {!loading && props.children}
      </AESContext.Provider>
   );
});

export const useAES = () => {
   const { AES } = useContext(AESContext);

   return {
      encrypt: AES?.encrypt,
      decrypt: AES?.decrypt,
   };
};

export default AESWrapper;

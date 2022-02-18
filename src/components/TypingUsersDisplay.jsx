import React, { memo, useRef, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { typingUsersState } from '../store/atoms';
import { getSavedDeviceId } from '../utils/common';

const TypingUsersDisplay = memo(() => {
   const typingUsers = useRecoilValue(typingUsersState);
   const deviceId = getSavedDeviceId();
   const contentRef = useRef();

   const displayText = (() => {
      const typingUsersObj = { ...typingUsers };
      delete typingUsersObj[deviceId];
      const displayUsers = Object.values(typingUsersObj);

      if (displayUsers.length === 0) return '';
      const userNames = displayUsers.map((name) => name);
      if (userNames.length > 2) {
         return `${userNames.slice(0, 1).join(', ')} and ${
            userNames.length - 1
         } others are typing...`;
      }
      return `${userNames.join(', ')} ${userNames.length > 1 ? 'are' : 'is'} typing...`;
   })();

   const hasTypingTextDisplay = displayText !== '';

   useEffect(() => {
      if (hasTypingTextDisplay) {
         if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth' });
         }
      }
   }, [hasTypingTextDisplay]);

   if (!displayText) return null;
   return (
      <div className="main__messages--typing" ref={contentRef}>
         {displayText}
      </div>
   );
});

export default TypingUsersDisplay;

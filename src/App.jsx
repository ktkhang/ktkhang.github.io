import { useCallback, useEffect, useRef, useState } from 'react';
import PiceIcon from './pice-icon';

const pickRandom = (list) => {
	if (!list.length) return void 0;
	return list[Math.floor(Math.random() * list.length)];
};

const randomInRange = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

const pickEmoji = () => {
   return pickRandom([
      '21',
      '09',
      '🎂',
      '🎁',
      '🎉',
      '👱‍♀️',
      '🌟',
      // '🍷',
      // '🔔',
   ]);
}

const maxX = 30;
const maxY = 35;

const App = () => {
   const [randCount, setRandCount] = useState(0);
   const tempRef = useRef({
      disabled: true,
   });

   useEffect(() => {
      const baubles = document.querySelectorAll('li');
      drawTree(baubles);
      const auto = () => {
         requestAnimationFrame(() => {
            baubles[randomInRange(0, baubles.length -1)].textContent = pickEmoji();
            setTimeout(() => {
               auto();
            }, 500);
         });
      };

      Array.from({length: 5}).forEach((_) => {
         auto();
      })
   }, []);

   const drawTree = useCallback((_baubles) => {
      const baubles = document.querySelectorAll('li');
      const baublesLength = baubles.length;

      baubles.forEach((bauble, i) => {
         requestAnimationFrame(() => {
            const y = Math.pow(i / baublesLength, 0.5) * maxY * 2 - maxY;
            const x =
               Math.pow((maxX * i) / baublesLength, 0.5) *
               5.5 *
               Math.random() *
               (i % 2 === 0 ? 1 : -1);
            const r = Math.random();
            const n = Math.random();

            bauble.style.setProperty('--x', `${x}vmin`);
            bauble.style.setProperty('--y', `${y}vmin`);
            bauble.style.setProperty('--r', `${r}turn`);
            bauble.style.setProperty('--sign', n > 0.5 ? -1 : 1);
            bauble.style.setProperty('--s', Math.random() * 0.875 + 0.125);
            bauble.style.setProperty('--hue', Math.random() * 360);

            bauble.textContent = pickEmoji();
            
            if (i % 2 === 0) {
               bauble.animate(
                  { opacity: [1, 1, 0] },
                  {
                     duration: 2000 + Math.random() * 3000,
                     iterations: Infinity,
                     direction: 'alternate',
                     delay: Math.random() * -16000,
                     easing: 'ease-in',
                  }
               );
            }
            const animation = bauble.animate(
               { transform: ['rotateX(1turn) rotateY(2turn)'] },
               {
                  duration: 7000 + Math.random() * 13000,
                  iterations: Infinity,
                  direction: 'alternate',
                  delay: Math.random() * -16000,
                  easing: 'ease-in',
                  composite: 'add',
               }
            );
            if (i % 2 === 1 || !window.matchMedia?.('(prefers-reduced-motion: no-preference)')) {
               animation.pause();
            }
         });
      });
      setTimeout(() => {
         tempRef.current.disabled = false;
      }, 1000);
   }, [])

   const redraw = () => {
      if(tempRef.current.disabled) return;
      tempRef.current.disabled = true;

      setRandCount((v) => {
         setRandCount(v+1);
      });
      const baubles = document.querySelectorAll('li');
      baubles.forEach((b) => {
         requestAnimationFrame(() => {
            b.textContent = pickEmoji();
         });
      });
      setTimeout(() => {
         tempRef.current.disabled = false;
      }, 1000);
   }

   return (
      <>
         <div className='title'>
            <h1>'Happy Birthday Minh Anh 👌 - from Khang Lê hehe'
            {/* {
               !!(randCount % 2 === 0) ? 'Happy Birthday MINH ANH 👌':
               'from Khang Lê he he'
            } */}
               </h1>
         </div>
         <div className='text-box'>
            <button className="btn btn-white btn-animate" onClick={() => redraw()}>
               <PiceIcon/>
            </button>
         </div>
         <aside>
            <div></div>
         </aside>
         <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
         </ul>
      </>
   );
};

export default App;

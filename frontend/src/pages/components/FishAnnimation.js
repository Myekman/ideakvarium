import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const FishAnimated = ({ children, style: additionalStyle, delay }) => {
    const [style, api] = useSpring(() => ({
        from: {
          x: -100, // Starta utanför skärmen till vänster
          y: Math.random() * window.innerHeight,
        },
        to: {
          x: window.innerWidth + 100, // Slutposition utanför skärmen till höger
        },
        config: {
          duration: 20000, // Animationens varaktighet på 20 sekunder
        },
        delay: delay, // Startfördröjning för varje fisk
      }));

  useEffect(() => {
    const moveFish = () => {
      api.start({
        x: window.innerWidth + 100, // Slutposition utanför skärmen till höger
        y: Math.random() * window.innerHeight,
        onRest: () => {
          // När animationen är klar, börja om från vänster
          api.start({
            from: {
              x: -100,
              y: Math.random() * window.innerHeight,
            }
          });
        },
      });
    };

    // Starta den första animationen direkt
    moveFish();

    // Du behöver inte längre ett interval här eftersom onRest tar hand om loopningen
  }, [api]);

  return (
    <animated.div style={{ ...style, ...additionalStyle }}>
      {children}
    </animated.div>
  );
};

export default FishAnimated;
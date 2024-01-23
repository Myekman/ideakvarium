import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const FishAnimated = ({ children, style: additionalStyle }) => {
  const style = useSpring({
    from: { x: 0, y: 0 },
    to: async (next) => {
      // Loopa oändligt för att skapa en simmande rörelse
      while (1) {
        await next({ x: Math.random() * 500, y: Math.random() * 500 });
      }
    },
    config: { mass: 5, tension: 350, friction: 40 },
    loop: true
  });

  return (
    <animated.div style={{ ...style, ...additionalStyle }}>
      {children}
    </animated.div>
  );
};

export default FishAnimated;
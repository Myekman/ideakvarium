import React from 'react';
import { useSpring, animated } from '@react-spring/web';

import bubbelImage from '../../assets/images/bubblablå.png';


const getRandomSize = () => Math.random() * (60 - 10) + 10;

const BubbleAnimated = ({ index }) => {
    // const bubbelSize = 50; // Bredden på bubblan
    const bubbelSize = getRandomSize();
    const getRandomXPosition = () => Math.random() * (window.innerWidth - bubbelSize);
  
    const [style, api] = useSpring(() => ({
      from: {
        x: getRandomXPosition(), // Slumpmässig startposition i x-led
        y: window.innerHeight + bubbelSize, // Starta utanför skärmen nedtill
      },
      to: {
        y: -bubbelSize, // Flytta bubblan uppåt tills den är utanför skärmen
      },
      config: {
        duration: 20000, // Varaktighet för att bubblan ska nå toppen
      },
      delay: index * 600, // Förskjutning baserat på index för att bubblorna ska starta vid olika tillfällen
      onRest: () => {
        // Återställ animationen när den är färdig
        api.start({
          from: { x: getRandomXPosition(), y: window.innerHeight + bubbelSize },
          to: { y: -bubbelSize },
          config: { duration: 15000 },
          delay: index * 600,
        });
      },
    }));
  
    return (
      <animated.div
        style={{
          ...style,
          position: 'absolute',
          width: `${bubbelSize}px`,
          height: `${bubbelSize}px`,
          backgroundImage: `url(${bubbelImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          // Lägg till andra stilar du vill ha för din bubbla
        }}
      />
    );
  };
  
const Bubbles = ({ count = 20 }) => {
    return (
        <>
        {Array.from({ length: count }).map((_, index) => (
            <BubbleAnimated key={index} index={index} />
        ))}
        </>
    );
    };

export default Bubbles;
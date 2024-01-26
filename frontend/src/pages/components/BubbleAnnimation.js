import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const BubbleAnimated = ({ index }) => {
    const bubbleWidth = 20; // Bredden på bubblan
  
    // Initiera en slumpmässig x-position inom tillåtna värden
    const getRandomXPosition = () => Math.random() * (window.innerWidth - bubbleWidth);
  
    const [style, api] = useSpring(() => ({
      from: {
        x: getRandomXPosition(), // Slumpmässig startposition i x-led
        y: window.innerHeight + bubbleWidth, // Starta utanför skärmen nedtill
      },
      to: {
        y: -bubbleWidth, // Flytta bubblan uppåt tills den är utanför skärmen
      },
      config: {
        duration: 15000, // Varaktighet för att bubblan ska nå toppen
      },
      delay: index * 2000, // Förskjutning baserat på index för att bubblorna ska starta vid olika tillfällen
      onRest: () => {
        // Återställ animationen när den är färdig
        api.start({
          from: { x: getRandomXPosition(), y: window.innerHeight + bubbleWidth },
          to: { y: -bubbleWidth },
          config: { duration: 15000 },
          delay: 0, // Du kan välja att inte ha någon fördröjning efter återställningen om du vill
        });
      },
    }));
  
    return (
      <animated.div
        style={{
          ...style,
          position: 'absolute',
          width: `${bubbleWidth}px`,
          height: `${bubbleWidth}px`,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
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
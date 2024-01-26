import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const FishAnimated = ({ children, style: additionalStyle, index }) => {
    // Beräkna en unik vertikal position och tidsförskjutning för varje fisk
    const fishWidth = 600;
     // Initiera en slumpmässig y-position inom tillåtna värden
    const getRandomYPosition = () => Math.random() * (window.innerHeight - fishWidth);

  
    const [style, api] = useSpring(() => ({
      from: {
        x: -300, // Starta utanför skärmen till vänster
        y: getRandomYPosition(), // Slumpmässig startposition i y-led
      },
      to: {
        x: window.innerWidth, // Simma till höger kant av skärmen
      },
      config: {
        duration: 20000,
      },
      delay: index * 4000, // Förskjutning baserat på index för att fiskarna ska starta vid olika tillfällen
      onRest: () => {
        // Återställ fisken till vänster sida när den når höger sida
        api.start({
          from: { x: -fishWidth, y: getRandomYPosition() },
          to: { x: window.innerWidth },
          config: { duration: 20000 },
          delay: 0, // Du kan lägga till en fördröjning här om du vill
        });
      },
    }));

     // Tillämpa additionalStyle för att positionera fiskarna inom appContainer
    const combinedStyle = {
        ...style,
        ...additionalStyle,
        position: 'absolute', // Lägg till denna för absolut positionering inom appContainer
    };
  
    return (
      <animated.div style={combinedStyle}>
        {children}
      </animated.div>
    );
  };

export default FishAnimated;
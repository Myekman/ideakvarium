import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const FishAnimated = ({ children, style: additionalStyle, index }) => {
    // Beräkna en unik vertikal position och tidsförskjutning för varje fisk
    // const fishHeight = 600;
     // Initiera en slumpmässig y-position inom tillåtna värden
    // const getRandomYPosition = () => Math.random() * (window.innerHeight - fishHeight);

  
    const [style] = useSpring(() => ({
      from: {
        x: -300, // Starta utanför skärmen till vänster
        // y: getRandomYPosition(), // Slumpmässig startposition i y-led
      },
      to: async (next) => {
        // Använd en loop för att skapa oändlig animation
        while (1) {
            await next({ x: window.innerWidth + 100 }); // Simma till höger kant
            // await next({ x: -300, y: getRandomYPosition() }); // Återvänd till start och ändra y-position
        }
      },
      config: {
        duration: 20000,
      },
      delay: index * 4000, // Förskjutning baserat på index för att fiskarna ska starta vid olika tillfällen
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
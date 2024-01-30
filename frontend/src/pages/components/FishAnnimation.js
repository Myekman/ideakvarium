import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const FishAnimated = ({ children, style: additionalStyle, index, isPaused, setIsPaused }) => {
    // Beräkna en unik vertikal position och tidsförskjutning för varje fisk
    const fishWidth = 600;
    // const [isPaused, setIsPaused] = useState(false);
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
        if (!isPaused) {
             // Återställ fisken till vänster sida när den når höger sida
             api.start({
              from: { x: -fishWidth, y: getRandomYPosition() },
              to: { x: window.innerWidth },
              config: { duration: 20000 },
              delay: 0, // Du kan lägga till en fördröjning här om du vill
            });
          }
        },
    }));


     // Tillämpa additionalStyle för att positionera fiskarna inom appContainer
    const combinedStyle = {
        ...style,
        ...additionalStyle,
        position: 'absolute', 
    };

    // const togglePause = () => {
    //   console.log('Before toggling, isPaused is:', isPaused)
    //   setIsPaused(!isPaused); // Växla isPaused state när användaren klickar på fisken
    //   console.log('After toggling, isPaused will be set to:', !isPaused);

    //   if (!isPaused) {
    //       // Om animationen var pausad, återuppta den
    //       api.pause();
    //   } else {
    //       // Annars, vänta 5 sekunder och återuppta animationen om ingen har klickat igen
    //       setTimeout(() => {
    //         if (isPaused) {
    //             setIsPaused(false);
    //             api.resume();
    //         }
    //     }, 2000); 
    //       // Annars, pausa animationen
    //       // api.pause();
    //   }
    // };

      // Använd det mottagna isPaused-tillståndet för att kontrollera animationen
    const togglePause = () => {
      setIsPaused(!isPaused); // Använd setIsPaused från props för att uppdatera tillståndet i Fishtank
      if (isPaused) {
        api.resume();
      } else {
        api.pause();
      }
    };
  
    return (
      <animated.div style={combinedStyle} onClick={togglePause}>
        {children}
      </animated.div>
    );
  };

export default FishAnimated;
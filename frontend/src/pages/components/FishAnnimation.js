import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const FishAnimated = ({ 
  children, 
  style: additionalStyle, 
  index, 
  isPaused,
  isActive,
  setIsPaused, 
  setActiveFishId, 
  fishId,
  onFishClick }) => {
    // Beräkna en unik vertikal position och tidsförskjutning för varje fisk
    const getRandomYPosition = () => Math.random() * (window.innerHeight - 200) -210; // minskar fiskarnas simutrymma med 200 px uppifrån och 80 px från botten

    // Randomize the duration to have a greater range of speeds
    const minDuration = 10000; // 15 seconds for faster fishes
    const maxDuration = 40000; // 40 seconds for slower fishes
    const getRandomDuration = () => Math.random() * (maxDuration - minDuration) + minDuration;
  
    const [style, api] = useSpring(() => ({
      from: {
        x: -300, // Starta utanför skärmen till vänster
        y: getRandomYPosition(), // Slumpmässig startposition i y-led
      },
      to: {
        x: window.innerWidth, // Simma till höger kant av skärmen
      },
      config: {
        duration: getRandomDuration(),
      },
      delay: index * 4000, // Fördröjning mellan fiskar
      // onRest: () => {
      //   if (!isPaused) {
      //        api.start({
      //         from: { x: -300, y: getRandomYPosition() },
      //         to: { x: window.innerWidth },
      //         config: {  duration: getRandomDuration() },
      //         delay: index * 4000, // Fördröjning mellan fiskar
      //       });
      //     }
      //   },
      //   paused: isPaused,
    }));

    useEffect(() => {
      console.log('paused' + isPaused);
      console.log('active' + isActive);
    }, [isPaused, isActive])

    // -------------------------------------------hanterar pausning av fiskar
    useEffect(() => {
      if (isPaused) {
        api.pause();
      } else {
        api.resume();
      }
    }, [isPaused, api]);


    useEffect(() => {
      if (isActive) {
        const centerY = window.innerHeight / 2;
        console.log(`Moving fish to centerY: ${centerY}`);
        
        // Sätt fisken till mitten och pausa animationen
        api.start({
          y: centerY,
          immediate: true, // Hoppa till den nya positionen omedelbart
          // onRest: () => {
          //   // När fisken har nått mitten, pausa animationen
          //   api.pause();
          // },
        });
      } else {
        // Om fisken inte är aktiv, fortsätt animationen
        api.resume();
      }
    }, [api, isActive]);



     // Tillämpa additionalStyle för att positionera fiskarna inom appContainer
    const combinedStyle = {
        ...style,
        ...additionalStyle,
        position: 'absolute', 
    };


// id i return används för att hantera y position för fisk onclick (i handlefishclick fishtank)
    return (
      <animated.div style={combinedStyle} id={`fish-${fishId}`} onClick={onFishClick}> 
        {children}
      </animated.div>
    );
  };

export default FishAnimated;
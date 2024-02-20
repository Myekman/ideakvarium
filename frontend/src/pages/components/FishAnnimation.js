import React, { useCallback, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const FishAnimated = ({ 
  children, 
  // style: additionalStyle, 
  index, 
  isPaused,
  isActive,
  setIsPaused, 
  setActiveFishId,
  fishId,
  onFishClick }) => {
    // Beräkna en unik vertikal position och tidsförskjutning för varje fisk
    // const getRandomYPosition = () => Math.random() * (window.innerHeight - 150) -300; // minskar fiskarnas simutrymma med 200 px uppifrån och 80 px från botten

    // Randomize the duration to have a greater range of speeds
    const minDuration = 20000; // 15 seconds for faster fishes
    const maxDuration = 40000; // 40 seconds for slower fishes
    const getRandomDuration = () => Math.random() * (maxDuration - minDuration) + minDuration;


    const getRandomYPosition = useCallback(() => {

      const minY = 80;
      const maxY = window.innerHeight - 500; 
      return Math.random() * (maxY - minY) + minY;
    }, []); // Inga beroenden, så funktionen skapas inte om vid varje render


    const getCenterYPosition = () => window.innerHeight / 2;
    console.log(getCenterYPosition());


    // onRest inuti useSpring
    const onRestCallback = () => {
      console.log('Animation completed, resetting position...');
      if (!isPaused && !isActive) {
        apiX.start({
          from: { x: -300, y: getRandomYPosition() },
          to: { x: window.innerWidth },
          config: { duration: getRandomDuration() },
          delay: index * 4000, // Fördröjning mellan fiskar
        });
      }
    };

    const [styleX, apiX] = useSpring(() => ({
      from: { x: -300, y: getRandomYPosition() },
      to: { x: window.innerWidth },
      config: { duration: getRandomDuration() },
      delay:  index * 4000,
      onRest: onRestCallback,
      paused: isPaused,
    }));


    const [styleY, apiY] = useSpring(() => ({
      from: { y: getCenterYPosition() },
      // Du behöver inte en 'to' här eftersom du kommer att hantera Y-positionen dynamiskt
      config: { duration: getRandomDuration() },
    }));


    // Hantera pausning och återupptagande av animationen
    useEffect(() => {
      console.log(`isPaused useEffect triggered: ${isPaused}`);
      if (isPaused) {
        apiX.pause();
      } else {
        apiX.resume();
      }
    }, [isPaused, apiX]);

    // Hantera positionen när fisken är aktiv och pausad
    useEffect(() => {
      console.log(`isActive: ${isActive}`);
      if (isActive) {
        apiY.start({
          y: 100, 
          immediate: true, // immediate för att hoppa till positionen utan animation
        });
      } else if (!isActive) {
        // När fisken inte längre är aktiv, återställ y-positionen till en slumpmässig position
        apiY.start({
          y: getRandomYPosition(),
          immediate: true,
        });
        apiX.resume();
        console.log(`random Y: ${getRandomYPosition()}`);
      }
      // Inget behov av att hantera återupptagning här eftersom det hanteras i den första useEffect ovan
    }, [isActive, apiY, apiX, getRandomYPosition]);


     // Tillämpa additionalStyle för att positionera fiskarna inom appContainer
    const combinedStyle = {
        ...styleX,
        ...styleY,
        // ...additionalStyle,
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
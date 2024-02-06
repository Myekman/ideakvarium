import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const FishAnimated = ({ 
  children, 
  // style: additionalStyle, 
  index, 
  isPaused,
  isActive,
  setIsPaused, 
  setActiveFishId,
  isSearchingOrFiltering,
  fishId,
  onFishClick }) => {
    // Beräkna en unik vertikal position och tidsförskjutning för varje fisk
    const getRandomYPosition = () => Math.random() * (window.innerHeight - 200) -200; // minskar fiskarnas simutrymma med 200 px uppifrån och 80 px från botten

    // Randomize the duration to have a greater range of speeds
    const minDuration = 10000; // 15 seconds for faster fishes
    const maxDuration = 40000; // 40 seconds for slower fishes
    const getRandomDuration = () => Math.random() * (maxDuration - minDuration) + minDuration;
    const getCenterYPosition = () => window.innerHeight / 2;
    // Sätt fördröjning till 0 för första fisken om en sökning/filtrering pågår,
    // annars använd index * 4000 för att ge en fördröjning mellan fiskarna
    const delay = isSearchingOrFiltering && index === 0 ? 0 : index * 4000;

    // onRest inuti useSpring
    const onRestCallback = () => {
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
      delay: delay,
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
          y: 300,
          immediate: true, // Använd immediate för att hoppa till positionen utan animation
        });
      } else if (!isActive) {
        // När fisken inte längre är aktiv, återställ y-positionen till en slumpmässig position
        // apiY.start({
        //   y: getRandomYPosition(),
        //   immediate: true,
        apiX.resume();
        // });
        console.log(`random Y: ${getRandomYPosition()}`);
      }
      // Inget behov av att hantera återupptagning här eftersom det hanteras i den första useEffect ovan
    }, [isActive, apiY, apiX]);


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
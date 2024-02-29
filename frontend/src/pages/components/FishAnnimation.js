import React, { useCallback, useEffect} from 'react';
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

    // Randomize the duration to have a greater range of speeds
    const minDuration = 20000; // 15 seconds for faster fishes
    const maxDuration = 40000; // 40 seconds for slower fishes
    const getRandomDuration = () => Math.random() * (maxDuration - minDuration) + minDuration;


    // ge fiskarna en slumpmässig y-position vid start och efter att de har varit aktiva
    const getRandomYPosition = useCallback(() => {

      const minY = 80;
      const maxY = window.innerHeight - 500; 
      return Math.random() * (maxY - minY) + minY;
    }, []); // Inga beroenden, så funktionen skapas inte om vid varje render

    // centrera fiskarna i y-led när de är aktiva och pausade.
    const getCenterYPosition = () => window.innerHeight / 2;
    console.log(getCenterYPosition());


    // onRest inuti useSpring
    const onRestCallback = () => {
      console.log('Animation completed, resetting position...');
      if (!isPaused && !isActive) {
        apiX.start({
          from: { x: -200, y: getRandomYPosition() },
          to: { x: window.innerWidth },
          config: { duration: getRandomDuration() },
          delay: index * 4000,
        });
      }
    };

    const [styleX, apiX] = useSpring(() => ({
      from: { x: -200, y: getRandomYPosition() },
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

    const [activePausedStyle, activePausedApi] = useSpring(() => ({
      from: { x: -200 }, // Startar från vänsterkanten
      immediate: false
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
          y: 10, 
          immediate: true, // immediate för att hoppa till positionen utan animation
        });
      activePausedApi.start({ x: window.innerWidth / 2 - 210, immediate: true }); // bestämmer x position när pausad
      } else if (!isActive) {
        apiY.start({
          y: getRandomYPosition(),
          immediate: true,
        });
        apiX.resume();
        console.log(`random Y: ${getRandomYPosition()}`);
      }
    }, [isActive, apiY, apiX, getRandomYPosition, activePausedApi]);


    const combinedStyle = isActive && isPaused
    ? { ...styleY, ...activePausedStyle, position: 'absolute' }
    : { ...styleX, ...styleY, position: 'absolute' };


// id i return används för att hantera y position för fisk onclick (i handlefishclick fishtank)
    return (
      <animated.div style={combinedStyle} id={`fish-${fishId}`} onClick={onFishClick}> 
        {children}
      </animated.div>
    );
  };

export default FishAnimated;
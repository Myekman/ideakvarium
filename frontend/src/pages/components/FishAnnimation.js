import React, { useCallback, useEffect, useState} from 'react';
import { useSpring, animated } from '@react-spring/web';

const FishAnimated = ({ 
  children, 
  // style: additionalStyle, 
  index,
  isPaused,
  isActive,
  handleAnimationComplete,
  setDisplayedFishes,
  fishes,
  fishnumber,
  setIsPaused, 
  setActiveFishId,
  fishId,
  onFishClick }) => {

    // Random hastighet för fiskarna
    // const minDuration = 20000; // 20 sekunder
    // const maxDuration = 40000; // 40 sekunder
    // const getRandomDuration = () => Math.random() * (maxDuration - minDuration) + minDuration;


      // Funktion för att anpassa hastigheten baserat på skärmstorlek
    const getRandomDuration = useCallback(() => {
      const screenWidth = window.innerWidth;
      const isMobileScreen = screenWidth < 768; // Antag att skärmar mindre än 768px är mobila

      // Bestäm minsta och högsta varaktighet baserat på skärmstorlek
      const minDuration = isMobileScreen ? 10000 : 20000; // 10 sekunder för snabbare fiskar på mobil
      const maxDuration = isMobileScreen ? 20000 : 40000; // 20 sekunder för långsammare fiskar på mobil

      // Returnera en slumpmässig varaktighet inom det angivna intervallet
      return Math.random() * (maxDuration - minDuration) + minDuration;
    }, []);


    // ge fiskarna en slumpmässig y-position vid start och efter att de har varit aktiva
    const getRandomYPosition = useCallback(() => {

      const minY = 80;
      const maxY = window.innerHeight - 500; 
      return Math.random() * (maxY - minY) + minY;
    }, []); // Inga beroenden, så funktionen skapas inte om vid varje render

    // centrera fiskarna i y-led när de är aktiva och pausade.
    const getCenterYPosition = () => window.innerHeight / 2;
    console.log(getCenterYPosition());

    const [completedAnimations, setCompletedAnimations] = useState(0);
    const [isRestarting, setIsRestarting] = useState(false);

   
    // const onRestCallback = () => {
    //   console.log('Animation completed, resetting position...');
    //   console.log(`onRestCallback: FishID is ${fishId}, isPaused: ${isPaused}, isActive: ${isActive}`);
    //   if (!isPaused && !isActive) {
    //     console.log(`Starting new animation for FishID ${fishId}`);
    
    //     apiX.start({
    //       from: { x: -200, y: getRandomYPosition() },
    //       to: { x: window.innerWidth },
    //       config: { duration: getRandomDuration() },
    //       // delay: index * 3000,
    //     });
    //   }
    // };

    const onRestCallback = () => {
      console.log('Animation completed, resetting position...');
      console.log(`onRestCallback: FishID is ${fishId}, isPaused: ${isPaused}, isActive: ${isActive}`);
      
      if (!isPaused && !isActive) {
        console.log(`Starting new animation for FishID ${fishId}`);
        
        // Öka antalet färdiga animationer
        setCompletedAnimations(prev => prev + 1);

        // Kontrollera om vi har nått antalet fiskar vi vill visa
        if (completedAnimations + 1 >= fishnumber) {
          // Återställ completedAnimations och starta om från början av listan
          setCompletedAnimations(0);
          setIsRestarting(true); 
          setDisplayedFishes(fishes.slice(0, fishnumber));
          
          // Starta om animationen från början för varje fisk
          apiX.start({
            from: { x: 1400, y: getRandomYPosition() },
            to: { x: window.innerWidth },
            config: { duration: getRandomDuration() },
            onRest: onRestCallback,
          }).then(() => {
            setIsRestarting(false);
          });
        } else {
          // Byt ut fiskarna i FishList som tidigare
          setDisplayedFishes(prevDisplayedFishes => {
            setIsRestarting(true);
            const startIndex = (fishes.indexOf(prevDisplayedFishes[0]) + 1) % fishes.length;
            return fishes.slice(startIndex, startIndex + fishnumber);
          });
        }
      }
    };


    const [styleX, apiX] = useSpring(() => ({
      from: { x: -200, y: getRandomYPosition() },
      to: { x: window.innerWidth },
      config: { duration: getRandomDuration() },
      delay:  isRestarting ? 0 : index * 3000,
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
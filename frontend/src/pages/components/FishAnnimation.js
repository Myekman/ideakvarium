import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const FishAnimated = ({ children, style: additionalStyle, index, isPaused, setIsPaused, setActiveFishId, fishId }) => {
    // Beräkna en unik vertikal position och tidsförskjutning för varje fisk
    const fishWidth = 600;
    const getRandomYPosition = () => Math.random() * (window.innerHeight - fishWidth);

    // Randomize the duration to have a greater range of speeds
    const minDuration = 10000; // 10 seconds for faster fishes
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
      delay: index * 4000, // Förskjutning baserat på index för att fiskarna ska starta vid olika tillfällen
      onRest: () => {
        if (!isPaused) {
             // Återställ fisken till vänster sida när den når höger sida
             api.start({
              from: { x: -fishWidth, y: getRandomYPosition() },
              to: { x: window.innerWidth },
              config: {  duration: getRandomDuration() },
              delay: 0, // Du kan lägga till en fördröjning här om du vill
            });
          }
        },
        paused: isPaused,
    }));


     // Tillämpa additionalStyle för att positionera fiskarna inom appContainer
    const combinedStyle = {
        ...style,
        ...additionalStyle,
        position: 'absolute', 
    };

    // Använd det mottagna isPaused-tillståndet för att kontrollera animationen
    const togglePauseAndSetActiveFish = () => {
      setIsPaused(!isPaused); // Använd setIsPaused från props för att uppdatera tillståndet i Fishtank
      if (isPaused) {
        api.resume();
      } else {
        api.pause();
      }
      // Växla den aktiva fisken baserat på om det är samma fisk som redan är aktiv
      setActiveFishId(prevActiveFishId => prevActiveFishId === fishId ? null : fishId);
    };



    return (
      <animated.div style={combinedStyle} onClick={togglePauseAndSetActiveFish}>
        {children}
      </animated.div>
    );
  };

export default FishAnimated;
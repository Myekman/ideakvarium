import React, { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
import axiosReq from './components/axiosReq';

import ClownfiskImage from '../assets/images/clownfisk.png';
import SvärdfiskImage from '../assets/images/svärdfisk2.png';
import BlåsfiskImage from '../assets/images/blåsfisk.png';
import BläckfiskImage from '../assets/images/bläckfisk.png';
import fishstyles from '../styles/Fish.module.css';
import { Button, Container} from 'react-bootstrap';

import { useUser } from './auth/UserContext';
// import axios from 'axios';

// Fish.js
function Fish({ fish, onLikeUpdate, isActive, previewSize, showLikeButton = true }) {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(fish.isLiked);
  const fishRef = useRef(null);
  const [userMessage, setUserMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const fishPreviewStyle = previewSize ? { width: previewSize.width, height: previewSize.height } : {};


  useEffect(() => {
    const checkIfLiked = async () => {
      // Om det är 'guestuser', sätt inte 'isLiked' eftersom 'guestuser' kan gilla obegränsat
      // if (user.username === 'guestuser') {
      //   return;
      // }
        // Check if no user is logged in or if it's the 'guestuser'
      if (!user || user.username === 'guestuser') {
        // No need to check like status for guest users or when no one is logged in
        return;
      }

      // om användaren inte är guestuser, hämta listan och visa rätt värde på like/unlike
      try {
        const response = await axiosReq.get('/liked-fishes/');
        if (response.status === 200) {
          setIsLiked(response.data.liked_fishes.includes(fish.id));
        }
      } catch (error) {
        console.error('Error checking if fish is liked:', error);
      }
    };
  
    checkIfLiked();
  }, [user, fish.id]);


  const displayMessage = (message, duration = 3000) => {
    setUserMessage(message);
    setShowMessage(true);
    setTimeout(() => {
        setShowMessage(false);
    }, duration);
};


  const handleLikeClick = async () => {
    try {
      const response = await axiosReq.post(`/fiskar/${fish.id}/like-unlike/`);
      if (response.status === 200 || response.status === 201) {
         // Använd det nya like_count och is_liked från backend-svaret
         const newLikeCount = response.data.like_count;
         const isLiked = response.data.is_liked;
        //  console.log('Access token:', localStorage.getItem('access_token')); 
        //  console.log('Refresh token:', localStorage.getItem('refresh_token'));
         console.log('User liked:', user);

          // Logga det nya likes_count värdet i konsolen
          console.log(`New likes count for fish ${fish.id}:`, newLikeCount);

         // Uppdatera fiskens information i Fishtank-komponenten
         setIsLiked(isLiked);
         onLikeUpdate(fish.id, newLikeCount, isLiked);

        // Uppdatera meddelandet för användaren
        displayMessage(`Tack för din feedback! Nytt antal gillningar: ${newLikeCount}`)
      }
    } catch (error) {
      console.error('Error liking/unliking fish:', error);

       // Visa felmeddelandet för användaren
       displayMessage('Ett fel uppstod när du försökte gilla/ogilla fisken.');
    }
  };


  // const getBubbleSizeClass = (likesCount) => {
  //   if (likesCount > 20) {
  //     return 'bubble-large';
  //   } else if (likesCount > 10) {
  //     return 'bubble-medium';
  //   } else if (likesCount > 5) {
  //     return 'bubble-small';
  //   } else {
  //     return 'bubble-default';
  //   }
  // };
  
  // Använd funktionen för att få storleksklassen för pratbubblan
  // const bubbleSizeClass = getBubbleSizeClass(fish.likes_count);

  const getFishSizeClass = (likesCount) => {
    if (likesCount > 20) {
      return 'fish-large';
    } else if (likesCount > 10) {
      return 'fish-medium';
    } else if (likesCount > 5) {
      return 'fish-small';
    } else {
      return 'fish-default';
    }
  };

  // Sedan använder vi funktionen för att få storleksklassen baserat på antal likes
  const sizeClass = getFishSizeClass(fish.likes_count);


  let FishImage;
  if (fish.fish_type === 'svärdfisk') {
    FishImage = <img src={SvärdfiskImage} alt="Svärdfisk" style={fishPreviewStyle} className={fishstyles[sizeClass]}/>;
  } else if (fish.fish_type === 'clownfisk') {
    FishImage = <img src={ClownfiskImage} alt="Clownfisk" style={fishPreviewStyle} className={fishstyles[sizeClass]}/>;
  } else if (fish.fish_type === 'bläckfisk') {
    FishImage = <img src={BläckfiskImage} alt="Bläckfisk" style={fishPreviewStyle} className={fishstyles[sizeClass]}/>;
  } else if (fish.fish_type === 'blåsfisk') {
    FishImage = <img src={BlåsfiskImage} alt="Blåsfisk" style={fishPreviewStyle} className={fishstyles[sizeClass]}/>;
  }


    return (
      <Container style={{ position: 'relative' }}>

          <div>
          {showMessage && <div className={fishstyles.gillameddelande}>{userMessage}</div>}
          </div>

          <div>
            <div ref={fishRef}>
              {FishImage}
            </div>

            <div className={fishstyles.pratbubbla}>
              <div className={`row justify-content-center ${fishstyles.pratcontainer}`}>
                <div className={`col-12 ${fishstyles.bubbleContent}`}>
                  <h5 className={fishstyles.fontstyle}>{fish.title}</h5>
                  {isActive && (
                    <div className={fishstyles.messagecontainer}>
                      <p className={fishstyles.postmessage}>{fish.message}</p>

                      {showLikeButton && (
                        <>
                          <p>Likes: {fish.likes_count}</p>
                          <Button variant="success" onClick={handleLikeClick}>
                            {isLiked ? 'Unlike' : 'Like'}
                          </Button>
                        </>
                      )}
                      <p>Användare: {fish.user ? fish.user.username : 'Gäst'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
    
          {/* <div>
            <div ref={fishRef}>
              {FishImage}
            </div>

            <div className={fishstyles.pratbubbla}>
              <div>
                <div className={`col-6 col-sm-6 col-md-6 col-lg-6 ${fishstyles.bubbleContent}`}>
                  <h5 className={fishstyles.fontstyle}>{fish.title}</h5>
                  {isActive && (
                      <div className={fishstyles.messagecontainer}>
                       <p className={fishstyles.postmessage}>{fish.message}</p>
                     

                      {showLikeButton && ( 
                      <>
                      <p>Likes: {fish.likes_count}</p>
                      <Button variant="success" onClick={handleLikeClick}>
                        {isLiked ? 'Unlike' : 'Like'}
                      </Button>
                      </>
                      )}
                    <p>Användare: {fish.user ? fish.user.username : 'Gäst'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div> */}
      </Container>
    );
  }
  
  export default Fish;
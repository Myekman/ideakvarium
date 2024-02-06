import React, { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
import axiosReq from './components/axiosReq';

import ClownfiskImage from '../assets/images/clownfisk.png';
import SvärdfiskImage from '../assets/images/svärdfisk.png';
import BlåsfiskImage from '../assets/images/blåsfisk.png';
import BläckfiskImage from '../assets/images/bläckfisk.png';
import fishstyles from '../styles/Fish.module.css';
import { Button } from 'react-bootstrap';

import { useUser } from './auth/UserContext';
// import axios from 'axios';

// Fish.js
function Fish({ fish, onLikeUpdate, isActive, previewSize, showLikeButton = true }) {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(fish.isLiked);
  const fishRef = useRef(null);

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
      }
    } catch (error) {
      console.error('Error liking/unliking fish:', error);
    }
  };


  const getBubbleSizeClass = (likesCount) => {
    if (likesCount > 3) {
      return 'bubble-large';
    } else if (likesCount > 2) {
      return 'bubble-medium';
    } else if (likesCount > 1) {
      return 'bubble-small';
    } else {
      return 'bubble-default';
    }
  };
  
  // Använd funktionen för att få storleksklassen för pratbubblan
  const bubbleSizeClass = getBubbleSizeClass(fish.likes_count);

  const getFishSizeClass = (likesCount) => {
    if (likesCount > 3) {
      return 'fish-large';
    } else if (likesCount > 2) {
      return 'fish-medium';
    } else if (likesCount > 1) {
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
      <div>

        <div ref={fishRef}>
          {FishImage}
        </div>

        <div className={`pratbubbla ${fishstyles[bubbleSizeClass]}`}>
          <div className="row justify-content-center">
            <div className={`col-12 col-md-8 col-lg-6 ${fishstyles.pratbubbla}`}>
              <h5>{fish.title}</h5>
              {isActive && (
                <div>
                  <p className={fishstyles.message}>{fish.message}</p>
                  {/* <p>Användare: {fish.user ? fish.user.username : 'Gäst'}</p> */}

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
    );
  }
  
  export default Fish;
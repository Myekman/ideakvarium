import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import axiosReq from './components/axiosReq';

import ClownfiskImage from '../assets/images/clownfisk.png';
import SvärdfiskImage from '../assets/images/svärdfisk.png';
import BlåsfiskImage from '../assets/images/blåsfisk.png';
import BläckfiskImage from '../assets/images/bläckfisk.png';
import fishstyles from '../styles/Fish.module.css';

import { useUser } from './auth/UserContext';
import axios from 'axios';

// Fish.js
function Fish({ fish, onLikeUpdate, isPaused }) {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(fish.isLiked);


  useEffect(() => {
    const checkIfLiked = async () => {
      // Om det är 'guestuser', sätt inte 'isLiked' eftersom 'guestuser' kan gilla obegränsat
      if (user.username === 'guestuser') {
        return;
      }
      // om användaren inte är guestuser, hämta listan och visa rätt värde på like/unlike
      try {
        const response = await axios.get('/api/liked-fishes/');
        if (response.status === 200) {
          setIsLiked(response.data.liked_fishes.includes(fish.id));
        }
      } catch (error) {
        console.error('Error checking if fish is liked:', error);
      }
    };
  
    checkIfLiked();
  }, [user, fish.id]);


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


  let FishImage;
  if (fish.fish_type === 'svärdfisk') {
    FishImage = <img src={SvärdfiskImage} alt="Svärdfisk" className={fishstyles[sizeClass]}/>;
  } else if (fish.fish_type === 'clownfisk') {
    FishImage = <img src={ClownfiskImage} alt="Clownfisk" className={fishstyles[sizeClass]}/>;
  } else if (fish.fish_type === 'bläckfisk') {
    FishImage = <img src={BläckfiskImage} alt="Bläckfisk" className={fishstyles[sizeClass]}/>;
  } else if (fish.fish_type === 'blåsfisk') {
    FishImage = <img src={BlåsfiskImage} alt="Blåsfisk" className={fishstyles[sizeClass]}/>;
  }



    return (
      <div>

      <div>
        {/* Här kan du lägga till din länk om du vill */}
        {FishImage}
      </div>
      <h3>{fish.title}</h3>
      {/* <button onClick={() => setShowMore(!showMore)}>show more</button> */}
      
      {/* Här kontrollerar vi om showMore är true, då visar vi extra innehållet */}
      {isPaused && (
        <div>
          <p>{fish.message}</p>
          <p>Likes: {fish.likes_count}</p>
          <button onClick={handleLikeClick}>
            {isLiked ? 'Unlike' : 'Like'}
          </button>
          <p>{fish.user ? fish.user.username : 'Gäst'}</p>
        </div>
      )}
        {/* <div> */}
          {/* <Link to={`/fiskar/${fish.id}`}> */}
            {/* {FishImage} */}
          {/* </Link> */}
        {/* </div> */}
        {/* {fish.title} */}

        {/* <p>{fish.message}</p> 
        <p>Likes: {fish.likes_count}</p> */}

        {/* <button onClick={handleLikeClick}>
          {isLiked ? 'Unlike' : 'Like'}
        </button> */}
        {/* <p>{fish.user.username}</p> */}
        {/* <p>{fish.user ? fish.user.username : 'Gäst'}</p> */}
      </div>
    );
  }
  
  export default Fish;
import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import axiosReq from './components/axiosReq';

import ClownfiskImage from '../assets/images/clownfisk.png';
import SvärdfiskImage from '../assets/images/svärdfisk.png';
import BlåsfiskImage from '../assets/images/blåsfisk.png';
import BläckfiskImage from '../assets/images/bläckfisk.png';
import fishstyles from '../styles/Fish.module.css';

// Fish.js
function Fish({ fish, onLikeUpdate }) {
  const [userHasLiked, setUserHasLiked] = useState(fish.userHasLiked);

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
    // Lägg till dessa loggar för felsökning
    console.log('sizeClass:', sizeClass);
    console.log('fishstyles:', fishstyles);
    console.log(`Klassnamn som appliceras: ${fishstyles[sizeClass]}`);

  const handleLikeClick = async () => {
    try {
      const response = await axiosReq.post(`/fiskar/${fish.id}/like-unlike/`);
      if (response.status === 200 || response.status === 201) {
         // Använd det nya like_count och is_liked från backend-svaret
         const newLikeCount = response.data.like_count;
         const userHasLiked = response.data.is_liked;

          // Logga det nya likes_count värdet i konsolen
          console.log(`New likes count for fish ${fish.id}:`, newLikeCount);

         // Uppdatera fiskens information i Fishtank-komponenten
         setUserHasLiked(userHasLiked);
         onLikeUpdate(fish.id, newLikeCount, userHasLiked);
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
      <div className={fishstyles.fishpost}>
        <div>
          <Link to={`/fiskar/${fish.id}`}>
            {FishImage}
          </Link>
        </div>
        {fish.title}
        <p>{fish.message}</p> 
        <p>Likes: {fish.likes_count}</p>
        <p>{fish.user.username}</p>
        <button onClick={handleLikeClick}>
          {userHasLiked ? 'Unlike' : 'Like'}
        </button>
      </div>
    );
  }
  
  export default Fish;
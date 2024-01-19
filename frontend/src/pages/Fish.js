import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import axiosReq from './components/axiosReq';

import ClownfiskImage from '../assets/images/clownfisk.png';
import SvärdfiskImage from '../assets/images/svärdfisk.png';
import BlåsfiskImage from '../assets/images/blåsfisk.png';
import BläckfiskImage from '../assets/images/bläckfisk.png';

// Fish.js
function Fish({ fish, onLikeUpdate }) {
  const [userHasLiked, setUserHasLiked] = useState(fish.userHasLiked);

  const handleLikeClick = async () => {
    try {
      const response = await axiosReq.post(`/fiskar/${fish.id}/like-unlike/`);
      if (response.status === 200 || response.status === 201) {
         // Använd det nya like_count och is_liked från backend-svaret
         const newLikeCount = response.data.like_count;
         const userHasLiked = response.data.is_liked;

          // Logga det nya likes_count värdet i konsolen
          console.log(`New likes count for fish ${fish.id}:`, newLikeCount);
          // console.log(onLikeUpdate);
          // console.log(handleLikeClick);

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
    FishImage = <img src={SvärdfiskImage} alt="Svärdfisk" />;
  } else if (fish.fish_type === 'clownfisk') {
    FishImage = <img src={ClownfiskImage} alt="Clownfisk" />;
  } else if (fish.fish_type === 'bläckfisk') {
    FishImage = <img src={BläckfiskImage} alt="Bläckfisk"/>;
  } else if (fish.fish_type === 'blåsfisk') {
    FishImage = <img src={BlåsfiskImage} alt="Blåsfisk"/>;
  }


    return (
      <div className="fish">
        <h3>
          <Link to={`/fiskar/${fish.id}`}>
            {fish.fish_type}
          </Link>
        </h3>
        {FishImage}
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
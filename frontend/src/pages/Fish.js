import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosReq from './components/axiosReq';

// Fish.js
function Fish({ fish, onLikeUpdate }) {
  const [userHasLiked, setUserHasLiked] = useState(fish.isLiked);

    
  // useEffect(() => {
  //   // Detta tvingar en omrendering när fish.likes_count ändras
  // }, [fish.likes_count]);

  const handleLikeClick = async () => {
    try {
      const response = await axiosReq.post(`/fiskar/${fish.id}/like-unlike/`);
      if (response.status === 200 || response.status === 201) {
         // Använd det nya like_count och is_liked från backend-svaret
         const newLikeCount = response.data.like_count;
         const isLiked = response.data.is_liked;

          // Logga det nya likes_count värdet i konsolen
          console.log(`New likes count for fish ${fish.id}:`, newLikeCount);
 
         // Uppdatera fiskens information i Fishtank-komponenten
         setUserHasLiked(userHasLiked)
         onLikeUpdate(fish.id, newLikeCount, userHasLiked);
      }
    } catch (error) {
      console.error('Error liking/unliking fish:', error);
      // Hantera fel, t.ex. visa ett felmeddelande för användaren
    }
  };


    return (
      <div className="fish">
        <h3>
          <Link to={`/fiskar/${fish.id}`}>
            {fish.fish_type}
          </Link>
        </h3> 
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
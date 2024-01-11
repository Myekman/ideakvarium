import React from 'react';
import { Link } from 'react-router-dom';

// Fish.js
function Fish({ fish }) {
    return (
      <div className="fish">
        <h3>
          <Link to={`/fiskar/${fish.id}`}>
            {fish.fish_type}
          </Link>
        </h3> 
        <p>{fish.message}</p> 
        <p>Likes: {fish.likes_count}</p> 
      </div>
    );
  }
  
  export default Fish;
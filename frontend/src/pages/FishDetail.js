import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Fish from './Fish';

function FishDetail() {
    const [fish, setFish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {pk} = useParams();


    useEffect(() => {
      //  fetch(`http://127.0.0.1:8000/api/fiskar/${pk}`) 
       fetch(`https://model.sweco.se/innovation/api/fiskar/${pk}`) // Använd 'pk' för att göra API-anropet
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setFish(data);
            setLoading(false);
          })
          .catch(error => {
            setError(error);
            setLoading(false);
          });
      }, [pk]); // 'pk' som en beroende så att useEffect körs igen om 'pk' ändras

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;
      if (!fish) return <p>No fish found</p>;

      return (
        <div>
             <Fish key={fish.id} fish={fish} />
            {/* <h2>{fish.fish_type}</h2>
            <p>{fish.message}</p>
            <p>Likes: {fish.likes_count}</p> */}
        </div>
      );
}

export default FishDetail;
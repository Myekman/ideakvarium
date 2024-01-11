import React, { useState, useEffect } from 'react';
import Fish from './Fish';

function Fishtank() {
    const [fishes, setFishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/fiskar') // Ändra till din korrekta backend-URL
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setFishes(data);
            setLoading(false);
          })
          .catch(error => {
            setError(error);
            setLoading(false);
          });
      }, []);
    
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;
    
      return (
        <div className="aquarium">
          {fishes.map(fish => (
            <Fish key={fish.id} fish={fish} />
          ))}
        </div>
      );
    }
    
export default Fishtank;

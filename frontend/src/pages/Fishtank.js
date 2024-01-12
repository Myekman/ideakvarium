import React, { useState, useEffect } from 'react';
import Fish from './Fish';
import SearchBigFishes from './SearchFishes';


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


      const handleSearch = (searchFishes) => {
        setLoading(true);
        let searchQuery = '';
        if (searchFishes === 'largest') {
          searchQuery = 'like_count__gt=1';
        // } else if (searchFishes === 'smallest') {
        //   searchQuery = 'like_count__gt=0&like_count__lte=2';
        }
        fetch(`http://127.0.0.1:8000/api/fiskar?${searchQuery}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            setFishes(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error:', error);
            setError(error);
            setLoading(false);
          });
      };
    
      return (
        <div>
          <SearchBigFishes onSearch={handleSearch} />
          {fishes.map(fish => (
            <Fish key={fish.id} fish={fish} />
          ))}
          {/* {loading && <p>Loading...</p>}
          {!loading && fishes.map((fish) => <Fish key={fish.id} fish={fish} />)} */}
      </div>
      );
    }
    
export default Fishtank;

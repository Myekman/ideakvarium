import React, { useState, useEffect } from 'react';
import Fish from './Fish';
import SearchBigFishes from './SearchFishes';


function Fishtank() {
    const [fishes, setFishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/fiskar') 
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

      // sök efter de största / minsta fskarna
      const handleFilter = (searchFishes) => {
        setLoading(true);
        let searchQuery = '';
        if (searchFishes === 'largest') {
          searchQuery = 'like_count__gt=1';
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

      // sök efter fiskar med ord, tex username, fishtype eller messsage.
      const handleSearch = () => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/api/fiskar?search=${searchTerm}`)
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

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;
    
      return (
        <div>
           <input
            type="text"
            placeholder="Sök..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Sök</button>

          <SearchBigFishes onSearch={handleFilter} />
          {fishes.map(fish => (
            <Fish key={fish.id} fish={fish} />
          ))}
      </div>
      );
    }
    
export default Fishtank;

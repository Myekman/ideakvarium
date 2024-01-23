import React, { useState, useEffect } from 'react';
import Fish from './Fish';
import SearchBigFishes from './SearchFishes';
import { Container } from 'react-bootstrap';
import fishstyles from '../styles/Fish.module.css';

function Fishtank() {
    const [fishes, setFishes] = useState([]);
    const [displayedFishes, setDisplayedFishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

// useEffect för att hämta alla fiskar
    // useEffect(() => {
    //     setLoading(true);
    //     fetch('http://127.0.0.1:8000/api/fiskar/') 
    //       .then(response => {
    //         if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //       })
    //       .then(data => {
    //         setFishes(data);
    //         setLoading(false);
    //       })
    //       .catch(error => {
    //         setError(error);
    //         setLoading(false);
    //       });
    //   }, []);

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/fiskar/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFishes(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFishes();
  }, []);

  useEffect(() => {
    if (fishes.length > 0) {
      setDisplayedFishes(fishes.slice(0, 5));
      const interval = setInterval(() => {
        setDisplayedFishes(prevDisplayedFishes => {
          const startIndex = (fishes.indexOf(prevDisplayedFishes[0]) + 5) % fishes.length;
          return fishes.slice(startIndex, startIndex + 5);
        });
      }, 10000); // Byt ut fiskarna var 10:e sekund

      return () => clearInterval(interval);
    }
  }, [fishes]); // Den här useEffect beror på `fishes`

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;



      // sök efter de största / minsta fskarna
      const handleFilter = (searchFishes) => {
        setLoading(true);
        let searchQuery = '';
        if (searchFishes === 'largest') {
          searchQuery = 'like_count__gt=1';
        }
        fetch(`http://127.0.0.1:8000/api/fiskar/?${searchQuery}`)
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
        fetch(`http://127.0.0.1:8000/api/fiskar/?search=${searchTerm}`)
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


    const handleLikeUpdate = (fishId, newLikeCount, isLiked) => {
      setFishes(prevFishes =>
        prevFishes.map(fish =>
          fish.id === fishId
            ? { ...fish, likes_count: newLikeCount, isLiked: isLiked }
            : fish
        )
      );
    };
    
      return (
        <Container>
          <div className={fishstyles.fishtank}>
            <input
              type="text"
              placeholder="Sök..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Sök</button>

            <SearchBigFishes onSearch={handleFilter} />
            {displayedFishes.map(fish => (
              <Fish key={fish.id} fish={fish} onLikeUpdate={handleLikeUpdate}/>
            ))}
          </div>
        </Container>
      );
    }
    
export default Fishtank;
import React, { useState, useEffect } from 'react';
import Fish from './Fish';
import SearchBigFishes from './SearchFishes';
import { Col, Container, Row } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import fishstyles from '../styles/Fish.module.css';
import FishAnimated from './components/FishAnnimation';

function Fishtank() {
    const [fishes, setFishes] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const [displayedFishes, setDisplayedFishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFishId, setActiveFishId] = useState(null);
    const [pausedFishId, setPausedFishId] = useState(null);



  // useEffect för att hämta alla fiskar
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

  // use effect för att hämta 5 fiskar åt gången
  useEffect(() => {
    if (fishes.length > 0) {
      setDisplayedFishes(fishes.slice(0, 5));
      const interval = setInterval(() => {
        setDisplayedFishes(prevDisplayedFishes => {
          const startIndex = (fishes.indexOf(prevDisplayedFishes[0]) + 5) % fishes.length;
          return fishes.slice(startIndex, startIndex + 5);
        });
      }, 60000); // byt ut fiskar

      return () => clearInterval(interval);
    }
  }, [fishes]);


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


    const handleFishClick = (fishId) => {
      if (pausedFishId === fishId) {
          // Om fisken redan är pausad, återuppta den
          setPausedFishId(null);
      } else {
          // Pausa den här fisken
          setPausedFishId(fishId);
      }
      
      // Aktivera fisken och visa dess innehåll om den inte redan är aktiv
      setActiveFishId(prevActiveFishId => prevActiveFishId === fishId ? null : fishId);
  };


  // const handleFishClick = (fishId) => {
  //   if (pausedFishId === fishId) {
  //       // Om fisken redan är pausad, återuppta den
  //       setPausedFishId(null);
  //   } else {
  //       // Pausa den här fisken
  //       setPausedFishId(fishId);
  //   }
    
  //   // Aktivera fisken och justera dess y-position om den inte redan är aktiv
  //   setActiveFishId(prevActiveFishId => {
  //     if (prevActiveFishId === fishId) {
  //       // Om fisken redan är aktiv, avaktivera den
  //       return null;
  //     } else {
  //       // Kalkylera och justera y-positionen för fisken så att meddelandet inte går utanför tanken
  //       const fishElement = document.getElementById(`fish-${fishId}`);
  //       if (fishElement) {
  //         const fishRect = fishElement.getBoundingClientRect();
  //         const bottomSpace = window.innerHeight - fishRect.bottom;
  //         const messageHeight = 200; // Anta att meddelandets höjd är 200px
  //         if (bottomSpace < messageHeight) {
  //           // Om det inte finns tillräckligt med utrymme under fisken, justera dess y-position
  //           const newYPosition = fishRect.top - (messageHeight - bottomSpace);
  //           fishElement.style.top = `${newYPosition}px`;
           
  //         }
  //       }
  //       return fishId;
  //     }
  //   });
  // };

    
      return (
        <Container>
          <div className={fishstyles.fishtank}>
            <Row>
            <Col>
              <InputGroup>
                <InputGroup.Text>Sök efter Title/Fisktyp:</InputGroup.Text>
                <Form.Control 
                  as="textarea" 
                  aria-label="Sök efter Title/Fisktyp:" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col>
              <Button className={fishstyles.sökbtn} variant="success" onClick={handleSearch}>Sök</Button>
            </Col>
              
            {/* <p>hej {user.username}!</p> */}
           
            </Row>

            <SearchBigFishes onSearch={handleFilter} />

            {displayedFishes.map((fish, index) => (
              <FishAnimated 
                key={fish.id} 
                index={index}
                isActive={activeFishId === fish.id}
                setActiveFishId={setActiveFishId} // Se till att detta skickas som en prop
                fishId={fish.id}
                setIsPaused={setIsPaused} 
                isPaused={pausedFishId === fish.id}
                setPausedFishId={setPausedFishId}
                onFishClick={() => handleFishClick(fish.id)}
                >
                <Fish 
                  fish={fish} 
                  onLikeUpdate={handleLikeUpdate} 
                  isPaused={isPaused} 
                  setIsPaused={setIsPaused}
                  setActiveFishId={setActiveFishId}
                  isActive={activeFishId === fish.id} // Ny prop för att kontrollera om fisken är aktiv
                  />
              </FishAnimated>
            ))}
          </div>
        </Container>
      );
    }
    
export default Fishtank;
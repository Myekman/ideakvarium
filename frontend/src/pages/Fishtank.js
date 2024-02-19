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

    const [filterMessage, setFilterMessage] = useState(''); // Lägger till ett tillstånd för att visa meddelanden baserat på filtret
   

  // useEffect för att hämta alla fiskar
  // useEffect(() => {
  //   const fetchFishes = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch('/api/fiskar/');
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       setFishes(data);
  //     } catch (error) {
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFishes();
  // }, []);

  const fetchFishes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fiskar/');
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

  // useEffect för att hämta alla fiskar när komponenten monteras
  useEffect(() => {
    fetchFishes();
  }, []);

  // Funktion för att återställa filtret och hämta alla fiskar
  const resetFilter = () => {
    setFilterMessage('');
    fetchFishes(); // Anropa den återanvändbara funktionen för att hämta fiskarna
  };

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


      // sök efter de största fskarna
      const handleFilter = (searchFishes) => {
        setLoading(true);
        let searchQuery = '';
        let message = '';
        if (searchFishes === 'largest') {
          searchQuery = 'like_count__gt=1';
          message = 'Just nu visas de största fiskarna'
        }
        fetch(`/api/fiskar/?${searchQuery}`)
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
        setFilterMessage(message);
      };

      // sök efter fiskar med ord, tex username, fishtype eller messsage.
      const handleSearch = () => {
        setLoading(true);
        fetch(`/api/fiskar/?search=${searchTerm}`)
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
          setSearchTerm('');
      };

      if (loading) return <div className='text-white'>Loading...</div>;
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
            </Row>

            <Row>
              <Col className='mt-4'>
                {/* <SearchBigFishes onSearch={handleFilter} /> */}
                {!filterMessage && <SearchBigFishes onSearch={handleFilter} />}
              </Col>
            </Row>

            <Row>
              <Col xs={6} sm={6}>
                {filterMessage && (
                  <>
                  <div className={fishstyles.filtermessage}>
                    <p>{filterMessage}</p>
                    <Button className={fishstyles.resetbtn} onClick={resetFilter}>Visa alla!</Button>
                    </div>
                  </>
                )}
              </Col>
            </Row>

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
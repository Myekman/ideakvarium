import React, { useState, useEffect } from 'react';
import Fish from './Fish';
import SearchBigFishes from './SearchFishes';
import { Col, Container, Row } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import fishstyles from '../styles/Fish.module.css';
import FishAnimated from './components/FishAnnimation';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation, useQuery, useQueryClient } from 'react-query';

function Fishtank() {
  // const [fishes, setFishes] = useState([]);
  const [searchFishes, setSearchFishes] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [displayedFishes, setDisplayedFishes] = useState([]);

  // const [loading, setLoading] = useState(true);
  const [spinnerLoading, setSpinnerLoading] = useState(false);

  // const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFishId, setActiveFishId] = useState(null);
  const [pausedFishId, setPausedFishId] = useState(null);

  const [filterMessage, setFilterMessage] = useState(''); 

  const queryClient = useQueryClient();
  const likeMutation = useMutation(
    ({ fishId, isLiked }) => {
      const method = isLiked ? 'POST' : 'DELETE'; 
      return fetch(`/api/fiskar/${fishId}/like`, {
        method: method,
       
      });
    },
    {
      onSuccess: () => {
        // Om uppdateringen lyckades, invalidisera och omhämta fisklistan
        queryClient.invalidateQueries('fiskar');
      },
    }
  );

  const handleLikeUpdate = (fishId, isLiked) => {
    likeMutation.mutate({ fishId, isLiked });
  };


  //  ------------------------------------------------hämta alla fiskar 
  const { isLoading, error, data: fishes } = useQuery({
    queryKey: ["fiskar", searchFishes, searchTerm],
    queryFn: () => {
      const params = []
      if (searchTerm.length > 0) {
        params.push(`search=${searchTerm}`)
      }
      if (searchFishes) {
        params.push('like_count__gt=0')
      }
      return fetch(`/api/fiskar/?${
        params.join("&")
      }`).then((res) =>
        res.json(),
      )
    },
    refetchInterval: 5000,
    placeholderData: [],
  
  });
  console.log({ isLoading, error, fishes });


  const handleFilter = () => {
    setSearchFishes('largest');
    setFilterMessage('Just nu visas de största fiskarna...');
  };

  const resetFilter = () => {
    setSearchFishes(false);
    setSearchTerm('');
    setFilterMessage('');
  };

  const handleSearch = () => {
    if (searchTerm.length > 0) {
      setFilterMessage(`Just nu visas en fisksökning: "${searchTerm}"`);
    }
  };

    // --------------------------------------------------Visa en spinner loading innan fiskar kommer in i bild
    useEffect(() => {
      if (isLoading === false) {
        setSpinnerLoading(true);
  
        const timer = setTimeout(() => {
          setSpinnerLoading(false);
        }, 5000);
  
        return () => clearTimeout(timer);
      }
    }, [isLoading]);
  
    // ---------------------------------------------------use effect för att hämta 5 fiskar åt gången
    const fishnumber = Math.round(window.innerWidth / 100);
    console.log('fishnumber before' + fishnumber);

    // const intervalTime = window.innerWidth < 500 ? 20000 : 30000;
   
    useEffect(() => {
      console.log('useEffect körs med fishes och fishnumber:', fishes, fishnumber);

      if (fishes && fishes.length > 0) {
        setDisplayedFishes(fishes.slice(0, fishnumber));

        // const interval = setInterval(() => {
        //   setDisplayedFishes(prevDisplayedFishes => {
        //     const startIndex = (fishes.indexOf(prevDisplayedFishes[0]) + fishnumber) % fishes.length;
        //     return fishes.slice(startIndex, startIndex + fishnumber);
        //   });
        // }, 60000); // byt ut fiskar
  
        // return () => clearInterval(interval);
      }
    }, [fishes, fishnumber]);
      // fisk A, fisk B, fisk C, fisk E fisk G
      const recentlyCreatedFishes = fishes.filter((fish) => (new Date().getTime() - new Date(fish.created_at).getTime()) < 5*60*1000);
      // fisk G, fisk J och fisk Z
      const actuallyDisplayedFishes = [...recentlyCreatedFishes, ...displayedFishes.filter((fish) => !recentlyCreatedFishes.some((f) => f.id === fish.id))].slice(0, fishnumber);
      // fisk G, fisk J och fisk Z    fisk A, fisk B

      
  // -------------------------------------------------------
      if (isLoading) return 'Loading...'

      if (error) return 'An error has occurred: ' + error.message
  

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
            <Col sm={12} md={6}>
              <InputGroup>
                <InputGroup.Text className={fishstyles.fontstyle}>Sök efter Title/Fisktyp:</InputGroup.Text>
                <Form.Control 
                  as="textarea" 
                  aria-label="Sök efter Title/Fisktyp:" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  rows = {1}
                />
              </InputGroup>
            </Col>
            <Col sm={12}>
              <Button className={fishstyles.sökbtn} variant="success" onClick={handleSearch}>Sök</Button>
            </Col>
            </Row>

            <Row>
              <Col className='mt-4'>
                {!filterMessage && <SearchBigFishes onSearch={handleFilter} />}
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={8} md={6}>
                {filterMessage && (
                  <>
                  <div className={fishstyles.filtermessage}>
                    <h5>{filterMessage}</h5>
                    <Button className={fishstyles.resetbtn} onClick={resetFilter}>Tillbaka till visa alla</Button>
                  </div>
                  </>
                )}
              </Col>
            </Row>
            
            <Row>
                {spinnerLoading && 
                <div className={fishstyles.spinner}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p>fiskar simmar in...</p>
                </div>
                }
            </Row>

            {actuallyDisplayedFishes.map((fish, index) => (
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
                setDisplayedFishes={setDisplayedFishes}
                fishes={fishes}
                >
                <Fish 
                  fish={fish} 
                  onLikeUpdate={handleLikeUpdate} 
                  isPaused={isPaused} 
                  setIsPaused={setIsPaused}
                  setActiveFishId={setActiveFishId}
                  setSpinnerLoading={setSpinnerLoading}
                  isActive={activeFishId === fish.id} // Ny prop för att kontrollera om fisken är aktiv
                  />
              </FishAnimated>
            ))}
          </div>
        </Container>
      );
    }
    
export default Fishtank;
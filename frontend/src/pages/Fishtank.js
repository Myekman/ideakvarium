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
import { useQuery } from 'react-query';

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

  // const queryClient = useQueryClient();
  // const likeMutation = useMutation(
  //   ({ fishId, isLiked }) => {
  //     const method = isLiked ? 'POST' : 'DELETE'; 
  //     return fetch(`/api/fiskar/${fishId}/like`, {
  //       method: method,
       
  //     });
  //   },
  //   {
  //     onSuccess: () => {
  //       // Om uppdateringen lyckades, invalidisera och omhämta fisklistan
  //       queryClient.invalidateQueries('fiskar');
  //     },
  //   }
  // );

  // const handleLikeUpdate = (fishId, isLiked) => {
  //   likeMutation.mutate({ fishId, isLiked });
  // };

  //  ------------------------------------------------hämta alla fiskar 
  // const fetchFishes = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch('/api/fiskar/');
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     setFishes(data);
  //   } catch (error) {
  //     setError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  
  // useEffect(() => {
  //   fetchFishes();
  // }, []);


  //  ------------------------------------------------hämta alla fiskar 
  // const fishes = data;
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


  // Övrig logik för handleLikeUpdate, handleFishClick och useEffects kan vara densamma
  // ...

  // if (isLoading) {
  //   return <div className='text-white'>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }


    // --------------------------------------------------Visa en spinner loading innan fiskar kommer in i bild
    useEffect(() => {
      if (isLoading === false) {
        setSpinnerLoading(true);
  
        const timer = setTimeout(() => {
          setSpinnerLoading(false);
        }, 3000);
  
        return () => clearTimeout(timer);
      }
    }, [isLoading]);
  
    // ---------------------------------------------------use effect för att hämta 5 fiskar åt gången
   
    useEffect(() => {
      if (fishes && fishes.length > 0) {
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
      // fisk A, fisk B, fisk C, fisk E fisk G
      const recentlyCreatedFishes = fishes.filter((fish) => (new Date().getTime() - new Date(fish.created_at).getTime()) < 5*60*1000);
      // fisk G, fisk J och fisk Z
      const actuallyDisplayedFishes = [...recentlyCreatedFishes, ...displayedFishes.filter((fish) => !recentlyCreatedFishes.some((f) => f.id === fish.id))].slice(0, 5);
      // fisk G, fisk J och fisk Z    fisk A, fisk B
  // -----------------------------------------------------------------
      if (isLoading) return 'Loading...'

      if (error) return 'An error has occurred: ' + error.message

  // --------------------------------- Funktion för att återställa filtret och hämta alla fiskar
  // const resetFilter = () => {
  //   setFilterMessage('');
  //   // fetchFishes(); 
  // };

  // -------------------------------------------------------------------------------------------


  //-------------------------------------------------------------------------------------------------

  // if (loading) {
  //   return <div className='text-white'>Loading...</div>;
  // }


  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }


      // sök efter de största fskarna
      // const handleFilter = (searchFishes) => {
      //   setLoading(true);
      //   let searchQuery = '';
      //   let message = '';
      //   if (searchFishes === 'largest') {
      //     searchQuery = 'like_count__gt=1';
      //     message = 'Just nu visas de största fiskarna...'
      //   }
      //   fetch(`/api/fiskar/?${searchQuery}`)
      //     .then((response) => {
      //       if (!response.ok) {
      //         throw new Error('Network response was not ok');
      //       }
      //       return response.json();
      //     })
      //     .then((data) => {
      //       setFishes(data);
      //       setLoading(false);
      //     })
      //     .catch((error) => {
      //       console.error('Error:', error);
      //       setError(error);
      //       setLoading(false);
      //     });
      //   setFilterMessage(message);
      // };

      // sök efter fiskar med ord, tex username, fishtype eller messsage.
      // const handleSearch = () => {
      //   setLoading(true);
      //   let message = '';
      //   fetch(`/api/fiskar/?search=${searchTerm}`)
      //     .then((response) => {
      //       if (!response.ok) {
      //         throw new Error('Network response was not ok');
      //       }
      //       return response.json();
      //     })
      //     .then((data) => {
      //       if (data.length === 0) { // Kontrollerar om inga fiskar hittades
      //         message = `Inga fiskar hittades med sökordet: "${searchTerm}"`;
      //         setFilterMessage(message); // Sätt meddelandet om inga fiskar hittades
      //       } else {
      //         setFishes(data);
      //         message = (`Just nu visas en fisksökning: "${searchTerm}"`);
      //         setFilterMessage(message); // Sätt meddelandet om fiskar hittades
      //       }
      //       setLoading(false);
      //     })
      //     .catch((error) => {
      //       console.error('Error:', error);
      //       setError(error);
      //       setLoading(false);
      //     });
      //     setSearchTerm('');
      // };


    // const handleLikeUpdate = (fishId, newLikeCount, isLiked) => {
    //   setFishes(prevFishes =>
    //     prevFishes.map(fish =>
    //       fish.id === fishId
    //         ? { ...fish, likes_count: newLikeCount, isLiked: isLiked }
    //         : fish
    //     )
    //   );
    // };
    
  


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
          {/* {spinnerLoading && <div className='text-white'>Loading..</div>} */}
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
                {/* <SearchBigFishes onSearch={handleFilter} /> */}
                {!filterMessage && <SearchBigFishes onSearch={handleFilter} />}
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={8}>
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
                >
                <Fish 
                  fish={fish} 
                  // onLikeUpdate={handleLikeUpdate} 
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
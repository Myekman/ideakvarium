// FishList.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/FishList.module.css';
import { Button, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const FishList = () => {
  const navigate = useNavigate();
  const [fishes, setFishes] = useState([]);

  useEffect(() => {
    // Hämta fiskdata från servern och uppdatera 'fishes' statet
    const fetchFishes = async () => {
      try {
        const response = await fetch('/api/fiskar/');
        const data = await response.json();
        setFishes(data);
      } catch (error) {
        console.error('Kunde inte hämta fiskar:', error);
      }
    };

    fetchFishes();
  }, []);

  // Kontrollera om 'fishes'-arrayen är tom och visa ett meddelande om det
  if (fishes.length === 0) {
    return <div>Inga fiskar att visa.</div>;
  }


  const handleBackToFishTank = () => {
    navigate('/');
  };

  return (
    <Container>
    <ul>
      <h1 className={styles.heading}>Alla våra idéer!</h1>
      {fishes.map(fish => (
        <li key={fish.id}>
            <div className={styles.fishInfo}>
              <h2>{fish.title}</h2>
               <p>{fish.message}</p>
               <p>Likes: {fish.likes_count}</p>
           </div>
        </li>
      ))}
      <Col className='mt-4'>
        <Button className={styles.fishlistbtn} variant="success" onClick={handleBackToFishTank}>Tillbaka till Fiskarna</Button>
      </Col>
    </ul>
    </Container>
  );
};

export default FishList;


// FishList.js
// import React, { useState, useEffect } from 'react';
// import Fish from './Fish';

// const FishList = () => {
//   const [fishes, setFishes] = useState([]);

//   useEffect(() => {
//     // Hämta fiskdata från servern och uppdatera 'fishes' statet
//     const fetchFishes = async () => {
//       try {
//         const response = await fetch('/api/fiskar/');
//         const data = await response.json();
//         setFishes(data);
//       } catch (error) {
//         console.error('Kunde inte hämta fiskar:', error);
//       }
//     };

//     fetchFishes();
//   }, []);

//   // Kontrollera om 'fishes'-arrayen är tom och visa ett meddelande om det
//   if (fishes.length === 0) {
//     return <div>Inga fiskar att visa.</div>;
//   }

//   return (
//     <ul>
//       {fishes.map(fish => (
//         <li key={fish.id}>
//           <Fish fish={fish} />
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default FishList;

// FishList.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/FishList.module.css';
import { Col } from 'react-bootstrap';

const FishList = () => {
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

  if (!fishes || fishes.length === 0) {
    return <div>Inga fiskar att visa.</div>;
  }

  return (
    <div className={styles.fishlistContainer}>
        <h1 className={styles.heading}>Alla våra idéer!</h1>
      {fishes.map(fish => (
        <Col key={fish.id} xs={12} md={6}>
        <ul col-md={6} className={styles.fishlist}>
            <div className="fish-info">
                <h2>{fish.title}</h2>
                <p>{fish.message}</p>
                <p>Likes: {fish.likes_count}</p>
            </div>
        </ul>
        </Col>
      ))}
    </div>
  );
};

export default FishList;


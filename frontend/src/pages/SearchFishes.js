import React from 'react';
import { Button } from 'react-bootstrap';
import fishstyles from '../../src/styles/Fish.module.css';

function SearchBigFishes({ onSearch }) {

    const handleShowLargestClick = () => {
      onSearch('largest'); // largest är bestämt i views.py
    };

    return (
      <div>
        <Button className={fishstyles.sökbtn2} variant="success" onClick={handleShowLargestClick}>Visa de största fiskarna</Button>
      </div>
      );
  }
  

export default SearchBigFishes;
import React from 'react';
import { Button } from 'react-bootstrap';
import fishstyles from '../../src/styles/Fish.module.css';

function SearchBigFishes({ onSearch }) {

    const handleShowLargestClick = () => {
      onSearch('largest'); // largest är bestämt i views.py
    };

    // const handleShowSmallestClick = () => {
    //   onSearch('smallest'); // smallest är bestämt i views.py
    // };


    return (
      <div>
        <Button className={fishstyles.sökbtn2} variant="success" onClick={handleShowLargestClick}>Visa de största fiskarna</Button>
        {/* <button onClick={handleShowSmallestClick}>Visa de minsta fiskarna</button> */}
      </div>
      );
  }
  

export default SearchBigFishes;
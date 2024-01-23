import React from 'react';

function SearchBigFishes({ onSearch }) {

    const handleShowLargestClick = () => {
      onSearch('largest'); // largest är bestämt i views.py
    };

    // const handleShowSmallestClick = () => {
    //   onSearch('smallest'); // smallest är bestämt i views.py
    // };


    return (
      <div>
        <button onClick={handleShowLargestClick}>Visa de största fiskarna</button>
        {/* <button onClick={handleShowSmallestClick}>Visa de minsta fiskarna</button> */}
      </div>
      );
  }
  

export default SearchBigFishes;
import React, { useState } from 'react';


function SearchBigFishes({ onSearch }) {
    const [searchFishes, setSearchFishes] = useState('');
  
    const handleSearchSubmit = (e) => {
      e.preventDefault();
      // Anropa search som skickas från fishtank
      onSearch(searchFishes);
    };

    return (
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Sök fiskar..."
            value={searchFishes}
            onChange={(e) => setSearchFishes(e.target.value)}
          />
          <button type="submit">Sök</button>
        </form>
      );
  }
  

export default SearchBigFishes;
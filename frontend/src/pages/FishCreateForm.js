import React, { useState } from 'react';
import axiosReq from './components/axiosReq';

const PostCreateFish = () => {
  const [fishData, setFishData] = useState({
    title: "",
    message: "",
    fish_type: "",
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFishData({
      ...fishData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Använd axiosReq-instansen för att göra POST-förfrågan
      const token = localStorage.getItem('access_token');
      console.log('Access token:', localStorage.getItem('access_token')); 
      console.log('Refresh token:', localStorage.getItem('refresh_token')); 
        if (!token) {
        console.log('Ingen token hittades');
        }
      const response = await axiosReq.post('/api/fiskar/', fishData);
      console.log(response.data);
      // Återställ formuläret eller hantera framgångsrik skapelse här
      setFishData({
        title: "",
        message: "",
        fish_type: "",
      });
    } catch (error) {
      console.error('Det gick inte att skapa fisk', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={fishData.title}
        onChange={handleInputChange}
        placeholder="Titel"
      />
      <input
        type="text"
        name="message"
        value={fishData.message}
        onChange={handleInputChange}
        placeholder="Meddelande"
      />
      <select
        name="fish_type"
        value={fishData.fish_type}
        onChange={handleInputChange}
      >
        <option value="">Välj en fishtyp</option>
        <option value="goldfish">Guldfisk</option>
        <option value="koi">Koi</option>
        <option value="betta">Betta</option>
        {/* Lägg till fler alternativ här baserat på dina fishtyper */}
      </select>
      <button type="submit">Skapa Fisk</button>
    </form>
  );
};

export default PostCreateFish;
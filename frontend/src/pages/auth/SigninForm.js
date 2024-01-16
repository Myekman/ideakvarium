import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importera useHistory hook från react-router-dom

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Använd useHistory hook för att omdirigera användaren

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/token/', {
        username: username,
        password: password,
      });
      console.log('Inloggning lyckades! Användarnamn:', username); 
      // Spara JWT i localStorage eller på annat säkert sätt
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // Rensa formuläret
      setUsername('');
      setPassword('');
      // Omdirigera användaren till en annan sida, t.ex. hem
      navigate('/'); 
    } catch (error) {
      if (error.response) {
        // Servern svarade med en statuskod som inte är inom 2xx-intervallet
        console.error('Login error', error.response.status, error.response.data);
      } else if (error.request) {
        // Förfrågan gjordes men inget svar mottogs
        console.error('Login error', error.request);
      } else {
        // Något gick fel vid skapandet av förfrågan
        console.error('Login error', error.message);
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;
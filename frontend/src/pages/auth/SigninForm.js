import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importera useHistory hook från react-router-dom
import { useUser } from './UserContext';


function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signIn } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Använd signIn funktionen från UserContext
      const success = await signIn(username, password);
      if (success) {
        // Om inloggningen lyckas, rensa formuläret och navigera till startsidan
        setUsername('');
        setPassword('');
        navigate('/');
      } else {
        // Om inloggningen misslyckas, hantera det här, till exempel visa ett felmeddelande
        console.error('Fel användarnamn eller lösenord');
      }
    } catch (error) {
      // Felhantering om signIn kastar ett undantag
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
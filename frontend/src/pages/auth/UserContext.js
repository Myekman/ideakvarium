// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
// import axiosReq from '../components/axiosReq';
import axios from 'axios';


const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('User in NavBar:', user);
    console.log('Access token:', localStorage.getItem('access_token')); 
    console.log('Refresh token:', localStorage.getItem('refresh_token'));
  }, [user]); // Logga användarstaten när den ändras


  useEffect(() => {
    const validateTokenAndSetUserState = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          // Gör ett API-anrop för att validera access token.
          const response = await axios.get('/api/user/', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          // Användarinformation hämtades framgångsrikt, uppdatera användarstaten.
          setUser(response.data);
        } catch (error) {
          // Om token inte är giltig eller något annat fel inträffar, rensa tokens och sätt användarstaten till null.
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        }
      } else {
        // Ingen access token finns, sätt användarstaten till null.
        setUser(null);
      }
    };
  
    validateTokenAndSetUserState();
  }, []);


  const signIn = async (username, password) => {
    try {
      const response = await axios.post('/api/token/', {
        username,
        password,
      });
      // Spara JWT i localStorage eller på annat säkert sätt
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // Sätt användarstaten med relevant information
      setUser({ username });
      // Returnera true om inloggningen var framgångsrik
      return true;
    } catch (error) {
      // Hantera fel
      console.error('Login error', error);
      // Returnera false om inloggningen misslyckades
      return false;
    }
  };

  // Funktion för att logga ut användaren
  const logOut = () => {
    // Ta bort JWT från lokal lagring
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);

  };

  return (
    <UserContext.Provider value={{ user, signIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};
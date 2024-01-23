// UserContext.js
import React, { createContext, useContext, useState } from 'react';
// import axiosReq from '../components/axiosReq';
import axios from 'axios';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = async (username, password) => {
    try {
      const response = await axios.post('/api/token/', {
        username,
        password,
      });
      // Spara JWT i localStorage eller på annat säkert sätt
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      console.log('Access token:', localStorage.getItem('access_token')); 
      console.log('Refresh token:', localStorage.getItem('refresh_token')); 
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
    console.log('Access token:', localStorage.getItem('access_token')); // bör vara null
    console.log('Refresh token:', localStorage.getItem('refresh_token')); // bör vara null
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};
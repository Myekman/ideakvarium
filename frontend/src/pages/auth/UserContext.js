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


  // useEffect(() => {
  //   // Om ingen användare är inloggad, sätt en default 'guestuser'
  //   if (!user) {
  //     setUser({ username: 'guestuser' });
  //   }
  // }, [user, setUser]);


  useEffect(() => {
    const validateAndRefreshToken = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
  
      if (accessToken && refreshToken) {
        try {
          // Validera access token genom att göra en förfrågan till en skyddad resurs
          const response = await axios.get('/api/user/', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          // Om förfrågan lyckas, är access token fortfarande giltig
          // Spara både token och användarinformation från serverns svar
          setUser({ 
            token: accessToken, 
            ...response.data 
          });
        } catch (error) {
          if (error.response && error.response.status === 401) {
            // Om access token är utgånget, använd refresh token för att få ett nytt access token
            try {
              const tokenResponse = await axios.post('/api/token/refresh/', { refresh: refreshToken });
              const newAccessToken = tokenResponse.data.access;
              localStorage.setItem('access_token', newAccessToken);
              // Efter att ha fått en ny access token, hämta användarinformation igen
              const userResponse = await axios.get('/api/user/', {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });
              setUser({ 
                token: newAccessToken, 
                ...userResponse.data 
              });
            } catch (refreshError) {
              // Om förnyelse misslyckas, logga ut användaren
              logOut();
            }
          }
        }
      }
    };
  
    validateAndRefreshToken();
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
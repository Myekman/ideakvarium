// axiosReq.js
import axios from 'axios';


const axiosReq = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
});

// Lägg till en interceptor som sätter Authorization-headern
axiosReq.interceptors.request.use(config => {
  // Hämta token från där den lagras (t.ex. localStorage)
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Ta bort Authorization-headern om ingen token finns
    delete config.headers['Authorization'];
  }
  return config;
}, error => {
  return Promise.reject(error);
});


// Response interceptor för att hantera tokenförnyelse
axiosReq.interceptors.response.use(
  response => response, // Om svaret är OK, returnera det direkt
  async error => {
    // Om ett fel uppstår och det är en 401 Unauthorized
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      // Kontrollera om vi redan har försökt att förnya token
      if (!originalRequest._retry) {
        originalRequest._retry = true; // Markera att vi försöker förnya token
        const refreshToken = localStorage.getItem('refresh_token');
        try {
          // Försök att förnya access token med refresh token
          const response = await axiosReq.post('/token/refresh/', {
            refresh: refreshToken,
          });
          // Om förnyelsen lyckas, spara den nya access token
          localStorage.setItem('access_token', response.data.access);
          // Uppdatera access token i den ursprungliga förfrågningen och skicka om den
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return axiosReq(originalRequest);
        } catch (refreshError) {
          // Om tokenförnyelsen misslyckas, hantera det enligt din app-logik
          console.error("Unable to refresh token", refreshError);
          // Du kan välja att inte logga ut användaren här och bara returnera ett fel
          return Promise.reject(refreshError);
        }
      }
    }

    // För alla andra svarstyper som inte är 401, eller om vi redan har försökt att förnya token, returnera felet
    return Promise.reject(error);
  }
);

export default axiosReq;


// Response interceptor för att hantera tokenförnyelse
// axiosReq.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem('refresh_token');
//       try {
//         const tokenResponse = await axiosReq.post('/token/refresh/', {
//           refresh: refreshToken,
//         });
//         const newAccessToken = tokenResponse.data.access;
//         localStorage.setItem('access_token', newAccessToken);
//         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//         return axiosReq(originalRequest);
//       } catch (refreshError) {
//         // Om token inte kan förnyas, logga ut användaren
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         // Här kan du också uppdatera din applikations state om nödvändigt
//         // Till exempel, om du använder en Context Provider för att hantera användarstaten
//         window.location.reload(); // Eller en annan logik för att tvinga en omdirigering till login
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );


// export default axiosReq;
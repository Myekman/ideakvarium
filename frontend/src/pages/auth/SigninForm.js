// LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/dj-rest-auth/login/', {
        username: username,
        password: password,
      });
      // Anropa onLoginSuccess med token och användarinfo
      onLoginSuccess(response.data.key, response.data.user);
      // Rensa formuläret
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login error', error.response);
      // Visa felmeddelande
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
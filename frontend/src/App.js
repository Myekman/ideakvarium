import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Fishtank from './pages/Fishtank';
import FishDetail from './pages/FishDetail';
import Login from '../src/pages/auth/SigninForm'
import Register from '../src/pages/auth/RegistrationForm'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Fishtank />} />
        <Route path="/fiskar/:pk" element={<FishDetail />} />
        <Route path="fiskar/login" element={<Login />} />
        <Route path="fiskar/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

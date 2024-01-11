import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Fishtank from './pages/Fishtank';
import FishDetail from './pages/FishDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Fishtank />} />
        <Route path="/fiskar/:pk" element={<FishDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

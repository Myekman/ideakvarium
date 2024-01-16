import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Fishtank from './pages/Fishtank';
import FishDetail from './pages/FishDetail';
import LoginForm from './pages/auth/SigninForm';
// import Register from './pages/auth/RegistrationForm';
import Navbar from './pages/components/Navbar';
import FishCreateForm from './pages/FishCreateForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
          <Navbar />
          <Fishtank />
          </>
        } />
        <Route path="/fiskar/:pk" element={<FishDetail />} />
        <Route path="/fiskar/create" element={<FishCreateForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

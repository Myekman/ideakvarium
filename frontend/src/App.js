import appstyles from '../src/App.module.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Fishtank from './pages/Fishtank';
import FishDetail from './pages/FishDetail';
import LoginForm from './pages/auth/SigninForm';
import { UserProvider } from './pages/auth/UserContext';
// import Register from './pages/auth/RegistrationForm';
import NavigationBar from './pages/components/Navbar';
import FishCreateForm from './pages/FishCreateForm';
import background from '../src/assets/images/havet.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div style={{ 
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        height: '100vh', 
        overflow: 'hidden', 
      }}>
      <UserProvider>
        <Routes>
            <Route path="/" element={
              <>
              <NavigationBar />
              <Fishtank />
              </>
            } />
            <Route path="/fiskar/:pk" element={<FishDetail />} />
            <Route path="/fiskar/create" element={<FishCreateForm />} />
            <Route path="/login" element={<LoginForm />} />
            {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
      </UserProvider>
      </div>
    </Router>
  );
}

export default App;

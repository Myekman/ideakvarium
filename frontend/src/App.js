// import appstyles from '../src/App.module.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Fishtank from './pages/Fishtank';
import FishList from './pages/Fishlist';
import LoginForm from './pages/auth/SigninForm';
import { UserProvider } from './pages/auth/UserContext';
import NavigationBar from './pages/components/Navbar';
import FishCreateForm from './pages/FishCreateForm';
import background from '../src/assets/images/havet.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Bubbles from './pages/components/BubbleAnnimation';
import RegisterForm from './pages/auth/RegistrationForm';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();



function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <div id="bubbels-container" style={{ 
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}>
      <UserProvider>
      <Bubbles count={20} />
        <Routes>
            <Route path="/" element={
              <>
              <NavigationBar />
              <Fishtank />
              </>
            } />
            <Route path="/fiskar/lista" element={<FishList/>} />
            <Route path="/fiskar/create" element={<FishCreateForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </UserProvider>
      </div>
    </Router>
    </QueryClientProvider>
  );
}

export default App;

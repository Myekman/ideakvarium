import React, { useState } from 'react';
import axiosReq from './components/axiosReq';
// import axios from 'axios';
import { Col, Container, Row  } from 'react-bootstrap';
import NavigationBar from './components/Navbar';
import { useUser } from './auth/UserContext';
import Fish from './Fish';
import Bubbles from './components/BubbleAnnimation';
import formstyles from '../styles/Form.module.css';

import ClownfiskImage from '../assets/images/clownfisk.png';
import SvärdfiskImage from '../assets/images/svärdfisk.png';
import BlåsfiskImage from '../assets/images/blåsfisk.png';
import BläckfiskImage from '../assets/images/bläckfisk.png';
// import fishstyles from '../styles/Fish.module.css';


const PostCreateFish = (isPaused) => {
  const { user } = useUser();
  const [createdFish, setCreatedFish] = useState(null);
  const [fishData, setFishData] = useState({
    title: "",
    message: "",
    fish_type: "",
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFishData({
      ...fishData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosReq.post('/fiskar/', fishData);
      console.log(response.data);
      console.log('Access token:', localStorage.getItem('access_token')); 
      console.log('Refresh token:', localStorage.getItem('refresh_token'));
      console.log('User in NavBar:', user);
      console.log('Fish created:', response.data);
      // Logga fishData före återställning
      console.log('Fish data before reset:', fishData);
      // Återställ formuläret eller hantera framgångsrik skapelse här
      setFishData({
        title: "",
        message: "",
        fish_type: "",
      });
    } catch (error) {
      console.error('Det gick inte att skapa fisk', error);
    }

    setCreatedFish(fishData);
  };


  return (
    <Container>
      <NavigationBar />
      <Bubbles count={20}/>
      <Row>
        <Col>
        <form className={formstyles.form} onSubmit={handleSubmit}>
          <input className={formstyles.input}
            type="text"
            name="title"
            value={fishData.title}
            onChange={handleInputChange}
            placeholder="Rubrik"
          />
          <input
            type="text"
            name="message"
            value={fishData.message}
            onChange={handleInputChange}
            placeholder="Meddelande"
          />
          <select
            name="fish_type"
            value={fishData.fish_type}
            onChange={handleInputChange}
          >
            <option value="">Välj en fishtyp</option>
            <option value="svärdfisk">{SvärdfiskImage}</option>
            <option value="clownfisk">{ClownfiskImage}</option>
            <option value="bläckfisk">{BläckfiskImage}</option>
            <option value="blåsfisk">{BlåsfiskImage}</option>
          </select>
          <button type="submit">Skapa Fisk</button>
        </form>
        </Col>
      </Row>

      <Col className={formstyles.displyfish}>
      {createdFish && (
        <Fish fish={createdFish} isPaused={isPaused} showLikeButton={false} isActive={true}/>
      )}
      </Col>
    </Container>
  );
};

export default PostCreateFish;
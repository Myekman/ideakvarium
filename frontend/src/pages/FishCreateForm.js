import React, { useState } from 'react';
import axiosReq from './components/axiosReq';
// import axios from 'axios';
import { Col, Container, Row  } from 'react-bootstrap';
import NavigationBar from './components/Navbar';
import { useUser } from './auth/UserContext';
import Fish from './Fish';
import Bubbles from './components/BubbleAnnimation';
import formstyles from '../styles/Form.module.css';
import CustomDropdown from './components/CustumDropDown';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import fishstyles from '../styles/Fish.module.css';


const PostCreateFish = ( { isPaused }  ) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [createdFish, setCreatedFish] = useState(null);
  const previewSize = { width: '200px', height: '200px' };
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


  const handleBackToFishTank = () => {
    navigate('/');
  };


  return (
    <Container>
      <NavigationBar />
      <Bubbles count={20}/>
      <Row className={formstyles.formcontainer}>
        <Col md={6}>
        <Form className={formstyles.form} onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Control
              type="text"
              name="title"
              value={fishData.title}
              onChange={handleInputChange}
              placeholder="Rubrik"
            />
          </Col>
        </Form.Group>

        {/* Meddelande */}
        <Form.Group as={Row} className="mb-3">
          <Col>
            <Form.Control
              type="text"
              name="message"
              value={fishData.message}
              onChange={handleInputChange}
              placeholder="Meddelande"
            />
          </Col>
        </Form.Group>

        {/* Dropdown */}
        <Form.Group as={Row} className="mb-3">
          <Col>
            <CustomDropdown
              fishData={fishData}
              handleInputChange={(eventKey) => handleInputChange({ target: { name: 'fish_type', value: eventKey } })}
            />
          </Col>
        </Form.Group>
        <Button type="submit" variant="success">Posta</Button>
        </Form>
        </Col>

        <Col md={6}>
          <div>
            <h2 className='text-white'>Ytterligare Innehåll</h2>
            <p className='text-white'>Här kan du lägga till mer text, bilder, widgets eller annat innehåll som du vill visa bredvid formuläret.</p>
          </div>
        </Col>
      </Row>
      <Col className='mt-4'>
          <Button variant="success" onClick={handleBackToFishTank}>Tillbaka till FishTank</Button>
      </Col>

      <Col className={formstyles.displyfish}>
      {createdFish && (
        <Fish fish={createdFish} isPaused={isPaused} showLikeButton={false} isActive={true} previewSize={previewSize} />
      )}
      
      </Col>
    </Container>
  );
};

export default PostCreateFish;
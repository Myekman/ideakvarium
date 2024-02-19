import React,  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Alert from 'react-bootstrap/Alert';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import formstyles from '../../styles/Form.module.css';

import axios from "axios";
import Bubbles from '../components/BubbleAnnimation';
// import { useRedirect } from "../../hooks/useRedirect";

const RegisterForm = () => {
//   useRedirect('loggedIn')
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = signUpData;

  const navigate = useNavigate();
  
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };


const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the form from submitting through the browser
    try {
        // Use signUpData from state to send registration data
        const response = await axios.post("http://127.0.0.1:8000/dj-rest-auth/registration/", signUpData);
        console.log('Registration successful', response.data);
        navigate("/login"); // Redirects the user to the login page
    } catch (err) {
        console.error('Registration error', err.response?.data);
        setErrors(err.response?.data);
    }
};


const handleBackToFishTank = () => {
  navigate('/');
};


  return (
    <Container className="mt-4">
      <Bubbles count={20}/>
      <Row className={formstyles.formcontainer}>
        <Col md={6}>
        <Form className={formstyles.form} onSubmit={handleSubmit}>
        <Form.Group className="mt-4" controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control 
                type="text" 
                placeholder="Username" 
                name="username"
                value={username}
                onChange={handleChange}
                className={formstyles.fontstyle}
                />
            </Form.Group>
            {errors.username?.map((error, index) => (
            <Alert variant="warning" key={index}>
                {error}
            </Alert>
            ))}

          <Form.Group className="mt-4" controlId="password1">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control 
                type="password" 
                placeholder="Password" 
                name="password1" 
                value={password1}
                onChange={handleChange}
                className={formstyles.fontstyle}
                />
            </Form.Group>
            {errors.password1?.map((error, index) => (
            <Alert variant="warning" key={index}>
                {error}
            </Alert>
            ))}

          <Form.Group className="mt-4" controlId="password2">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control 
                type="password" 
                placeholder="Password" 
                name="password2" 
                value={password2}
                onChange={handleChange}
                className={formstyles.fontstyle}
                />
            </Form.Group>
            {errors.password2?.map((error, index) => (
            <Alert variant="warning" key={index}>
                {error}
            </Alert>
            ))}

            <Button variant="success" className="mt-4"
                type="submit">
                Sign up
            </Button>

            <Container className="mt-4">
            <Link to="/login" className={formstyles.links}>
                <p className="formstyles.fontstyle2">Har du redan en användare?</p>
                <span  className="formstyles.fontstyle2">Sign in</span>
            </Link>
            </Container>
        </Form>
        </Col>

        {/* <Col md={6} className="mt-4">
          <div className={formstyles.fishcreatepadding}>
            <h3 className='text-white'>Berätta, hur snurrar dina tankar och idéer idag?</h3>
            <h6 className='text-white'>Dela med dig om vad som helst, allt från små funderingar till stora idéer!!</h6>
          </div>
        </Col> */}
      </Row>

      <Col className='mt-4'>
          <Button variant="success" className={formstyles.formbtn} onClick={handleBackToFishTank}>Tillbaka till Fiskarna</Button>
      </Col>
    </Container>

  );
};

export default RegisterForm;
import React,  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// import Alert from 'react-bootstrap/Alert';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import axios from "axios";
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
  
//   const [errors, setErrors] = useState({});

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
        // If you want to display error messages, you can reintroduce and update the errors state here
        // setErrors(err.response?.data);
    }
};


  return (
    <Row>
      <Col md={6}>
        <Container>
          <h1>sign up</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control 
                type="text" 
                placeholder="Username" 
                name="username"
                value={username}
                onChange={handleChange}
                />
            </Form.Group>
            {/* {errors.username?.map((error, index) => (
            <Alert variant="warning" key={index}>
                {error}
            </Alert>
            ))} */}

            <Form.Group controlId="password1">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control 
                type="password" 
                placeholder="Password" 
                name="password1" 
                value={password1}
                onChange={handleChange}
                />
            </Form.Group>
            {/* {errors.password1?.map((error, index) => (
            <Alert variant="warning" key={index}>
                {error}
            </Alert>
            ))} */}

            <Form.Group controlId="password2">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control 
                type="password" 
                placeholder="Confirm password" 
                name="password2" 
                value={password2}
                onChange={handleChange}
                />
            </Form.Group>
            {/* {errors.password2?.map((error, index) => (
            <Alert variant="warning" key={index}>
                {error}
            </Alert>
            ))} */}

            <Button 
                type="submit">
                Sign up
            </Button>

            <Container>
            <Link to="/login">
                <p> Already have an account?</p>
                <span>Sign in</span>
            </Link>
            </Container>
        </Form>
    
        </Container>
        
      </Col>
      {/* <Col md={6}>
        <Image
          className={`${appStyles.FillerImage}`}
          src={
            SignUpImage
          }
        />
      </Col> */}
    </Row>

  );
};

export default RegisterForm;
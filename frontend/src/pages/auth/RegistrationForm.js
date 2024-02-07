import React,  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Alert from 'react-bootstrap/Alert';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import axios from "axios";

const RegisterForm = () => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = signUpData;

  const navigate= useNavigate();
  
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      navigate("/login");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Row>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container>
          <h1>Registrera</h1>

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
            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

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
            {errors.password1?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

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
            {errors.password2?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Button 
                type="submit">
                Sign up
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}

            <Container>
            <Link to="/login">
                <p> Already have an account?</p>
                <span>Sign in</span>
            </Link>
            </Container>
        </Form>
    
        </Container>
        
      </Col>
      {/* <Col
        md={6}
      >
        <Image
          src={
            SignUpImage
          }
        />
      </Col> */}
    </Row>

  );
};

export default RegisterForm;
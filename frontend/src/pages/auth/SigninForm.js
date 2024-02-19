import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importera useHistory hook från react-router-dom
import { useUser } from './UserContext';
import { Button, Col, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import styles from '../../styles/Form.module.css';


function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signIn } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Använd signIn funktionen från UserContext
      const success = await signIn(username, password);
      if (success) {
        // Om inloggningen lyckas, rensa formuläret och navigera till startsidan
        setUsername('');
        setPassword('');
        navigate('/');
      } else {
        // Om inloggningen misslyckas, hantera det här, till exempel visa ett felmeddelande
        console.error('Fel användarnamn eller lösenord');
      }
    } catch (error) {
      // Felhantering om signIn kastar ett undantag
      if (error.response) {
        // Servern svarade med en statuskod som inte är inom 2xx-intervallet
        console.error('Login error', error.response.status, error.response.data);
      } else if (error.request) {
        // Förfrågan gjordes men inget svar mottogs
        console.error('Login error', error.request);
      } else {
        // Något gick fel vid skapandet av förfrågan
        console.error('Login error', error.message);
      }
    }
  };

  const handleBackToFishTank = () => {
    navigate('/');
  };


  return (

    <>
    <Container>
      <div className="d-flex justify-content-center align-items-center">
        <Form className={styles.signinform} onSubmit={handleLogin}>
          <InputGroup className="mb-3">
            <InputGroup.Text className={styles.fontstyle} id="inputGroup-sizing-default">
              Användarnamn
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // placeholder="Username"
            />
          </InputGroup>
          <br />
          <InputGroup className="mb-3">
            <InputGroup.Text className={styles.fontstyle} id="inputGroup-sizing-default">
              Lösenord
            </InputGroup.Text>
            <Form.Control
              type="password"
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // placeholder="Password"
            />
          </InputGroup>
          <Button variant="success" type="submit">Log In</Button>
        </Form>
      </div>
      <Col className='mt-4'>
          <Button className={styles.formbtn} variant="success" onClick={handleBackToFishTank}>Tillbaka till Fiskarna</Button>
      </Col>
  </Container>
  </>
  );
}

export default LoginForm;
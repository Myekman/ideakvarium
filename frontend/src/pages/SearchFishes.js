import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import fishstyles from '../../src/styles/Fish.module.css';

function SearchBigFishes({ onSearch }) {

    const handleShowLargestClick = () => {
      onSearch('largest'); // largest är bestämt i views.py
    };

    return (
      <Row>
      <Col xs={12} md={4}>
      <div className={fishstyles.filtermessage}>
        <h5>Vilka är de populäraste idéerna just nu?</h5>
        <Button className={fishstyles.sökbtn2} variant="success" onClick={handleShowLargestClick}>Visa storbaddarna!</Button>
      </div>
      </Col>
      </Row>
      );
  }
  

export default SearchBigFishes;
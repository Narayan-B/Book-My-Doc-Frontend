import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import unauthorized from '../assets/images/unauthorized.webp'
export default function Unauthorized() {
  const backgroundStyle = {
    backgroundImage: `url(${unauthorized})`,  // Path to the image in the public directory
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',  // Stack items vertically
    alignItems: 'center',     // Center horizontally
    justifyContent: 'center', // Center vertically
    color: '#fff',
    textAlign: 'center' 
  };

  return (
    <div style={backgroundStyle}>
      <Container className="text-center">
        <Row>
          <Col>
            <h1 className="display-3 text-danger">403</h1>
            <h2 className="mb-4">Unauthorized Access</h2>
            <p className="lead">Sorry, you do not have the necessary permissions to access this page.</p>
            <div className="mt-4">
              <Button color="primary" href="/">Go back home</Button>{' '}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

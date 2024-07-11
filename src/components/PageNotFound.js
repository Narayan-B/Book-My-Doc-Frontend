import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import pageNotFoundImage from '../assets/images/pagenotfound.avif'; // Update the path to your image

export default function PageNotFound() {
    const backgroundStyle = {
        backgroundImage: `url(${pageNotFoundImage})`,
        backgroundSize: '100% 100%', // Ensure the image covers the entire background
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center'
      };

  return (
    <div style={backgroundStyle}>

      <Container>

        <Row className="justify-content-center">

          <Col xs="10" md="8" lg="6" className="text-top-center"> {/* Added text-top-center class */}
            <h1 className="display-3 text-danger mt-5">404</h1>
            <h2 className="mb-4">Page not found</h2>
            <p className="lead">Sorry, we couldn’t find the page you’re looking for.</p>
            <div className="mt-4">
              <Button color="primary" href="/">Go back home</Button>
            </div>
          </Col>
          
        </Row>

      </Container>
    </div>
  );
}

import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import verificationBackground from '../assets/images/progress.avif'; // Update the path to your image

export default function VerificationProgress() {
  const backgroundStyle = {
    backgroundImage: `url(${verificationBackground})`,
    backgroundSize: 'cover', // Ensure the image covers the entire background
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        <Row className="justify-content-center">
          <Col xs="10" md="8" lg="6" className="text-center">
            <h1 className="display-4 text-warning mt-5">Account Under Verification</h1>
            <h2 className="mb-4">Please wait until the admin approves your account</h2>
            <p className="lead">Your account is currently under verification. This process may take a little time. Thank you for your patience!</p>
            <div className="mt-4">
              <Button color="primary" href="/">Go back home</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

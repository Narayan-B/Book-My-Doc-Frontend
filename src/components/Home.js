import React from 'react';
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Button } from 'reactstrap'; // Assuming you are using reactstrap or a similar library
export default function Home() {
    const { user } = useAuth();

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md="8">
                    <div className="mt-5">
                        <h3 className="text-center mb-4">Home Component</h3>
                        {user ? (
                            <div className="text-center">
                                <h6 className="mb-3">Welcome, {user.username}</h6>
                                <h6 className="mb-3">Email: {user.email}</h6>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="mb-3">Please log in to access more features!</p>
                                <Button color="primary" href="/login">Login</Button>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

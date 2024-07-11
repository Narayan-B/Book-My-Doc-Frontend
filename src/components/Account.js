import React, { useEffect, useState } from 'react';
import axios from 'axios';
import accountBg from '../assets/images/account-bg.jpg';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';

export default function Account() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let response;
        if (user.role === 'patient') {
          response = await axios.get(`http://localhost:5555/api/patient/profile`, {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          });
        } else if (user.role === 'doctor') {
          response = await axios.get(`http://localhost:5555/api/doctor/profile`, {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          });
        }

        if (response && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("There was an error fetching the user profile!", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role) {
      fetchProfile();
    }
  }, [user]);

  return (
    <section className="vh-100 d-flex align-items-end" style={{ 
      backgroundImage: `url(${accountBg})`, 
      backgroundColor: '#f4f5f7',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      paddingBottom: '100px', 
      paddingRight: '50px',
    }}>
      <Container className="py-5">
        <Row className="justify-content-end">
          <Col lg="8" md="10" className="mb-4">
            {loading ? (
              <p>Loading...</p>
            ) : profile ? (
              <Card className="mb-4" style={{ borderRadius: '.5rem' }}>
                <Row className="g-0">

                  <Col md="4" className="gradient-custom text-center text-white"
                    style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                    <CardImg 
                      src={`http://localhost:5555/${profile.profilePic}`}
                      alt="Avatar" 
                      className="my-5 img-fluid" 
                      style={{ width: '120px' }} 
                    />
                    <CardTitle tag="h5">{`${profile.firstName} ${profile.lastName}`}</CardTitle>
                    <CardText>{profile.role}</CardText>
                  </Col>

                  <Col md="8">
                    <CardBody className="p-4">
                      <CardTitle tag="h6">Information</CardTitle>
                      <hr className="mt-0 mb-4" />
                      <Row className="pt-1">

                        <Col sm="6" className="mb-3">
                          <CardTitle tag="h6">Email</CardTitle>
                          <CardText className="text-muted">{user.email}</CardText>
                        </Col>
                        <Col sm="6" className="mb-3">
                          <CardTitle tag="h6">Phone</CardTitle>
                          <CardText className="text-muted">{profile.mobile}</CardText>
                        </Col>

                      </Row>
                      <CardTitle tag="h6">Address</CardTitle>
                      <hr className="mt-0 mb-4" />
                      <Row className="pt-1">

                        <Col sm="6" className="mb-3">
                          <CardTitle tag="h6">Address</CardTitle>
                          <CardText className="text-muted">{profile.address}</CardText>
                        </Col>
                        <Col sm="6" className="mb-3">
                          <CardTitle tag="h6">Pincode</CardTitle>
                          <CardText className="text-muted">{profile.pincode}</CardText>
                        </Col>

                      </Row>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            ) : (
              <p>No profile created.</p>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

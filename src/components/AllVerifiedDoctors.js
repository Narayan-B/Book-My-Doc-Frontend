import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {BsGeoAltFill} from 'react-icons/bs'
import { FaHospitalAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io"
import { FcMoneyTransfer } from "react-icons/fc";
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Button, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useAuth } from "../context/AuthContext";

export default function AllVerifiedDoctors() {
    const navigate=useNavigate()
    const {user}=useAuth()
    const [doctors, setDoctors] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5555/api/verified-doctors');
                setDoctors(response.data);
                //console.log(response.data)
            } catch (err) {
                console.log(err); 
            }
        };
        fetchDoctors();
    }, []);
    //console.log('doctors',doctors)

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }

    const handleViewProfile = (doctor) => {
        setSelectedDoctor(doctor);
        toggleModal();
    }

    const handleBook=(id)=>{
        if(user){
            navigate(`/book-appointment/${id}`)
        }
        if(!user){
            navigate('/login')
        }
    }

    return (
        <Container>
           <h1 className="text-center">All Doctors</h1>
            <Row>
                {doctors.map((doctor) => (
                    <Col key={doctor._id} md="4" className="mb-4">
                        <Card>
                            <img
                               alt="Profile Pic"
                               src={`http://localhost:5555/${doctor.profilePic}`}
                               crossOrigin='anonymous'
                               className="card-img-top"
                               style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                            />
                            <CardBody>
                                <CardTitle tag="h5">{doctor.firstName} {doctor.lastName}</CardTitle>
                                <CardSubtitle tag="h6" className="mb-2 text-muted">{doctor.userId.speciality}</CardSubtitle>
                                <CardText><><IoMdTime/></>{doctor.yearsOfExperience} years Of Experience</CardText>
                                <CardText><><FaHospitalAlt/></> {doctor.hospitalName} Hospital</CardText>
                                <CardText><><BsGeoAltFill/></>{doctor.hospitalAddress.city}</CardText>
                                <CardText><><FcMoneyTransfer/></>{doctor.consultationFees}/-</CardText>
                                {user && 
                                <>
                                <Button color="primary" onClick={() => handleViewProfile(doctor)}>View Profile</Button>
                                </>
                                }
                                <div style={{ position: 'absolute', bottom: 14, right: 14 }}>
                                    <Button onClick={()=>handleBook(doctor.userId._id)}color="primary">Book</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Modal for displaying doctor details */}
            <Modal isOpen={modalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Doctor Profile</ModalHeader>
                <ModalBody>
                    {selectedDoctor && (
                        <div>
                            <p><strong>Name:</strong> {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                            <p><strong>Gender:</strong> {selectedDoctor.gender}</p>
                            <p><strong>Mobile:</strong> {selectedDoctor.mobile}</p>
                            <p><strong>hospitalAddress:</strong> {selectedDoctor.hospitalAddress.street}, {selectedDoctor.hospitalAddress.city}, {selectedDoctor.hospitalAddress.state},  {selectedDoctor.hospitalAddress.country},{selectedDoctor.hospitalAddress.pinCode}.</p>
                            <p><strong>Speciality:</strong> {selectedDoctor.userId.speciality}</p>
                            <p><strong>Years of Experience:</strong> {selectedDoctor.yearsOfExperience}</p>
                            <p><strong>Languages Known:</strong>{" "}
                            {selectedDoctor.languagesSpoken.map((ele, i) => (
                                <span key={i}>
                                    {ele}
                                    {i !== selectedDoctor.languagesSpoken.length - 1 ? ", " : ""}
                                    </span>
                                 ))}</p>
                                 <p><strong>Consultation Fees: </strong>{selectedDoctor.consultationFees}</p>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>

                    <Button color="secondary" onClick={toggleModal}>Close</Button>
                    <Button onClick={handleBook} color="primary">Book</Button>

                    
                </ModalFooter>
            </Modal>
        </Container>
    );
}

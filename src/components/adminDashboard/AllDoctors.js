import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "reactstrap";
import { toast } from "react-toastify";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5555/api/all-doctors", {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setDoctors(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleVerify = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5555/api/doctor-verification/${id}`, { action: 'verify' }, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      console.log(response.data)
      const updatedDoctors = doctors.map((doctor) =>
        doctor._id === id ? { ...doctor, isVerified: true } : doctor
      );
      setDoctors(updatedDoctors);
      toast.success(response.data.message, {
        autoClose: 3000
      });
    } catch (err) {
      console.error("Error verifying doctor:", err);
      toast.error('Error verifying the doctor');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5555/api/doctor-verification/${id}`, {action:'reject'}, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      //console.log(response.data)
      const updatedDoctors = doctors.map((doctor) =>
        doctor._id === id ? { ...doctor, isVerified: false } : doctor
      );
      setDoctors(updatedDoctors);
      toast.success(response.data.message, {
        autoClose: 3000
      });
    } catch (err) {
      console.error('Error rejecting doctor:', err);
      toast.error('Error rejecting the doctor');
    }
  };

  return (
    <div>
      <h1 className="mb-4">All Doctors</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Registration Number</th>
            <th>Speciality</th>
            <th>Verified</th>
            <th>Experience Certificate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id}>
              <td>{doctor.username}</td>
              <td>{doctor.email}</td>
              <td>{doctor.registrationNo}</td>
              <td>{doctor.speciality}</td>
              <td>{doctor.isVerified ? "Yes" : "No"}</td>
              <td>
                {doctor.experienceCertificate ? (
                  <a
                    href={`http://localhost:5555/${doctor.experienceCertificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Certificate
                  </a>
                ) : (
                  "Not available"
                )}
              </td>
              <td>
                {!doctor.isVerified ? (
                  <>
                    <button className="btn btn-primary me-2" onClick={() => handleVerify(doctor._id)}>
                      Verify
                    </button>
                    <button className="btn btn-danger" onClick={() => handleReject(doctor._id)}>
                      Reject
                    </button>
                  </>
                ) : (
                  "Verified"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AllDoctors;

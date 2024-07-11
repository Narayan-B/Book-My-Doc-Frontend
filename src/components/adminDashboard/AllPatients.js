import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "reactstrap";

export default function AllPatients (){
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5555/api/all-patients", {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setPatients(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching doctors:", err)
      }
    };
    fetchPatients();
  }, []);

  return (
    <div>
      <h1 className="mb-4">All Doctors</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((doctor, index) => (
            <tr key={index}>
              <td>{doctor.username}</td>
              <td>{doctor.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
};



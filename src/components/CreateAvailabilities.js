import React, { useState } from 'react';
import axios from 'axios';

const timeOptions = [
    "7:00AM", "7:30AM", "8:00AM", "8:30AM",
    "9:00AM", "9:30AM", "10:00AM", "10:30AM",
    "11:00AM", "11:30AM", "12:00PM", "12:30PM",
    "1:00PM", "1:30PM", "2:00PM", "2:30PM",
    "3:00PM", "3:30PM", "4:00PM", "4:30PM",
    "5:00PM", "5:30PM", "6:00PM"
];

const consultationTimeOptions = [
    "15min", "20min", "25min", "30min", "35min", "40min", "45min"
];

export default function CreateAvailability() {
    const [form, setForm] = useState({
        consultationStartTime: "",
        consultationEndTime: "",
        consultationTimePerPatient: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };


    const validate = () => {
        let errors = {};

        if (!form.consultationStartTime) {
            errors.consultationStartTime = "Start time is required";
        }
        if (!form.consultationEndTime) {
            errors.consultationEndTime = "End time is required";
        }
        if (!form.consultationTimePerPatient) {
            errors.consultationTimePerPatient = "Consultation time per patient is required";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await axios.post('http://localhost:5555/api/doctor/availability', form, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log(response.data);
                alert('Availability created successfully');
            } catch (error) {
                console.error('Error creating availability', error);
                alert('Failed to create availability');
            }
        }
    };

    return (
        <div className='col-md-3'>
            <h1>Create Availability</h1>
            <form onSubmit={handleSubmit}>
                <label>Consultation Start Time:</label>
                <select 
                    className='form-control'
                    name="consultationStartTime" 
                    value={form.consultationStartTime} 
                    onChange={handleChange}
                >
                    <option value="">Select Start Time</option>
                    {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
                {errors.consultationStartTime && <span>{errors.consultationStartTime}<br/></span>}

                <label>Consultation End Time:</label>
                <select 
                    className='form-control'
                    name="consultationEndTime" 
                    value={form.consultationEndTime} 
                    onChange={handleChange}
                >
                    <option value="">Select End Time</option>
                    {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
                {errors.consultationEndTime && <span>{errors.consultationEndTime}<br/></span>}

                <label>Consultation Time Per Patient:</label>
                <select 
                    className='form-control'
                    name="consultationTimePerPatient" 
                    value={form.consultationTimePerPatient} 
                    onChange={handleChange}
                >
                    <option value="">Select Consultation Time</option>
                    {consultationTimeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
                {errors.consultationTimePerPatient && <span>{errors.consultationTimePerPatient}<br/></span>}

                <button className='btn btn-primary' type="submit">Create Availability</button>
            </form>
        </div>
    );
}

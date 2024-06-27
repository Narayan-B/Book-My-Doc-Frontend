import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LanguageList from 'language-list';

const languages = new LanguageList();

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
        languagesSpoken: [],
        consultationFees: ""
    });
    const [errors, setErrors] = useState({});

    const languageNames = languages.getLanguageNames();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleLanguageChange = (e) => {
        const { value, checked } = e.target;
        setForm((prevForm) => {
            const updatedLanguages = checked
                ? [...prevForm.languagesSpoken, value]
                : prevForm.languagesSpoken.filter((lang) => lang !== value);
            return {
                ...prevForm,
                languagesSpoken: updatedLanguages
            };
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
        if (form.languagesSpoken.length === 0) {
            errors.languagesSpoken = "At least one language is required";
        }
        if (!/^\d+$/.test(form.consultationFees)) {
            errors.consultationFees = "Invalid consultation fees";
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
        <div>
            <h1>Create Availability</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Consultation Start Time:</label>
                    <select 
                        name="consultationStartTime" 
                        value={form.consultationStartTime} 
                        onChange={handleChange}
                    >
                        <option value="">Select Start Time</option>
                        {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                    {errors.consultationStartTime && <span>{errors.consultationStartTime}</span>}
                </div>
                <div>
                    <label>Consultation End Time:</label>
                    <select 
                        name="consultationEndTime" 
                        value={form.consultationEndTime} 
                        onChange={handleChange}
                    >
                        <option value="">Select End Time</option>
                        {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                    {errors.consultationEndTime && <span>{errors.consultationEndTime}</span>}
                </div>
                <div>
                    <label>Consultation Time Per Patient:</label>
                    <select 
                        name="consultationTimePerPatient" 
                        value={form.consultationTimePerPatient} 
                        onChange={handleChange}
                    >
                        <option value="">Select Consultation Time</option>
                        {consultationTimeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                    {errors.consultationTimePerPatient && <span>{errors.consultationTimePerPatient}</span>}
                </div>
                <div>
                    <label>Languages Spoken:</label>
                    <div>
                        {languageNames.map(language => (
                            <div key={language}>
                                <input 
                                    type="checkbox" 
                                    id={language}
                                    value={language}
                                    onChange={handleLanguageChange}
                                    checked={form.languagesSpoken.includes(language)}
                                />
                                <label htmlFor={language}>{language}</label>
                            </div>
                        ))}
                    </div>
                    {errors.languagesSpoken && <span>{errors.languagesSpoken}</span>}
                </div>
                <div>
                    <label>Consultation Fees:</label>
                    <input 
                        type="text" 
                        name="consultationFees" 
                        value={form.consultationFees} 
                        onChange={handleChange} 
                    />
                    {errors.consultationFees && <span>{errors.consultationFees}</span>}
                </div>
                <button type="submit">Create Availability</button>
            </form>
        </div>
    );
}

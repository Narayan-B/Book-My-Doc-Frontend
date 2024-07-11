import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import moment from 'moment';
import 'moment-timezone';

const timeOptions = [
    "9:00AM", "9:30AM", "10:00AM", "10:30AM",
    "11:00AM", "11:30AM", "12:00PM", "12:30PM",
    "1:00PM", "1:30PM", "2:00PM", "2:30PM",
    "3:00PM", "3:30PM", "4:00PM", "4:30PM",
    "5:00PM"
];

const consultationTimeOptions = [
    "15min", "20min", "25min", "30min", "35min", "40min", "45min"
];

export default function CreateAvailability() {
    const [form, setForm] = useState({
        consultationStartTime: "",
        consultationEndTime: "",
        consultationTimePerPatient: "",
        consultationDays: []
    });
    const [errors, setErrors] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [serverErrors, setServerErrors] = useState([]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get('http://localhost:5555/api/doctor/availability', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                if (response.data.length > 0) {
                    const availability = response.data[0];
                    const consultationDays = availability.consultationDays.map(day => {
                        // Convert to local timezone (India)
                        return moment.tz(day, "Asia/Kolkata").format('YYYY-MM-DD');
                    });
                    setForm({
                        consultationStartTime: availability.consultationStartTime,
                        consultationEndTime: availability.consultationEndTime,
                        consultationTimePerPatient: availability.consultationTimePerPatient,
                        consultationDays: consultationDays.map(day => moment(day))
                    });
                    setIsUpdating(true);
                }
            } catch (error) {
                console.error('Error fetching availability', error);
            }
        };
        fetchAvailability();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ""
        });
    };

    const handleDateChange = (dates) => {
        // Convert the moment objects to ISO strings ('YYYY-MM-DD')
        const selectedDates = dates.map(date => date.format('YYYY-MM-DD'));
        setForm({
            ...form,
            consultationDays: selectedDates
        });
        setErrors({
            ...errors,
            consultationDays: "" // Clear any previous errors related to consultationDays
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
        if (form.consultationDays.length === 0) {
            errors.consultationDays = "Consultation days are required";
        } else {
            const today = moment().startOf('day');
            for (let day of form.consultationDays) {
                if (!moment(day).isSameOrAfter(today, 'day')) {
                    errors.consultationDays = `Consultation day ${moment(day).format('YYYY-MM-DD')} should not be before today's date`;
                    break;
                }
            }
        }

        // Check if start time is before end time
        if (form.consultationStartTime && form.consultationEndTime) {
            const startTime = moment(`1970-01-01 ${form.consultationStartTime}`, 'YYYY-MM-DD HH:mm A');
            const endTime = moment(`1970-01-01 ${form.consultationEndTime}`, 'YYYY-MM-DD HH:mm A');
            if (!startTime.isBefore(endTime)) {
                errors.consultationStartTime = "Start time must be before end time";
                errors.consultationEndTime = "End time must be after start time";
            }
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                // Convert dates to ISO strings in Asia/Kolkata timezone
                const consultationDays = form.consultationDays.map(date => moment.tz(date, "Asia/Kolkata").format('YYYY-MM-DD'));
                const payload = {
                    ...form,
                    consultationDays: consultationDays
                };
                //console.log("Payload being sent to the backend:", payload);
                if (isUpdating) {
                    await axios.put('http://localhost:5555/api/doctor/availability', payload, {
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    });
                    toast.success('Availability updated successfully', {
                        autoClose: 3000,
                        pauseOnHover: false,
                    });
                } else {
                    await axios.post('http://localhost:5555/api/doctor/availability', payload, {
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    });
                    toast.success('Availability created successfully', {
                        autoClose: 3000,
                        pauseOnHover: false,
                    });
                }
                setForm({
                    consultationStartTime: "",
                    consultationEndTime: "",
                    consultationTimePerPatient: "",
                    consultationDays: []
                });
                setIsUpdating(false);
            } catch (error) {
                console.error('Error managing availability', error);
                toast.error('Failed to manage availability');
                if (error.response && error.response.data && error.response.data.errors) {
                    setServerErrors(error.response.data.errors);
                } else {
                    setServerErrors([{ msg: 'Unknown server error occurred' }]);
                }
            }
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className='col-md-4'>
                <h1>{isUpdating ? 'Update Availability' : 'Create Availability'}</h1>
                {serverErrors.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                        {serverErrors.map((error, index) => (
                            <p key={index}>{error.msg}</p>
                        ))}
                    </div>
                )}
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
                    {errors.consultationStartTime && <span style={{ color: 'red' }}>{errors.consultationStartTime}<br /></span>}

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
                    {errors.consultationEndTime && <span style={{ color: 'red' }}>{errors.consultationEndTime}<br /></span>}

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
                    {errors.consultationTimePerPatient && <span style={{ color: 'red' }}>{errors.consultationTimePerPatient}<br /></span>}

                    <label>Consultation Days:</label>
                    <DatePicker
                    className='form-control'
                        multiple
                        value={form.consultationDays}
                        onChange={handleDateChange}
                        format="YYYY-MM-DD"
                    />
                    {errors.consultationDays && <span style={{ color: 'red' }}>{errors.consultationDays}<br /></span>}<br/>

                    <button className='btn btn-primary' type="submit">{isUpdating ? 'Update Availability' : 'Create Availability'}</button>
                </form>
            </div>
        </div>
    );
}

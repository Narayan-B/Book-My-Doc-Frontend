import { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate,Link } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        registrationNo: '',
        experienceCertificate: null,
        speciality: ''
    });
    const [checkEmail, setCheckEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [adminExists, setAdminExists] = useState(false);

    const handleAdminExists = async () => {
        try {
            const response = await axios.get('http://localhost:5555/api/adminExists');
            setAdminExists(response.data.adminExists);
        } catch (err) {
            console.error('Error checking email:', err);
        }
    };

    const checkEmailExists = async () => {
        const { email } = form;
        try {
            const response = await axios.get(`http://localhost:5555/api/users/checkEmail?email=${email}`);
            setCheckEmail(response.data.exists ? 'Email already exists' : '');
        } catch (error) {
            console.error('Error checking email:', error);
        }
    };

    const validationSchemaPatientAdmin = Yup.object({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
        .required('New Password is required'),
        role: Yup.string().required('Role is required')
    });

    const validationSchemaDoctor = Yup.object({
        ...validationSchemaPatientAdmin.fields,
        registrationNo: Yup.string().required('Registration number is required'),
        speciality: Yup.string().required('Speciality is required'),
        experienceCertificate: Yup.mixed().required('Experience certificate is required')
    });

    const handleSubmitPatientAdmin = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5555/api/users/register', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error registering patient/admin:', error);
        }
    };

    const handleSubmitDoctor = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5555/api/doctor/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error registering doctor:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let validationSchema;
            if (form.role === 'doctor') {
                validationSchema = validationSchemaDoctor;
            } else {
                validationSchema = validationSchemaPatientAdmin;
            }
            await validationSchema.validate(form, { abortEarly: false });
            setErrors({});
            if (form.role === 'patient' || form.role === 'admin') {
                handleSubmitPatientAdmin(form);
            } else {
                handleSubmitDoctor(form);
            }
            setForm({ username: '', email: '', password: '', role: '' });
            toast.success('Registration Success', {
                autoClose: 1000,
                onClose: () => {
                    navigate('/login');
                }
            });
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const validationErrors = {};
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
        if (name === 'experienceCertificate' && files[0] && files[0].type !== 'application/pdf') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                experienceCertificate: 'Invalid file type. Only PDF is allowed.'
            }));
            return;
        }

        setForm((prevForm) => ({
            ...prevForm,
            [name]: value === 'doctor' && name === 'role' ? value : value.trim(),
            experienceCertificate: name === 'experienceCertificate' ? files[0] : prevForm.experienceCertificate
        }));
    };

    return (
        <div className="col-md-3">
            <h3>Register Component</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username"><strong>Username:</strong></label>
                <input
                    className="form-control"
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                />
                {errors.username && <p style={{ color: 'red', margin: 0 }}>{errors.username}</p>}

                <label htmlFor="email"><strong>Email:</strong></label>
                <input
                    className="form-control"
                    type="text"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={checkEmailExists}
                />
                {checkEmail && <p style={{ color: 'red', margin: 0 }}>{checkEmail}</p>}
                {errors.email && <p style={{ color: 'red', margin: 0 }}>{errors.email}</p>}

                <label htmlFor="password"><strong>Password:</strong></label>
                <input
                    className="form-control"
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onPaste={(e)=>e.preventDefault()}
                    onChange={handleChange}
                />
                {errors.password && <p style={{ color: 'red', margin: 0 }}>{errors.password}</p>}

                <label htmlFor="role"><strong>Are you a?</strong></label>
                <select
                    className="form-control"
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    onFocus={handleAdminExists}
                >
                    <option value="">Select Role</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    {!adminExists && <option value="admin">Admin</option>}
                </select>
                {errors.role && <p style={{ color: 'red', margin: 0 }}>{errors.role}</p>}

                {form.role === 'doctor' && (
                    <>
                        <label htmlFor="registrationNo"><strong>Registration Number:</strong></label>
                        <input
                            className="form-control"
                            type="text"
                            id="registrationNo"
                            name="registrationNo"
                            value={form.registrationNo}
                            onChange={handleChange}
                        />
                        {errors.registrationNo && <p style={{ color: 'red', margin: 0 }}>{errors.registrationNo}</p>}

                        <label htmlFor="experienceCertificate"><strong>Experience Certificate:</strong></label>
                        <input
                            type="file"
                            id="experienceCertificate"
                            name="experienceCertificate"
                            onChange={handleChange}
                        />
                        {errors.experienceCertificate && (
                            <p style={{ color: 'red', margin: 0 }}>{errors.experienceCertificate}</p>
                        )}

                        <label htmlFor="speciality"><strong>Speciality:</strong></label>
                        <input
                            className="form-control"
                            type="text"
                            id="speciality"
                            name="speciality"
                            value={form.speciality}
                            onChange={handleChange}
                        />
                        {errors.speciality && <p style={{ color: 'red', margin: 0 }}>{errors.speciality}</p>}
                    </>
                )}

                <input className="btn btn-primary mt-3" type="submit" value="Register" />
               
            </form>
            <Link to='/login'>Already have account?</Link>
        </div>
    );
}

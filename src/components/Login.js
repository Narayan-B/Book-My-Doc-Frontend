import React, { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { startForgotPassword, clearForgotError } from '../actions/forgot-action';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    const [forgotEmail, setForgotEmail] = useState('');
    const [serverError, setServerError] = useState('');
    const [forgotEmailError, setForgotEmailError] = useState('');
    const [modal, setModal] = useState(false);
    const toggle = () => {
        // Reset form values and errors on modal toggle
        formik.resetForm();
        setForgotEmail('');
        setForgotEmailError('');
        setServerError('');
        setModal(!modal);
    };

    const handleInputChange = (e) => {
        setForgotEmail(e.target.value);
        dispatch(clearForgotError());
    };

    const dispatch = useDispatch();
    const error = useSelector(state => state.forgot.error);

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/\d/, 'Password must contain at least one number')
            .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
            .required('Password is required'),
    });

    const forgotPasswordSchema = Yup.object({
        forgotEmail: Yup.string().email('Invalid email format').required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.post('http://localhost:5555/api/users/login', values);
                console.log(response.data)
                localStorage.setItem('token', response.data.token);
                const userResponse = await axios.get('http://localhost:5555/api/users/account', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                handleLogin(userResponse.data);
                resetForm();
                toast.success('Login Success', {
                    autoClose: 1000,
                    onClose: () => {
                        navigate('/');
                    },
                });
            } catch (err) {
                setServerError(err.response.data);
            }
        },
    });

    const handleSubmitForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await forgotPasswordSchema.validate({ forgotEmail });
            setForgotEmailError(''); // Clear previous error
            dispatch(startForgotPassword(forgotEmail, toggle, navigate));
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setForgotEmailError(error.message);
            } else if (error.response && error.response.status === 404) {
                setForgotEmailError(error.response.data.message);
            } else {
                dispatch(startForgotPassword(error));
            }
        }
    };

    return (
        <section className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#0000FF' }}>
            <div className="container py-5">
                <div className="row d-flex justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-4 text-center">
                                <div className="mb-4 pb-4">
                                    <h2 className="fw-bold mb-3 text-uppercase">Login</h2>
                                    <p className="text-white-50 mb-3">Please enter your login and password!</p>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                id="email"
                                                name="email"
                                                onChange={formik.handleChange}
                                                onPaste={(e) => e.preventDefault()}
                                                value={formik.values.email}
                                                className="form-control form-control-lg"
                                                placeholder="Email"
                                            />
                                            {formik.touched.email && formik.errors.email && (
                                                <p className="text-danger mt-1 mb-0">{formik.errors.email}</p>
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                onPaste={(e) => e.preventDefault()}
                                                onChange={formik.handleChange}
                                                value={formik.values.password}
                                                className="form-control form-control-lg"
                                                placeholder="Password"
                                            />
                                            {formik.touched.password && formik.errors.password && (
                                                <p className="text-danger mt-1 mb-0">{formik.errors.password}</p>
                                            )}
                                        </div>
                                        {serverError && <p className="text-danger mt-2 mb-0">{serverError}</p>}
                                        <button className="btn btn-outline-light btn-lg px-4 mt-3" type="submit" disabled={formik.isSubmitting}>
                                            Login
                                        </button>
                                    </form>
                                    <p className="small mt-3 mb-0">
                                        <Link className="text-white-50"  onClick={toggle}>Forgot password?</Link>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-0">Don't have an account? <a href="/register" className="text-white-50 fw-bold">Sign Up</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>

                <ModalBody>
                    <form className="col-md-8">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Email to reset Password"
                            value={forgotEmail}
                            onChange={handleInputChange}
                        />
                        {forgotEmailError && (
                            <p className="text-danger mt-2 mb-0">{forgotEmailError}</p>
                        )}
                        {error && (
                            <p className="text-danger mt-2 mb-0">{error}</p>
                        )}
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button type="submit" color="primary" onClick={handleSubmitForgotPassword} className="mt-2">
                        Submit
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
                
            </Modal>
        </section>
    );
}

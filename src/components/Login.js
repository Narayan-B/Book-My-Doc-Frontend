import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { startForgotPassword,clearForgotError } from '../actions/forgot-action';
import { useDispatch, useSelector } from 'react-redux';


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
             // Clear any previous error when user starts typing
    };
    const dispatch = useDispatch();
    const error = useSelector(state => state.forgot.error);
    //console.log(error)

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
            await forgotPasswordSchema.validate({ forgotEmail});
            setForgotEmailError(''); // Clear previous error
            dispatch(startForgotPassword(forgotEmail,toggle,navigate))
           
           
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setForgotEmailError(error.message);
            } else if (error.response && error.response.status === 404) {
                setForgotEmailError(error.response.data.message);
            } else {
                dispatch(startForgotPassword(error))
            }
        }
    };
    return (
        <div className='col-md-3'>
            <h3>Login Component</h3>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label><br />
                    <input
                        type="text"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        onPaste={(e)=>e.preventDefault()}
                        value={formik.values.email}
                        className="form-control"
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{formik.errors.email}</p>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label><br />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onPaste={(e) => e.preventDefault()}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        className="form-control"
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{formik.errors.password}</p>
                    ) : null}
                </div>

                {serverError && <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{serverError}</p>}

                <input type="submit" value="Login" className="btn btn-primary mt-3" disabled={formik.isSubmitting} />
            </form>
            <Link onClick={toggle}>Forgot password?</Link>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Forgot Password</ModalHeader>
                <ModalBody>
                    <form className='col-md-8' >
                        <input
                            className='form-control'
                            type='text'
                            placeholder='Enter Email to reset Password'
                            value={forgotEmail}
                            onChange={handleInputChange}
                        />
                        
                        {forgotEmailError ? (
                            <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{forgotEmailError}</p>
                        ) : null}
                         {error ? (
                            <p style={{ color: 'red', marginTop: '5px', marginBottom: '0' }}>{error}</p>
                        ) : null}
                        

                        
                       
                    </form>
                </ModalBody>
                <ModalFooter>
                <Button type="submit" color="primary" onClick={handleSubmitForgotPassword}className="mt-2">
                            Submit
                        </Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        pincode: '',
        address: '',
        profilePic: null,
    });

    const [profileData, setProfileData] = useState(null);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [isProfileCreated, setIsProfileCreated] = useState(false);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/patient/profile`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                const data = response.data;
                setProfileData(data);

                if (data) {
                    setForm({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        mobile: data.mobile || '',
                        pincode: data.pincode || '',
                        address: data.address || '',
                        profilePic: null,
                    });
                    setIsProfileCreated(true);
                } else {
                    setIsProfileCreated(false);
                    setForm({
                        firstName: '',
                        lastName: '',
                        mobile: '',
                        pincode: '',
                        address: '',
                        profilePic: null,
                    });
                }
            } catch (error) {
                console.error('Error fetching profile details:', error);
                setIsProfileCreated(false);
                setServerErrors(error.response?.data?.errors || { _error: 'Failed to fetch profile details' });
            }
        };

        fetchProfileDetails();
    }, [user.role]);

    // Validation schema for creating a profile
    const createValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        mobile: Yup.string().required('Mobile Number is required'),
        pincode: Yup.string().required('Pincode is required'),
        address: Yup.string().required('Address is required'),
        profilePic: Yup.mixed()
            .required('Image is required')
            .test('fileType', 'Image must be jpeg or png', function(value) {
                if (!value) {
                    return false;
                }
                return ['image/jpeg', 'image/png'].includes(value.type);
            })
            .nullable(),
    });

    // Validation schema for editing a profile
    const editValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        mobile: Yup.string().required('Mobile Number is required'),
        pincode: Yup.string().required('Pincode is required'),
        address: Yup.string().required('Address is required'),
        profilePic: Yup.mixed()
            .test('fileType', 'Image must be jpeg or png', function(value) {
                if (!value) {
                    return true; // Allow no file for PUT request
                }
                return ['image/jpeg', 'image/png'].includes(value.type);
            })
            .nullable(),
    });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validationSchema = isProfileCreated ? editValidationSchema : createValidationSchema;
            await validationSchema.validate(form, { abortEarly: false });

            const formData = new FormData();
            formData.append('firstName', form.firstName);
            formData.append('lastName', form.lastName);
            formData.append('mobile', form.mobile);
            formData.append('pincode', form.pincode);
            formData.append('address', form.address);

            // Append profilePic only if it exists and is a File
            if (form.profilePic instanceof File) {
                formData.append('profilePic', form.profilePic);
            }

            let endpoint, method;
            if (isProfileCreated) {
                endpoint = `http://localhost:5555/api/patient/profile`;
                method = 'PUT';
            } else {
                endpoint = `http://localhost:5555/api/patient/profile`;
                method = 'POST';
            }

            const response = await axios({
                method: method,
                url: endpoint,
                data: formData,
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            });

            setForm(prevForm => ({
                ...prevForm,
                profilePic: null
            }));

            setIsEditMode(false);

            if (isProfileCreated) {
                toast.success('Profile updated Successfully', { autoClose: 1000 });
            } else {
                toast.success('Profile created Successfully', { autoClose: 1000 });
                setIsEditMode(true);
                setIsProfileCreated(true);
            }

            setTimeout(() => {
                window.location.reload();
            }, 1500);

            console.log('Profile updated:', response.data);
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const validationErrors = {};
                err.inner.forEach(error => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
                setServerErrors({});
            } else if (err.response && err.response.data && err.response.data.errors) {
                const serverValidationErrors = {};
                err.response.data.errors.forEach(error => {
                    serverValidationErrors[error.path] = error.msg;
                });
                setServerErrors(serverValidationErrors);
                setErrors({});
            } else {
                console.error('Error submitting form:', err);
                setServerErrors({ _error: 'An unexpected error occurred. Please try again.' });
            }
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
        setServerErrors(prevServerErrors => ({
            ...prevServerErrors,
            [name]: ''
        }));

        // Update form state based on input type
        if (name === 'profilePic') {
            setForm(prevForm => ({
                ...prevForm,
                profilePic: files.length > 0 ? files[0] : null
            }));
        } else {
            setForm(prevForm => ({
                ...prevForm,
                [name]: value
            }));
        }
    };

    // Toggle edit mode
    const handleEditClick = () => {
        setIsEditMode(true);
    };

    return (
        <div>
            <h4>{profileData ? "EDIT" : "ADD"} PROFILE</h4>
            <form onSubmit={handleSubmit}>
                <div className='col-md-4'>
                    <label htmlFor="firstName"><strong>First Name: </strong></label>
                    <input className='form-control' type="text" id="firstName" name="firstName" value={form.firstName} onChange={handleChange} disabled={!isEditMode && isProfileCreated} />
                    {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
                    {serverErrors.firstName && <p style={{ color: 'red' }}>{serverErrors.firstName}</p>}

                    <label htmlFor="lastName"><strong>Last Name: </strong></label>
                    <input className='form-control'type="text" id="lastName" name="lastName" value={form.lastName} onChange={handleChange} disabled={!isEditMode && isProfileCreated} />
                    {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
                    {serverErrors.lastName && <p style={{ color: 'red' }}>{serverErrors.lastName}</p>}
            
                    <label htmlFor="mobile"><strong>Mobile:</strong></label>
                    <input className='form-control'type="text" id="mobile" name="mobile" value={form.mobile} onChange={handleChange} disabled={!isEditMode && isProfileCreated} />
                    {errors.mobile && <p style={{ color: 'red' }}>{errors.mobile}</p>}
                    {serverErrors.mobile && <p style={{ color: 'red' }}>{serverErrors.mobile}</p>}
                
                    <label htmlFor="pincode"><strong>Pincode:</strong></label>
                    <input className='form-control'type="text" id="pincode" name="pincode" value={form.pincode} onChange={handleChange} disabled={!isEditMode && isProfileCreated} />
                    {errors.pincode && <p style={{ color: 'red' }}>{errors.pincode}</p>}
                    {serverErrors.pincode && <p style={{ color: 'red' }}>{serverErrors.pincode}</p>}
               
                    <label htmlFor="address"><strong>Address:</strong></label>
                    <input className='form-control'type="text" id="address" name="address" value={form.address} onChange={handleChange} disabled={!isEditMode && isProfileCreated} />
                    {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
                    {serverErrors.address && <p style={{ color: 'red' }}>{serverErrors.address}</p>}
              
                    <label htmlFor="profilePic"><strong>Profile Picture:</strong></label>
                    <input className='form-control'type="file" id="profilePic" name="profilePic" onChange={handleChange} disabled={!isEditMode && isProfileCreated} />
                    {errors.profilePic && <p style={{ color: 'red' }}>{errors.profilePic}</p>}
                    {serverErrors.profilePic && <p style={{ color: 'red' }}>{serverErrors.profilePic}</p>}
                
                    {isEditMode && (
                        <button className='btn btn-primary'type="submit">Submit Changes</button>
                    )}
                    {!isEditMode && !isProfileCreated && (
                        <button  className='btn btn-primary'type="submit">Create Profile</button>
                    )}
                    {!isEditMode && isProfileCreated && (
                        <button  className='btn btn-primary'type="button" onClick={handleEditClick}>Edit Profile</button>
                    )}
                </div>
            </form>
            {serverErrors._error && <p style={{ color: 'red' }}>{serverErrors._error}</p>}
        </div>
    );
};

export default Profile;

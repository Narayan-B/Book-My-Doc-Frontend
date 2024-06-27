// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as Yup from 'yup';
// import { toast } from 'react-toastify';
// import { useAuth } from '../context/AuthContext';

// const DoctorProfile = () => {
//     const { user } = useAuth();
//     const [form, setForm] = useState({
//         firstName: '',
//         lastName: '',
//         gender: '',
//         mobile: '',
//         profilePic: null,
//         hospitalName:'',
//         hospitalAddress: {
//             street: '',
//             city: '',
//             state: '',
//             pinCode: '',
//             country: ''
//         },
//         yearsOfExperience: ''
//     });

//     const [profileData, setProfileData] = useState(null);
//     const [errors, setErrors] = useState({});
//     const [serverErrors, setServerErrors] = useState({});
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [isProfileCreated, setIsProfileCreated] = useState(false);

//     useEffect(() => {
//         const fetchProfileDetails = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5555/api/${user.role}/profile`, {
//                     headers: {
//                         Authorization: localStorage.getItem('token')
//                     }
//                 });
//                 const data = response.data;
//                 setProfileData(data);

//                 if (data) {
//                     setForm({
//                         firstName: data.firstName || '',
//                         lastName: data.lastName || '',
//                         gender: data.gender || '',
//                         mobile: data.mobile || '',
//                         profilePic: null,
//                         hospitalName:data.hospitalName||'',
//                         hospitalAddress: {
//                             street: data.hospitalAddress.street || '',
//                             city: data.hospitalAddress.city || '',
//                             state: data.hospitalAddress.state || '',
//                             pinCode: data.hospitalAddress.pinCode || '',
//                             country: data.hospitalAddress.country || ''
//                         },
//                         yearsOfExperience: data.yearsOfExperience || ''
//                     });
//                     setIsProfileCreated(true);
//                 } else {
//                     setIsProfileCreated(false);
//                     setIsEditMode(true); // Enable edit mode if no profile is created
//                     setForm({
//                         firstName: '',
//                         lastName: '',
//                         gender: '',
//                         mobile: '',
//                         profilePic: null,
//                         hospitalName:'',
//                         hospitalAddress: {
//                             street: '',
//                             city: '',
//                             state: '',
//                             pinCode: '',
//                             country: ''
//                         },
//                         yearsOfExperience: null
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error fetching profile details:', error);
//                 setIsProfileCreated(false);
//                 setServerErrors(error.response?.data?.errors || { _error: 'Failed to fetch profile details' });
//             } 
//         };

//         fetchProfileDetails();
//     }, [user.role]);

//     const createValidationSchema = Yup.object().shape({
//         firstName: Yup.string().required('First Name is required'),
//         lastName: Yup.string().required('Last Name is required'),
//         gender: Yup.string().required('Gender is required').oneOf(['Male', 'Female', 'Other'], 'Invalid gender'),
//         mobile: Yup.string().required('Mobile Number is required'),
//         profilePic: Yup.mixed()
//             .required('Image is required')
//             .test('fileType', 'Image must be jpeg or png', function(value) {
//                 if (!value) {
//                     return false;
//                 }
//                 return ['image/jpeg', 'image/png'].includes(value.type);
//             }),
//         hospitalName: Yup.string().required('Hospital Name is required'),
//         hospitalAddress: Yup.object().shape({
//             street: Yup.string().required('Street Address is required'),
//             city: Yup.string().required('City is required'),
//             state: Yup.string().required('State is required'),
//             pinCode: Yup.string().required('Pincode is required'),
//             country: Yup.string().required('Country is required')
//         }),
//         yearsOfExperience: Yup.number().required('Years of Experience is required').typeError('Experience should be a number')
//     });
    
//     const editValidationSchema = Yup.object().shape({
//         firstName: Yup.string().required('First Name is required'),
//         lastName: Yup.string().required('Last Name is required'),
//         gender: Yup.string().required('Gender is required').oneOf(['Male', 'Female', 'Other'], 'Invalid gender'),
//         mobile: Yup.string().required('Mobile Number is required'),
//         profilePic: Yup.mixed()
//             .test('fileType', 'Image must be jpeg or png', function(value) {
//                 if (!value) {
//                     return true;
//                 }
//                 return ['image/jpeg', 'image/png'].includes(value.type);
//             })
//             .nullable(),
//         hospitalName: Yup.string().required('Hospital Name is required'),
//         hospitalAddress: Yup.object().shape({
//             street: Yup.string(),
//             city: Yup.string(),
//             state: Yup.string(),
//             pinCode: Yup.string(),
//             country: Yup.string()
//         }),
//         yearsOfExperience: Yup.number().required('Expereince is required')
//     });

        
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const validationSchema = isProfileCreated ? editValidationSchema : createValidationSchema;
//             await validationSchema.validate(form, { abortEarly: false });

//             const formData = new FormData();
//             formData.append('firstName', form.firstName);
//             formData.append('lastName', form.lastName);
//             formData.append('gender', form.gender);
//             formData.append('mobile', form.mobile);
//             formData.append('hospitalName',form.hospitalName)

//             if (form.profilePic instanceof File) {
//                 formData.append('profilePic', form.profilePic);
//             }
//             formData.append('hospitalAddress[street]', form.hospitalAddress.street);
//             formData.append('hospitalAddress[city]', form.hospitalAddress.city);
//             formData.append('hospitalAddress[state]', form.hospitalAddress.state);
//             formData.append('hospitalAddress[pinCode]', form.hospitalAddress.pinCode);
//             formData.append('hospitalAddress[country]', form.hospitalAddress.country);
//             formData.append('yearsOfExperience', form.yearsOfExperience);
//             let endpoint, method;
//             if (isProfileCreated) {
//                 endpoint = `http://localhost:5555/api/doctor/profile`;
//                 method = 'PUT';
//             } else {
//                 endpoint = `http://localhost:5555/api/doctor/profile`;
//                 method = 'POST';
//             }

//             const response = await axios({
//                 method: method,
//                 url: endpoint,
//                 data: formData,
//                 headers: {
//                     Authorization: localStorage.getItem('token'),
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });

//             setForm(prevForm => ({
//                 ...prevForm,
//                 profilePic: null
//             }));

//             setIsEditMode(false);

//             if (isProfileCreated) {
//                 toast.success('Profile updated Successfully', { autoClose: 1000 });
//             } else {
//                 toast.success('Profile created Successfully', { autoClose: 1000 });
//                 setIsEditMode(true);
//                 setIsProfileCreated(true);
//             }

//             setTimeout(() => {
//                 window.location.reload();
//             }, 1500);

//             console.log('Profile updated:', response.data);
//         } catch (err) {
//             if (err instanceof Yup.ValidationError) {
//                 const validationErrors = {};
                
//                 // Iterate over each validation error
//                 err.inner.forEach(error => {
//                     // Handle nested fields under hospitalAddress
//                     if (error.path.startsWith('hospitalAddress.')) {
//                         const nestedField = error.path.substring('hospitalAddress.'.length); // Extract nested field name
//                         validationErrors.hospitalAddress = {
//                             ...validationErrors.hospitalAddress,
//                             [nestedField]: error.message // Set error message for the nested field
//                         };
//                     } else {
//                         // Handle other top-level fields
//                         validationErrors[error.path] = error.message;
//                     }
//                 });
        
//                 // Update state with validation errors
//                 setErrors(validationErrors);
//                 setServerErrors({});
//             } else if (err.response && err.response.data && err.response.data.errors) {
//                 const serverValidationErrors = {};
                
//                 // Handle server validation errors similarly if needed
//                 err.response.data.errors.forEach(error => {
//                     serverValidationErrors[error.path] = error.msg;
//                 });
        
//                 setServerErrors(serverValidationErrors);
//                 setErrors({});
//             } else {
//                 console.error('Error submitting form:', err);
//                 setServerErrors({ _error: 'An unexpected error occurred. Please try again.' });
//             }
//         }
//     }
//     //console.log(errors)
    

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
    
//         setErrors(prevErrors => ({
//             ...prevErrors,
//             [name]: ''
//         }));
//         setServerErrors(prevServerErrors => ({
//             ...prevServerErrors,
//             [name]: ''
//         }));
    
//         const normalizedValue = name === 'gender' ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;
    
//         if (name === 'profilePic') {
//             const file = files[0];
//             setForm(prevForm => ({
//                 ...prevForm,
//                 profilePic: file
//             }));
//         } else if (name.startsWith('hospitalAddress')) {
//             const nestedName = name.substring(name.indexOf('.') + 1); // Extract nested field name
//             setForm(prevForm => ({
//                 ...prevForm,
//                 hospitalAddress: {
//                     ...prevForm.hospitalAddress,
//                     [nestedName]: normalizedValue
//                 }
//             }));
//         } else {
//             setForm(prevForm => ({
//                 ...prevForm,
//                 [name]: normalizedValue
//             }));
//         }
//     };
    



    

//     const handleEditClick = () => {
//         setIsEditMode(true);
//     };

//     return (
//         <div>
//             <h4>{isProfileCreated || profileData ? "EDIT" : "ADD"} PROFILE</h4>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="firstName">First Name:</label>
//                     <input type="text" id="firstName" name="firstName" value={form.firstName} onChange={handleChange} disabled={!isEditMode} />
//                     {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
//                     {serverErrors.firstName && <p style={{ color: 'red' }}>{serverErrors.firstName}</p>}
//                 </div>
//                 <div>
//                     <label htmlFor="lastName">Last Name:</label>
//                     <input type="text" id="lastName" name="lastName" value={form.lastName} onChange={handleChange} disabled={!isEditMode} />
//                     {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
//                     {serverErrors.lastName && <p style={{ color: 'red' }}>{serverErrors.lastName}</p>}
//                 </div>
//                 <div>
//                     <label htmlFor="gender">Gender:</label>
//                     <select id="gender" name="gender" value={form.gender} onChange={handleChange} disabled={!isEditMode}>
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                     </select>
//                     {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>}
//                 </div>
//                 <div>
//                     <label htmlFor="mobile">Mobile:</label>
//                     <input type="text" id="mobile" name="mobile" value={form.mobile} onChange={handleChange} disabled={!isEditMode} />
//                     {errors.mobile && <p style={{ color: 'red' }}>{errors.mobile}</p>}
//                     {serverErrors.mobile && <p style={{ color: 'red' }}>{serverErrors.mobile}</p>}
//                 </div>
//                 <div>
//                     <label htmlFor="profilePic">Profile Picture:</label>
//                     <input type="file" id="profilePic" name="profilePic" onChange={handleChange} disabled={!isEditMode} />
//                     {errors.profilePic && <p style={{ color: 'red' }}>{errors.profilePic}</p>}
//                     {serverErrors.profilePic && <p style={{ color: 'red' }}>{serverErrors.profilePic}</p>}
//                 </div>
//                 <div>
//                 <label htmlFor="hospitalName">Hospital Name:</label>
//                     <input type="text" id="hospitalName" name="hospitalName" value={form.hospitalName} onChange={handleChange} disabled={!isEditMode} />
//                     {errors.hospitalName && <p style={{ color: 'red' }}>{errors.hospitalName}</p>}
//                     {serverErrors.hospitalName && <p style={{ color: 'red' }}>{serverErrors.hospitalName}</p>}
//                 </div>
//                 <div>
//                     <label htmlFor="hospitalAddress.street">Street:</label>
//                     <input type="text" id="hospitalAddress.street" name="hospitalAddress.street" value={form.hospitalAddress.street} onChange={handleChange} disabled={!isEditMode} />
//                     {errors.hospitalAddress && <p style={{ color: 'red' }}>{errors.hospitalAddress?.street}</p>}
//                 </div>
//                 <div>
//                     <label htmlFor="hospitalAddress.city">City:</label>
//                     <input type="text" id="hospitalAddress.city" name="hospitalAddress.city" value={form.hospitalAddress.city} onChange={handleChange} disabled={!isEditMode} />
//                     {errors.hospitalAddress?.city && <p style={{ color: 'red' }}>{errors.hospitalAddress?.city}</p>}
//                 </div>
//                 <div>
//                     <label htmlFor="hospitalAddress.state">State:</label>
//                     <input type="text" id="hospitalAddress.state" name="hospitalAddress.state" value={form.hospitalAddress.state} onChange={handleChange} disabled={!isEditMode} />
//                     {errors.hospitalAddress?.state && <p style={{ color: 'red' }}>{errors.hospitalAddress?.state}</p>}
//                 </div>
//                 <div>
//                     <label htmlFor="hospitalAddress.pinCode">Pincode:</label>
//                     <input type="text" id="hospitalAddress.pinCode" name="hospitalAddress.pinCode" value={form.hospitalAddress.pinCode} onChange={handleChange} disabled={!isEditMode} />
//                     {errors.hospitalAddress?.pinCode && <p style={{ color: 'red' }}>{errors.hospitalAddress?.pinCode}</p>}
//                 </div>
//                 <div>
//                     <label htmlFor="hospitalAddress.country">Country:</label>
//                     <input type="text" id="hospitalAddress.country" name="hospitalAddress.country" value={form.hospitalAddress.country} onChange={handleChange} disabled={!isEditMode} />
//                     {errors.hospitalAddress?.country && <p style={{ color: 'red' }}>{errors.hospitalAddress?.country}</p>}
//                 </div>
//                 <div>
//                     <label htmlFor="yearsOfExperience">Years of Experience:</label>
//                     <input type="text" id="yearsOfExperience" name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange} disabled={!isEditMode} />
//                     {errors.yearsOfExperience && <p style={{ color: 'red' }}>{errors.yearsOfExperience}</p>}
//                 </div>
//                 <div>
//                 {isEditMode && (
//                     <button type="submit">{isProfileCreated ? 'Submit Changes' : 'Create Profile'}</button>)}
//                     {!isEditMode && !isProfileCreated && (
//                         <button type="submit">Create Profile</button>
//                         )}
//                     {!isEditMode && isProfileCreated && (
//                         <button type="button" onClick={handleEditClick}>Edit Profile</button>
//                     )}
//                 </div>
//             </form>
//             {serverErrors._error && <p style={{ color: 'red' }}>{serverErrors._error}</p>}
//         </div>
//     );
// };

// export default DoctorProfile;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Country, State, City } from 'country-state-city';

const DoctorProfile = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        mobile: '',
        profilePic: null,
        hospitalName: '',
        hospitalAddress: {
            street: '',
            city: '',
            state: '',
            pinCode: '',
            country: ''
        },
        yearsOfExperience: ''
    });

    const [profileData, setProfileData] = useState(null);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [isProfileCreated, setIsProfileCreated] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/doctor/profile`, {
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
                        gender: data.gender || '',
                        mobile: data.mobile || '',
                        profilePic: null,
                        hospitalName: data.hospitalName || '',
                        hospitalAddress: {
                            street: data.hospitalAddress.street || '',
                            city: data.hospitalAddress.city || '',
                            state: data.hospitalAddress.state || '',
                            pinCode: data.hospitalAddress.pinCode || '',
                            country: data.hospitalAddress.country || ''
                        },
                        yearsOfExperience: data.yearsOfExperience || ''
                    });
                    setIsProfileCreated(true);
                } else {
                    setIsProfileCreated(false);
                    setIsEditMode(true); // Enable edit mode if no profile is created
                    setForm({
                        firstName: '',
                        lastName: '',
                        gender: '',
                        mobile: '',
                        profilePic: null,
                        hospitalName: '',
                        hospitalAddress: {
                            street: '',
                            city: '',
                            state: '',
                            pinCode: '',
                            country: ''
                        },
                        yearsOfExperience: ''
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

    useEffect(() => {
        setCountryList(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (form.hospitalAddress.country) {
            const states = State.getStatesOfCountry(form.hospitalAddress.country);
            setStateList(states);
        } else {
            setStateList([]);
        }
    }, [form.hospitalAddress.country]);

    useEffect(() => {
        if (form.hospitalAddress.state) {
            const cities = City.getCitiesOfState(form.hospitalAddress.country, form.hospitalAddress.state);
            setCityList(cities);
        } else {
            setCityList([]);
        }
    }, [form.hospitalAddress.state, form.hospitalAddress.country]);

    const createValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        gender: Yup.string().required('Gender is required').oneOf(['Male', 'Female', 'Other'], 'Invalid gender'),
        mobile: Yup.string().required('Mobile Number is required'),
        profilePic: Yup.mixed()
            .required('Image is required')
            .test('fileType', 'Image must be jpeg or png', function(value) {
                if (!value) {
                    return false;
                }
                return ['image/jpeg', 'image/png'].includes(value.type);
            }),
        hospitalName: Yup.string().required('Hospital Name is required'),
        hospitalAddress: Yup.object().shape({
            street: Yup.string().required('Street Address is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            pinCode: Yup.string().required('Pincode is required'),
            country: Yup.string().required('Country is required')
        }),
        yearsOfExperience: Yup.number().required('Years of Experience is required').typeError('Experience should be a number')
    });

    const editValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        gender: Yup.string().required('Gender is required').oneOf(['Male', 'Female', 'Other'], 'Invalid gender'),
        mobile: Yup.string().required('Mobile Number is required'),
        profilePic: Yup.mixed()
            .test('fileType', 'Image must be jpeg or png', function(value) {
                if (!value) {
                    return true;
                }
                return ['image/jpeg', 'image/png'].includes(value.type);
            })
            .nullable(),
        hospitalName: Yup.string().required('Hospital Name is required'),
        hospitalAddress: Yup.object().shape({
            street: Yup.string(),
            city: Yup.string(),
            state: Yup.string(),
            pinCode: Yup.string(),
            country: Yup.string()
        }),
        yearsOfExperience: Yup.number().required('Experience is required')
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validationSchema = isProfileCreated ? editValidationSchema : createValidationSchema;
            await validationSchema.validate(form, { abortEarly: false });

            const formData = new FormData();
            formData.append('firstName', form.firstName);
            formData.append('lastName', form.lastName);
            formData.append('gender', form.gender);
            formData.append('mobile', form.mobile);
            formData.append('hospitalName', form.hospitalName);

            if (form.profilePic instanceof File) {
                formData.append('profilePic', form.profilePic);
            }
            formData.append('hospitalAddress[street]', form.hospitalAddress.street);
            formData.append('hospitalAddress[city]', form.hospitalAddress.city);
            formData.append('hospitalAddress[state]', form.hospitalAddress.state);
            formData.append('hospitalAddress[pinCode]', form.hospitalAddress.pinCode);
            formData.append('hospitalAddress[country]', form.hospitalAddress.country);
            formData.append('yearsOfExperience', form.yearsOfExperience);

            let endpoint, method;
            if (isProfileCreated) {
                endpoint = `http://localhost:5555/api/doctor/profile`;
                method = 'PUT';
            } else {
                endpoint = `http://localhost:5555/api/doctor/profile`;
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
                    if (error.path.startsWith('hospitalAddress.')) {
                        const nestedField = error.path.substring('hospitalAddress.'.length);
                        validationErrors.hospitalAddress = {
                            ...validationErrors.hospitalAddress,
                            [nestedField]: error.message
                        };
                    } else {
                        validationErrors[error.path] = error.message;
                    }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const handleHospitalAddressChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            hospitalAddress: {
                ...prevForm.hospitalAddress,
                [name]: value
            }
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            hospitalAddress: {
                ...prevErrors.hospitalAddress,
                [name]: ''
            }
        }));
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleCancelClick = () => {
        setIsEditMode(false);
        if (profileData) {
            setForm({
                firstName: profileData.firstName || '',
                lastName: profileData.lastName || '',
                gender: profileData.gender || '',
                mobile: profileData.mobile || '',
                profilePic: null,
                hospitalName: profileData.hospitalName || '',
                hospitalAddress: {
                    street: profileData.hospitalAddress.street || '',
                    city: profileData.hospitalAddress.city || '',
                    state: profileData.hospitalAddress.state || '',
                    pinCode: profileData.hospitalAddress.pinCode || '',
                    country: profileData.hospitalAddress.country || ''
                },
                yearsOfExperience: profileData.yearsOfExperience || ''
            });
        } else {
            setForm({
                firstName: '',
                lastName: '',
                gender: '',
                mobile: '',
                profilePic: null,
                hospitalName: '',
                hospitalAddress: {
                    street: '',
                    city: '',
                    state: '',
                    pinCode: '',
                    country: ''
                },
                yearsOfExperience: ''
            });
        }
    };

    return (
        <div className='col-md-4'>
            <h2>Doctor Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName"><strong>First Name:</strong></label>
                    <input
                        className='form-control'
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    />
                    {errors.firstName && <span style={{ color: 'red', margin: 0 }}>{errors.firstName}</span>}
                    {serverErrors.firstName && <span className="error">{serverErrors.firstName}</span>}
                </div>
                <div>
                    <label htmlFor="lastName"><strong>Last Name:</strong></label>
                    <input
                        className='form-control'
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    />
                    {errors.lastName && <span style={{ color: 'red', margin: 0 }}>{errors.lastName}</span>}
                    {serverErrors.lastName && <span className="error">{serverErrors.lastName}</span>}
                </div>
                <div>
                    <label htmlFor="gender"><strong>Gender:</strong></label>
                    <select
                        className='form-control'
                        id="gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span style={{ color: 'red', margin: 0 }} className="error">{errors.gender}</span>}
                    {serverErrors.gender && <span className="error">{serverErrors.gender}</span>}
                </div>
                <div>
                    <label htmlFor="mobile"><strong>Mobile:</strong></label>
                    <input
                        className='form-control'
                        type="text"
                        id="mobile"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    />
                    {errors.mobile && <span style={{ color: 'red' }}>{errors.mobile}</span>}
                    {serverErrors.mobile && <span className="error">{serverErrors.mobile}</span>}
                </div>
                <div>
                    <label htmlFor="profilePic"><strong> Profile Picture:</strong></label>
                    <input
                        className='form-control'
                        type="file"
                        id="profilePic"
                        name="profilePic"
                        onChange={(e) => setForm({ ...form, profilePic: e.target.files[0] })}
                        disabled={!isEditMode}
                    />
                    {errors.profilePic && <span style={{ color: 'red' }}>{errors.profilePic}</span>}
                    {serverErrors.profilePic && <span className="error">{serverErrors.profilePic}</span>}
                </div>
                <div>
                    <label htmlFor="hospitalName"><strong>Hospital Name:</strong></label>
                    <input
                        className='form-control'
                        type="text"
                        id="hospitalName"
                        name="hospitalName"
                        value={form.hospitalName}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    />
                    {errors.hospitalName && <span style={{ color: 'red' }}>{errors.hospitalName}</span>}
                    {serverErrors.hospitalName && <span className="error">{serverErrors.hospitalName}</span>}
                </div>
                <div>
                    <label htmlFor="hospitalAddress.country"><strong>Country:</strong></label>
                    <select
                        className='form-control'
                        id="hospitalAddress.country"
                        name="country"
                        value={form.hospitalAddress.country}
                        onChange={handleHospitalAddressChange}
                        disabled={!isEditMode}
                    >
                        <option value="">Select Country</option>
                        {countryList.map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                        ))}
                    </select>
                    {errors.hospitalAddress?.country && <span style={{ color: 'red' }}>{errors.hospitalAddress.country}</span>}
                    {serverErrors['hospitalAddress.country'] && <span className="error">{serverErrors['hospitalAddress.country']}</span>}
                </div>
                <div>
                    <label htmlFor="hospitalAddress.state"><strong>State:</strong></label>
                    <select
                        className='form-control'
                        id="hospitalAddress.state"
                        name="state"
                        value={form.hospitalAddress.state}
                        onChange={handleHospitalAddressChange}
                        disabled={!isEditMode}
                    >
                        <option value="">Select State</option>
                        {stateList.map((state) => (
                            <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                        ))}
                    </select>
                    {errors.hospitalAddress?.state && <span style={{ color: 'red' }}>{errors.hospitalAddress.state}</span>}
                    {serverErrors['hospitalAddress.state'] && <span className="error">{serverErrors['hospitalAddress.state']}</span>}
                </div>
                <div>
                    <label htmlFor="hospitalAddress.city"><strong>City:</strong></label>
                    <select
                        className='form-control'
                        id="hospitalAddress.city"
                        name="city"
                        value={form.hospitalAddress.city}
                        onChange={handleHospitalAddressChange}
                        disabled={!isEditMode}
                    >
                        <option value="">Select City</option>
                        {cityList.map((city) => (
                            <option key={city.name} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                    {errors.hospitalAddress?.city && <span style={{ color: 'red' }}>{errors.hospitalAddress.city}</span>}
                    {serverErrors['hospitalAddress.city'] && <span className="error">{serverErrors['hospitalAddress.city']}</span>}
                </div>
                <div>
                    <label htmlFor="hospitalAddress.street"><strong>Street Address:</strong></label>
                    <input
                        className='form-control'
                        type="text"
                        id="hospitalAddress.street"
                        name="street"
                        value={form.hospitalAddress.street}
                        onChange={handleHospitalAddressChange}
                        disabled={!isEditMode}
                    />
                    {errors.hospitalAddress?.street && <span style={{ color: 'red' }}>{errors.hospitalAddress.street}</span>}
                    {serverErrors['hospitalAddress.street'] && <span className="error">{serverErrors['hospitalAddress.street']}</span>}
                </div>
                <div>
                    <label htmlFor="hospitalAddress.pinCode"><strong>Pincode:</strong></label>
                    <input
                        className='form-control'
                        type="text"
                        id="hospitalAddress.pinCode"
                        name="pinCode"
                        value={form.hospitalAddress.pinCode}
                        onChange={handleHospitalAddressChange}
                        disabled={!isEditMode}
                    />
                    {errors.hospitalAddress?.pinCode && <span style={{ color: 'red' }}>{errors.hospitalAddress.pinCode}</span>}
                    {serverErrors['hospitalAddress.pinCode'] && <span className="error">{serverErrors['hospitalAddress.pinCode']}</span>}
                </div>
                <div>
                    <label htmlFor="yearsOfExperience"><strong>Years of Experience:</strong></label>
                    <input
                        className='form-control'
                        type="number"
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        value={form.yearsOfExperience}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    />
                    {errors.yearsOfExperience && <span style={{ color: 'red' }}>{errors.yearsOfExperience}</span>}
                    {serverErrors.yearsOfExperience && <span className="error">{serverErrors.yearsOfExperience}</span>}
                </div>
                <div>
                    {isEditMode && <button className='btn btn-danger' type="button" onClick={handleCancelClick}>Cancel</button>}
                    {!isEditMode && <button className='btn btn-warning' type="button" onClick={handleEditClick}>Edit</button>}
                    <button type="submit" className='btn btn-primary' disabled={!isEditMode}>Save</button>
                </div>
            </form>
        </div>
    );
};

export default DoctorProfile;

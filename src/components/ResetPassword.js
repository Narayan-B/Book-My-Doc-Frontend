import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { startResetPassword } from '../actions/reset-action';
import { useNavigate } from 'react-router-dom';
function ResetPassword(props) {
  const email = useSelector((state) => state.forgot.email);
  const error = useSelector((state) => state.reset.error);
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const [modal, setModal] = useState(true); // Set initial state to true to show modal
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
  const [otpError, setOtpError] = useState(''); // State to store OTP specific error

  const toggle = () => setModal(!modal);

  const resetPasswordSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
      .required('OTP is required'),
      newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
      .required('New Password is required'),
  });
  const formik = useFormik({
    initialValues: {
      otp: '',
      newPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      console.log('Form submitted'); // Check if this log appears
      try {
        await formik.validateForm(); // Validate form using Formik's built-in validation
        await dispatch(startResetPassword({ email, otp: values.otp, newPassword: values.newPassword },toggle,navigate));
        setFormSubmitted(true); 
      } catch (error) {
        console.error('Error:', error); // Log any errors
        if (error.response && error.response.status === 400) {
          // Handle specific OTP validation error here
          setOtpError('Invalid OTP. Please check and try again.');
        } else {
          setOtpError('Failed to reset password. Please try again later.');
        }
      }
    },
  });

  // Function to reset error states when modal is closed
  const resetErrors = () => {
    setOtpError('');
  };

  // Effect to reset error state when error changes
  useEffect(() => {
    if (error) {
      setOtpError(error);
    }
  }, [error]);

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} {...props} onClosed={resetErrors}>
        <ModalHeader toggle={toggle}>Reset Password</ModalHeader>
        <ModalBody>
          {formSubmitted && otpError && (
            <div className="alert alert-danger">{otpError}</div>
          )}
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                className={`form-control ${formik.touched.otp && formik.errors.otp ? 'is-invalid' : ''}`}
                id="otp"
                name="otp"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.otp && formik.errors.otp ? (
                <div className="invalid-feedback">{formik.errors.otp}</div>
              ) : null}
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                className={`form-control ${formik.touched.newPassword && formik.errors.newPassword ? 'is-invalid' : ''}`}
                id="newPassword"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <div className="invalid-feedback">{formik.errors.newPassword}</div>
              ) : null}
            </div>
            <Button color="primary" type="submit">
              Reset Password
            </Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ResetPassword;

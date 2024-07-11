import axios from 'axios';
import { toast } from 'react-toastify';
export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_FAILURE = 'FORGOT_PASSWORD_FAILURE';
export const CLEAR_FORGOT_ERROR="CLEAR_FORGOT_ERROR"

export const startForgotPassword = (email,toggle,navigate) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('http://localhost:5555/api/forgot-password', { email });
      console.log(response.data)
      dispatch(forgotPasswordSuccess(email))
      toast.success('Email sent successfully');
      toggle()
       setTimeout(()=>{
        navigate('/reset-password')
      },3000)
    } catch (err) {
        console.log(err)
      dispatch(forgotPasswordFailure(err?.response?.data?.message ))
    }
  };
};


const forgotPasswordSuccess = (email) => ({
    type: FORGOT_PASSWORD_REQUEST,
    payload: {email }, // Include email in payload
  });


const forgotPasswordFailure = (error) => ({
  type: FORGOT_PASSWORD_FAILURE,
  payload: error,
});


export const clearForgotError = () => ({
    type: CLEAR_FORGOT_ERROR,
  });
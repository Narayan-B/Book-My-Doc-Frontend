import axios from 'axios';
import { toast } from 'react-toastify';


export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';

export const resetPasswordRequest = () => ({
  type: RESET_PASSWORD_REQUEST,
  
});

export const resetPasswordSuccess = (formData) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload:formData
});

export const resetPasswordFailure = (error) => ({
  type: RESET_PASSWORD_FAILURE,
  payload: error,
});

export const startResetPassword = (formData,toggle,navigate) => {
  return async (dispatch) => {
    dispatch(resetPasswordRequest());
    try {
      const response = await axios.post( 'http://localhost:5555/api/reset-password', formData );
      console.log(response.data);
      dispatch(resetPasswordSuccess(response.data));
      toggle()
      toast.success(response.data.message) ;
      navigate('/login')
    } catch (error) {
        console.log(error)
      dispatch(resetPasswordFailure(error.response?.data?.message));
    }
  };
};

// forgotReducer.js

import { CLEAR_FORGOT_ERROR, FORGOT_PASSWORD_FAILURE, FORGOT_PASSWORD_REQUEST } from '../actions/forgot-action';

const initialState = {
  email: '',
  error: '',
};

const forgotReducer = (state = initialState, action) => {
  switch (action.type) {
    case FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        email: action.payload.email, // Update state with relevant data from success action
        error: '',
      };
      
    case FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
      case CLEAR_FORGOT_ERROR:{
        return {...state,error:''}
      }
    default:
      return state;
  }
};

export default forgotReducer;

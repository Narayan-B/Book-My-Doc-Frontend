import { RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE, RESET_PASSWORD_REQUEST } from '../actions/reset-action'

const initialState = {
  msg:'',
  error:''
};

const resetReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        error: '',
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        msg:action.payload.message,
        error: '',
      };
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        error: action.payload,
        msg:''
      };
    default:
      return state;
  }
};

export default resetReducer;

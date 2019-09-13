import {
  SET_LOCAL_LOGIN_ERROR,
  SET_LOCAL_REGISTRATION_ERROR,
  RESET_ERRORS_STATE
} from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case SET_LOCAL_LOGIN_ERROR:
      return Object.assign({}, state, {
        localLoginErr: {
          ...action.payload
        }
      });
    case SET_LOCAL_REGISTRATION_ERROR:
      return Object.assign({}, state, {
        localRegistrationErr: {
          ...action.payload
        }
      });
    case RESET_ERRORS_STATE:
      return null;
    default:
      return state;
  }
};

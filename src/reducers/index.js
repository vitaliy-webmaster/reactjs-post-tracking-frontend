import { combineReducers } from 'redux';

import authReducer from './authReducer';
import dataReducer from './dataReducer';
import errorReducer from './errorReducer';
import { reducer as reduxFormReducer } from 'redux-form';

export default combineReducers({
  auth: authReducer,
  data: dataReducer,
  form: reduxFormReducer,
  error: errorReducer
});

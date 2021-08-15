import {combineReducers} from 'redux';
import authReducer from './auth';
import countingReducer from './counting';
import userReducer from './user';
import sessionReducer from './session';
import queryReducer from './query';

export default combineReducers({
  auth: authReducer,
  counting: countingReducer,
  user: userReducer,
  session: sessionReducer,
  query: queryReducer,
});

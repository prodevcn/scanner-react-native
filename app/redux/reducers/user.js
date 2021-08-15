import {SET_USER, REMOVE_USER} from '../../constants/actions';
const INITIAL_STATE = {
  user: null,
  token: null,
  errorMessage: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        errorMessage: null,
      };
    case REMOVE_USER:
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export default userReducer;

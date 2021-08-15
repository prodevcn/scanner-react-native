import {
  SET_CURRENT_SESSION,
  SET_SAVED_ITEMS,
  SAVE_NEW_ITEM,
} from '../../constants/actions';

const INITIAL_STATE = {
  fetching: false,
  errorMessage: null,
  currentSessionId: '',
  currentSession: null,
  savedSessions: [],
  test: [],
  savedItems: [],
};

const sessionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_SESSION:
      return {
        ...state,
        currentSessionId: action.payload,
      };
    case SET_SAVED_ITEMS:
      return {
        ...state,
        savedItems: action.payload,
      };
    case SAVE_NEW_ITEM:
      return {
        ...state,
        savedItems: action.payload,
      };
    default:
      return state;
  }
};

export default sessionReducer;

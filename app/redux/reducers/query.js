import {GENERAL_FETCHING} from '../../constants/actions';

const INITIAL_STATE = {
  fetching: false,
  errorMessage: null,
  queryData: [],
};

const queryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GENERAL_FETCHING.REQUEST:
      return {
        ...state,
        fetching: true,
        errorMessage: null,
      };
    case GENERAL_FETCHING.FAILURE:
      return {
        ...state,
        fetching: false,
        errorMessage: action.payload,
        queryData: [],
      };
    case GENERAL_FETCHING.SUCCESS:
      return {
        ...state,
        fetching: false,
        errorMessage: null,
        queryData: action.payload,
      };
    default:
      return state;
  }
};

export default queryReducer;

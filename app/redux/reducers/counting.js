import {
  CREATE_REPORT,
  GET_BALANCE,
  PERMITTED_SHELVES_FETCHING,
  PERMITTED_SESSIONS_FETCHING,
  SAVE_ITEMS,
  SAVE_GENERAL_ITEMS,
  SAVE_SPECIFIC_ITEMS,
  GET_REPORT_PRODUCT,
} from '../../constants/actions';

const INITIAL_STATE = {
  permittedShelves: [],
  permittedSessions: [],
  savedItems: [],
  savedGeneralItems: [],
  savedSpecificItems: [],
  reportProducts: [],
  generalShelves: [],
  fetchingCount: false,
  errorMessageCount: null,
};

const countingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PERMITTED_SHELVES_FETCHING.REQUEST:
      return {
        ...state,
        fetchingCount: true,
        errorMessageCount: null,
      };
    case PERMITTED_SHELVES_FETCHING.FAILURE:
      return {
        ...state,
        fetchingCount: false,
        permittedShelves: [],
        errorMessageCount: action.payload,
      };
    case PERMITTED_SHELVES_FETCHING.SUCCESS:
      return {
        ...state,
        fetchingCount: false,
        permittedShelves: action.payload,
        errorMessageCount: null,
      };
    case PERMITTED_SESSIONS_FETCHING.REQUEST:
      return {
        ...state,
        fetchingCount: true,
        errorMessageCount: null,
      };
    case PERMITTED_SESSIONS_FETCHING.FAILURE:
      return {
        ...state,
        fetchingCount: false,
        permittedSessions: [],
        errorMessageCount: action.payload,
      };
    case PERMITTED_SESSIONS_FETCHING.SUCCESS:
      return {
        ...state,
        fetchingCount: false,
        permittedSessions: action.payload,
        errorMessageCount: null,
      };
    case SAVE_ITEMS:
      return {
        ...state,
        savedItems: action.payload,
      };
    case SAVE_GENERAL_ITEMS:
      return {
        ...state,
        savedGeneralItems: action.payload,
      };
    case SAVE_SPECIFIC_ITEMS:
      return {
        ...state,
        savedSpecificItems: action.payload,
      };
    case CREATE_REPORT.REQUEST:
      return {
        ...state,
        fetchingCount: true,
      };
    case CREATE_REPORT.FAILURE:
      return {
        ...state,
        fetchingCount: false,
        errorMessageCount: action.payload,
      };
    case CREATE_REPORT.SUCCESS:
      return {
        ...state,
        errorMessageCount: null,
        fetchingCount: false,
      };
    case GET_BALANCE.REQUEST:
      return {
        ...state,
        fetchingCount: true,
      };
    case GET_BALANCE.FAILURE:
      return {
        ...state,
        fetchingCount: false,
        errorMessageCount: action.payload,
      };
    case GET_BALANCE.SUCCESS:
      return {
        ...state,
        errorMessageCount: null,
        fetchingCount: false,
      };
    case GET_REPORT_PRODUCT.REQUEST:
      return {
        ...state,
        fetchingCount: true,
        errorMessageCount: null,
      };
    case GET_REPORT_PRODUCT.FAILURE:
      return {
        ...state,
        fetchingCount: false,
        errorMessageCount: action.payload,
        reportProducts: [],
      };
    case GET_REPORT_PRODUCT.SUCCESS:
      return {
        ...state,
        fetchingCount: false,
        errorMessageCount: null,
        reportProducts: action.payload,
      };
    default:
      return state;
  }
};

export default countingReducer;

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const createRequestTypes = base => {
  const requestType = {};
  [REQUEST, SUCCESS, FAILURE].forEach(type => {
    requestType[type] = `${base}_${type}`;
  });
  return requestType;
};

/** auth actions */
export const AUTH = createRequestTypes('AUTH');
export const CHANGE_PASSWORD = createRequestTypes('CHANGE_PASSWORD');
export const LOGOUT = 'LOGOUT';

/** query actions */
export const GENERAL_FETCHING = createRequestTypes('GENERAL_FETCHING');
export const GET_REPORT_PRODUCT = createRequestTypes('GET_REPORT_PRODUCT');

/** counting actions */
export const PERMITTED_SHELVES_FETCHING = createRequestTypes(
  'PERMITTED_SHELVES_FETCHING',
);
export const PERMITTED_SESSIONS_FETCHING = createRequestTypes(
  'PERMITTED_SESSIONS_FETCHING',
);
export const CREATE_REPORT = createRequestTypes('CREATE_REPORT');
export const GET_BALANCE = createRequestTypes('GET_BALANCE');
export const SAVE_ITEMS = 'SAVE_ITEMS';
export const SAVE_GENERAL_ITEMS = 'SAVE_GENERAL_ITEMS';
export const SAVE_SPECIFIC_ITEMS = 'SAVE_SPECIFIC_ITEMS';

/** session actions */
export const SET_SAVED_ITEMS = 'SET_SAVED_ITEMS';
export const SAVE_NEW_ITEM = 'SAVE_NEW_ITEM';
export const SET_CURRENT_SESSION = 'SET_CURRENT_SESSION';

/** user actions */
export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';

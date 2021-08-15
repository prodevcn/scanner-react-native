import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTH,
  CHANGE_PASSWORD,
  LOGOUT,
  REMOVE_USER,
  SET_CURRENT_SESSION,
  SET_SAVED_ITEMS,
  SET_USER,
} from '../../constants/actions';
import {CreateAxios} from '../../utils/utilities';

/** check auth */
export const checkAuth = () => async dispatch => {
  dispatch({type: AUTH.REQUEST});
  const token = await AsyncStorage.getItem('token');
  const user = await AsyncStorage.getItem('user');
  const savedItems = await AsyncStorage.getItem('savedItems');
  const currentSessionId = await AsyncStorage.getItem('currentSessionId');
  if (token) {
    dispatch({
      type: SET_USER,
      payload: {user: JSON.parse(user), token: token},
    });
    dispatch({type: AUTH.SUCCESS});
    if (savedItems) {
      dispatch({
        type: SET_SAVED_ITEMS,
        payload: JSON.parse(savedItems).data,
      });
    }
    if (currentSessionId) {
      dispatch({
        type: SET_CURRENT_SESSION,
        payload: currentSessionId,
      });
    }
  } else {
    dispatch({type: AUTH.FAILURE});
  }
};

/** login */
export const login = userData => async dispatch => {
  dispatch({type: AUTH.REQUEST, payload: ''});
  return CreateAxios().then(axios =>
    axios
      .post('/user/signin', userData)
      .then(async res => {
        if (res?.data?.message) {
          dispatch({type: AUTH.FAILURE, payload: res.data.message});
        } else {
          await AsyncStorage.setItem('token', res.data.accessToken);
          await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
          const savedItems = await AsyncStorage.getItem('savedItems');
          const currentSessionId = await AsyncStorage.getItem(
            'currentSessionId',
          );
          if (savedItems) {
            dispatch({
              type: SET_SAVED_ITEMS,
              payload: JSON.parse(savedItems).data,
            });
          }
          if (currentSessionId) {
            dispatch({
              type: SET_CURRENT_SESSION,
              payload: currentSessionId,
            });
          }
          dispatch({
            type: SET_USER,
            payload: {user: res.data.user, token: res.data.accessToken},
          });
          dispatch({type: AUTH.SUCCESS, payload: ''});
        }
      })
      .catch(err => {
        if (err.response) {
          dispatch({
            type: AUTH.FAILURE,
            payload: err.response.data?.message,
          });
          setTimeout(() => {
            dispatch({
              type: AUTH.FAILURE,
              payload: null,
            });
          }, 2000);
        } else {
          dispatch({
            type: AUTH.FAILURE,
            payload:
              'This device can not connect to server, Please try again after a few minutes.',
          });
          setTimeout(() => {
            dispatch({
              type: AUTH.FAILURE,
              payload: null,
            });
          }, 2000);
        }
      }),
  );
};

/** change password */
export const changePassword = pwdData => dispatch => {
  dispatch({type: CHANGE_PASSWORD.REQUEST, payload: ''});
  return CreateAxios().then(axios =>
    axios
      .post('/user/change_password', {
        current_password: pwdData.current_password,
        new_password: pwdData.new_password,
      })
      .then(async res => {
        dispatch({type: CHANGE_PASSWORD.SUCCESS, payload: ''});
      })
      .catch(err => {
        if (err.response) {
          dispatch({
            type: CHANGE_PASSWORD.FAILURE,
            payload: err.response.data?.message,
          });
          setTimeout(() => {
            dispatch({
              type: CHANGE_PASSWORD.FAILURE,
              payload: null,
            });
          }, 2000);
        } else {
          dispatch({
            type: CHANGE_PASSWORD.FAILURE,
            payload:
              'This device can not connect to server, Please try again after a few minutes.',
          });
          setTimeout(() => {
            dispatch({
              type: CHANGE_PASSWORD.FAILURE,
              payload: null,
            });
          }, 2000);
        }
      }),
  );
};

/** logout */
export const logout = () => dispatch => {
  AsyncStorage.removeItem('user');
  AsyncStorage.removeItem('token');
  dispatch({type: REMOVE_USER});
  dispatch({type: LOGOUT});
};

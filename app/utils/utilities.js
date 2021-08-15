import client from 'axios';
import {API_URL} from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthorizationHeader = () =>
  new Promise(async resolve => {
    const accessToken = await AsyncStorage.getItem('token');
    if (accessToken) {
      resolve('Bearer ' + accessToken);
    } else {
      resolve(null);
    }
  });

export const CreateAxios = () =>
  new Promise(resolve => {
    getAuthorizationHeader().then(async authHeader => {
      const axios = client.create({
        baseURL: API_URL,
        validateStatus: status => status >= 200 && status < 300,
        headers: {'Content-Type': 'application/json'},
        timeout: 1000 * 5,
      });

      axios.interceptors.request.use(
        config => {
          if (authHeader) {
            config.headers.Authorization = authHeader;
          }
          return config;
        },
        error => {
          throw {boundaryId: 'FETCH_REQUEST', details: error};
        },
      );
      resolve(axios);
    });
  });

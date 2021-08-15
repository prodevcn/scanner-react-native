import XLSX from 'xlsx';
import {writeFile} from 'react-native-fs';
import {Platform} from 'react-native';
var RNFS = require('react-native-fs');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SAVE_NEW_ITEM,
  SET_CURRENT_SESSION,
  SET_SAVED_ITEMS,
} from '../../constants/actions';

const basePath = Platform.select({
  ios: RNFS.MainBundlePath,
  android: RNFS.ExternalDirectoryPath,
});

export const saveNewItem = data => {
  return async dispatch => {
    dispatch({type: SAVE_NEW_ITEM, payload: data});
    await AsyncStorage.setItem('savedItems', JSON.stringify({data: data}));
    return {message: 'success'};
  };
};

export const createNewSession = (prevSessionId, prevSavedItems) => dispatch => {
  const sessionId = Date.now();
  const newExcelFileName = sessionId.toString() + '.xlsx';
  const default_stylesheet = [
    {
      Part_Cod: '',
      Part_Nam: '',
      quantity: '',
      Location: '',
      Location2: '',
      Location3: '',
      Location4: '',
    },
  ];

  if (!prevSessionId) {
    var ws = XLSX.utils.json_to_sheet(default_stylesheet);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Prova');
    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
    var file = basePath + '/' + newExcelFileName;
    writeFile(file, wbout, 'ascii')
      .then(r => {
        console.log('[SUCCESS]:[XLSX_FILE_CREATE]');
      })
      .catch(e => {
        console.log('[ERROR]:[XLSX_FILE_CREATE]', e);
      });
    dispatch({type: SET_CURRENT_SESSION, payload: sessionId});
    AsyncStorage.setItem('currentSessionId', sessionId.toString());
  } else {
    if (prevSavedItems.length > 0) {
      const prevExcelFileName = sessionId.toString() + '.xlsx';
      var ws = XLSX.utils.json_to_sheet(prevSavedItems);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Prova');
      const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
      var file = basePath + '/' + prevExcelFileName;
      writeFile(file, wbout, 'ascii')
        .then(r => {
          console.log('[SUCCESS]:[XLSX_FILE_CREATE]');
        })
        .catch(e => {
          console.log('[ERROR]:[XLSX_FILE_CREATE]', e);
        });
      dispatch({type: SET_SAVED_ITEMS, payload: []});
    }

    dispatch({type: SET_CURRENT_SESSION, payload: sessionId});
    AsyncStorage.setItem('currentSessionId', sessionId.toString());
  }
};

export const saveSessionToExcel = (sessionId, savedItems) => dispatch => {
  const excelFileName = sessionId.toString() + '.xlsx';
  var ws = XLSX.utils.json_to_sheet(savedItems);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Prova');
  const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
  var file = basePath + '/' + excelFileName;
  writeFile(file, wbout, 'ascii')
    .then(r => {
      console.log('[SUCCESS]:[SAVE_SESSION_EXCEL]');
    })
    .catch(e => {
      console.log('[ERROR]:[SAVE_SESSION_EXCEL]', e);
    });
  dispatch({type: SET_CURRENT_SESSION, payload: null});
  dispatch({type: SET_SAVED_ITEMS, payload: []});
  AsyncStorage.removeItem('currentSessionId');
  AsyncStorage.removeItem('savedItems');
};

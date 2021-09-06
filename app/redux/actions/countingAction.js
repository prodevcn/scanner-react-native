import {
  CREATE_REPORT,
  GENERAL_FETCHING,
  GET_BALANCE,
  PERMITTED_SHELVES_FETCHING,
  PERMITTED_SESSIONS_FETCHING,
  SAVE_ITEMS,
  SAVE_GENERAL_ITEMS,
  SAVE_SPECIFIC_ITEMS,
  GET_REPORT_PRODUCT,
} from '../../constants/actions';
import {CreateAxios} from '../../utils/utilities';

export const fetchingPermittedSessions = () => dispatch => {
  dispatch({type: PERMITTED_SESSIONS_FETCHING.REQUEST});
  return CreateAxios().then(axios =>
    axios
      .get('/session')
      .then(res => {
        dispatch({
          type: PERMITTED_SESSIONS_FETCHING.SUCCESS,
          payload: res.data,
        });
        return res.data;
      })
      .catch(err => {
        console.log('[ERROR]:[PERMITTED_SESSIONS_FETCHING]', err);
        if (err.response) {
          dispatch({
            type: PERMITTED_SESSIONS_FETCHING.FAILURE,
            payload: err.response.data?.message,
          });
          setTimeout(() => {
            dispatch({
              type: PERMITTED_SESSIONS_FETCHING.FAILURE,
              payload: null,
            });
          }, 2000);
        } else {
          dispatch({
            type: PERMITTED_SESSIONS_FETCHING.FAILURE,
            payload:
              'This device can not connect to server, Please try again after a few minutes.',
          });
          setTimeout(() => {
            dispatch({
              type: PERMITTED_SESSIONS_FETCHING.FAILURE,
              payload: null,
            });
          }, 2000);
        }
      }),
  );
};

export const fetchingPermittedShelves = data => dispatch => {
  dispatch({type: PERMITTED_SHELVES_FETCHING.REQUEST});
  return CreateAxios().then(axios =>
    axios
      .post('/shelf/get_shelves', data)
      .then(res => {
        const fetchedData = res.data.filter(e => e.shelf !== null);
        dispatch({
          type: PERMITTED_SHELVES_FETCHING.SUCCESS,
          payload: fetchedData,
        });
        return fetchedData;
      })
      .catch(err => {
        console.log('[ERROR]:[PERMITTED_SHELVES_FETCHING]', err);
        if (err.response) {
          dispatch({
            type: PERMITTED_SHELVES_FETCHING.FAILURE,
            payload: err.response.data?.message,
          });
          setTimeout(() => {
            dispatch({
              type: PERMITTED_SHELVES_FETCHING.FAILURE,
              payload: null,
            });
          }, 2000);
        } else {
          dispatch({
            type: PERMITTED_SHELVES_FETCHING.FAILURE,
            payload:
              'This device can not connect to server, Please try again after a few minutes.',
          });
          setTimeout(() => {
            dispatch({
              type: PERMITTED_SHELVES_FETCHING.FAILURE,
              payload: null,
            });
          }, 2000);
        }
      }),
  );
};

export const getBalance = code => dispatch => {
  dispatch({type: GET_BALANCE.REQUEST});
  return CreateAxios().then(axios =>
    axios
      .post('/product/get_balance', {part_code: code})
      .then(res => {
        console.log('[SUCCESS]:[GET_BALANCE]');
        dispatch({type: GET_BALANCE.SUCCESS});
        return res.data;
      })
      .catch(err => {
        console.log('[ERROR]:[GET_BALANCE]', err);
        if (err.response) {
          dispatch({
            type: GET_BALANCE.FAILURE,
            payload: err.response.data?.message,
          });
          setTimeout(() => {
            dispatch({
              type: GET_BALANCE.FAILURE,
              payload: null,
            });
          }, 2000);
        } else {
          dispatch({
            type: GET_BALANCE.FAILURE,
            payload:
              'This device can not connect to server, Please try again after a few minutes.',
          });
          setTimeout(() => {
            dispatch({
              type: GET_BALANCE.FAILURE,
              payload: null,
            });
          }, 2000);
        }
      }),
  );
};

const createGeneralReportData = initialData => {
  let data = {
    shelf_id: initialData.mode === 'specific' ? initialData.shelf_id : '',
    shelf_code: initialData.shelf_code,
    round: initialData.round,
    session_id: initialData.session_id,
    mode: initialData.mode,
  };
  const items = initialData.items.map((item, index) => {
    return {
      name: item.name,
      part_code: item.part_code,
      system_qty: item.system_qty,
      count: item.count,
    };
  });
  data.items = items;
  return data;
};

export const createGeneralReport = data => dispatch => {
  const reportData = createGeneralReportData(data);
  console.log(reportData);
  return CreateAxios().then(axios =>
    axios
      .post('/report/create', reportData)
      .then(res => {
        dispatch({type: CREATE_REPORT.SUCCESS});
        if (data.mode === 'general') {
          dispatch({type: SAVE_GENERAL_ITEMS, payload: []});
        } else {
          dispatch({type: SAVE_SPECIFIC_ITEMS, payload: []});
        }

        return res.data;
      })
      .catch(err => {
        console.log('[ERROR]:[CREATE_REPORT]', err);
        if (err.response) {
          dispatch({
            type: GENERAL_FETCHING.FAILURE,
            payload: err.response.data?.message,
          });
          setTimeout(() => {
            dispatch({
              type: GENERAL_FETCHING.FAILURE,
              payload: null,
            });
          }, 2000);
        } else {
          dispatch({
            type: GENERAL_FETCHING.FAILURE,
            payload:
              'This device can not connect to server, Please try again after a few minutes.',
          });
          setTimeout(() => {
            dispatch({
              type: GENERAL_FETCHING.FAILURE,
              payload: null,
            });
          }, 2000);
        }
      }),
  );
};

export const getReportProduct = data => dispatch => {
  dispatch({type: GET_REPORT_PRODUCT.REQUEST});
  const code = {
    session_id: data.sessionId,
    shelf_id: data.shelfId,
    page: data.page,
  };
  return CreateAxios().then(axios =>
    axios
      .post('/report/get_products', code)
      .then(async res => {
        if (res.data) {
          console.log('[SUCCESS]:[QUERY_PRODUCT_CODE]');
          const willSaveData = res.data.map((e, index) => {
            return {
              Part_Cod: e.part_code,
              Part_Nam: e.name,
              Third_Count: e.third_count ? e.third_count : null,
              Cur_Cost: data.show_cost ? e.Cur_Cost : 'Not Permitted',
              Cur_Balan: data.show_balance ? e.Cur_Balan : 'Not Permitted',
              Location: e.Location || '',
              Location2: e.Location2 || '',
              Location3: e.Location3 || '',
              Location4: e.Location4 || '',
            };
          });
          dispatch({type: GET_REPORT_PRODUCT.SUCCESS, payload: willSaveData});
          return res.data;
        }
      })
      .catch(err => {
        if (err.response) {
          dispatch({
            type: GET_REPORT_PRODUCT.FAILURE,
            payload: err.response.data?.message,
          });
          setTimeout(() => {
            dispatch({
              type: GET_REPORT_PRODUCT.FAILURE,
              payload: null,
            });
          }, 2000);
        } else {
          dispatch({
            type: GET_REPORT_PRODUCT.FAILURE,
            payload:
              'This device can not connect to server, Please try again after a few minutes.',
          });
          setTimeout(() => {
            dispatch({
              type: GET_REPORT_PRODUCT.FAILURE,
              payload: null,
            });
          }, 2000);
        }
      }),
  );
};

export const saveItems = data => dispatch => {
  return dispatch({type: SAVE_ITEMS, payload: data});
};

export const saveGeneralItems = data => dispatch => {
  return dispatch({type: SAVE_GENERAL_ITEMS, payload: data});
};

export const saveSpecificItems = data => dispatch => {
  console.log(data);
  return dispatch({type: SAVE_SPECIFIC_ITEMS, payload: data});
};

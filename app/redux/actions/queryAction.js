import {GENERAL_FETCHING} from '../../constants/actions';
import {CreateAxios} from '../../utils/utilities';

/** inventory general fetching */
export const inventoryGeneralFetching = data => dispatch => {
  dispatch({type: GENERAL_FETCHING.REQUEST});
  const code = {
    code: data.code,
    page: data.page,
  };
  return CreateAxios().then(axios =>
    axios
      .post('/product/scan_code', code)
      .then(async res => {
        if (res.data) {
          console.log('[SUCCESS]:[QUERY_PRODUCT_CODE]');
          const willSaveData = res.data.map((e, index) => {
            return {
              Part_Cod: e.Part_Cod,
              Part_Nam: e.Part_Nam,
              Cur_Cost: data.show_cost ? e.Cur_Cost : 'Not Permitted',
              Cur_Balan: data.show_balance ? e.Cur_Balan : 'Not Permitted',
              Location: e.Location,
              Location2: e.Location2,
              Location3: e.Location3,
              Location4: e.Location4,
            };
          });
          dispatch({type: GENERAL_FETCHING.SUCCESS, payload: willSaveData});
          return res.data;
        }
      })
      .catch(err => {
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

export const clearSearchHistory = () => dispatch => {
  return dispatch({type: GENERAL_FETCHING.SUCCESS, payload: []});
};

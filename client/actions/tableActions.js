import Big from 'big.js';
import { decamelizeKeys } from 'humps';

// import { UPDATE_STORE } from './storeActions';
import storeService from '../services/storeService';
import { startFetch, stopFetch } from './baseActions';
import { alert } from './alertActions';


export const INIT_SETTINGS_BUSINESS_TABLE = 'INIT_SETTINGS_BUSINESS_TABLE';
export const UPDATE_SETTINGS_BUSINESS_TABLE_FIELD = 'UPDATE_SETTINGS_BUSINESS_TABLE_FIELD';

export const init = (storeId) => (dispatch) => {
  return dispatch({ type: INIT_SETTINGS_BUSINESS_TABLE, data: { storeId } });
};

export const updateField = (field, value) => (dispatch) => {
  return dispatch({ type: UPDATE_SETTINGS_BUSINESS_TABLE_FIELD, data: { field, value } });
};

export const save = (storeId, oldValue, newValue) => (dispatch) => {
  const initDefaultTableTurnTime = Big(oldValue);
  if (storeId && oldValue && newValue && !initDefaultTableTurnTime.eq(newValue)) {
    if (newValue.lt(initDefaultTableTurnTime)) {
      if (!confirm('This change will update all current table seat time, are you sure to update it?\n改動會更新現有的座檯限時，確認更改？')) {
        return;
      }
    }

    const defaultTableTurnTime = parseInt(newValue.toString());
    const data = { module: { defaultTableTurnTime } };
    dispatch(startFetch());

    return storeService.updateModule(storeId, decamelizeKeys(data)).then(res => {
      // HACK: since it will update store module, require refresht the angular container
      dispatch(stopFetch);
      window.top.location.reload();
    }).catch(err => {
      const msg = (err && err.message) ? err.message : 'Error occur during save';
      dispatch(alert('danger', msg));
      dispatch(stopFetch);
    });
  }
};

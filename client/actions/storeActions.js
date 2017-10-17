import storeService from '../services/storeService';
import map from 'lodash/map';

export const SET_STORES = 'SET_STORES';
export const UPDATE_STORE = 'UPDATE_STORE';
export const SWITCH_STORE = 'SWITCH_STORE';
export const CLEAR_STORE = 'CLEAR_STORE';

export function switchStore() {
  return {
    type: SWITCH_STORE,
  };
}

export function clearStore() {
  return {
    type: CLEAR_STORE,
  };
}

export function getStores(storeId){
  return dispatch => {
    return storeService.get(storeId)
      .then(data => {
        dispatch({
          type: SET_STORES,
          stores: map(data, (d) => d.store),
        });
      });
  };
}

export function updateStore(storeId, data){
  return dispatch => {
    return storeService.update(storeId, data)
      .then(data => {
        dispatch({
          type: UPDATE_STORE,
          data: data,
          id: storeId,
        });
      });
  };
}

export function getStoreModule(storeId){
  return dispatch => {
    return storeService.getModule(storeId)
      .then(data => {
        dispatch({
          type: UPDATE_STORE,
          data: data,
          id: storeId,
        });
        return { data };
      }).catch(error => ({ error }));
  };
}

export function updateStoreModule(storeId, data){
  return dispatch => {
    return storeService.updateModule(storeId, data)
      .then(data => {
        dispatch({
          type: UPDATE_STORE,
          data: data,
          id: storeId,

        });
      });
  };
}

export function getStorePermissions(storeId){
  return dispatch => {
    return storeService.getPermissions(storeId)
      .then(data => {
        dispatch({
          type: UPDATE_STORE,
          data: data,
          id: storeId,
        });
      });
  };
}

export function getStoreChainInfo(storeId){
  return dispatch => {
    return storeService.getChainInfo(storeId)
      .then(data => {
        dispatch({
          type: UPDATE_STORE,
          data: data,
          id: storeId,
        });
      });
  };
}

export function getStorePolicy(storeId){
  return dispatch => {
    return storeService.getPolicy(storeId)
      .then(data => {
        dispatch({
          type: UPDATE_STORE,
          data: data,
          id: storeId,
        });
      });
  };
}

export function updateStorePolicy(storeId){
  return dispatch => {
    return storeService.updatePolicy(storeId)
      .then(data => {
        dispatch({
          type: UPDATE_STORE,
          data: data,
          id: storeId,
        });
      });
  };
}

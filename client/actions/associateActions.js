import without from 'lodash/without';
import concat from 'lodash/concat';

import { HANDLE_PROMISE } from '../store/middlewares/handlePromiseMiddleware';
import { SET_PATH_STATE } from './baseActions';
import associateService from '../services/associateService';


export function getAssociate(storeId, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: associateService.get(storeId),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'associates',
        path: path,
      }
    }
  };
}

export function addAssociate(storeId, data, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: associateService.add(storeId, data),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'associates',
        path: path,
        callback: function (state, result){
          return concat(state, [result]);
        },
      }
    }
  };
}

export function createNewAssociate(storeId, data, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: associateService.create(storeId, data),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'associates',
        path: path,
        callback: function (state, result){
          return concat(state, [result]);
        },
      }
    }
  };
}

export function promoteAssociate(storeId, id, role_id, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: associateService.promote(storeId, id, role_id),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'associates',
        path: path,
        callback: function (state, result){
          return state;
        },
      }
    }
  };
}

export function removeAssociate(storeId, id, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: associateService.remove(storeId, id),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'associates',
        path: path,
        callback: function (state, result){
          return without(state, result);
        },
      }
    }
  };
}



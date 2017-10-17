import without from 'lodash/without';
import concat from 'lodash/concat';

import { HANDLE_PROMISE } from '../store/middlewares/handlePromiseMiddleware';
import { SET_PATH_STATE } from './baseActions';
import membershipLevelsService from '../services/membershipLevelsService';


export function getMembershipLevels(storeId, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: membershipLevelsService.getList(storeId),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'membership_level',
        path: path,
      }
    }
  };
}

export function getMembershipLevel(storeId, id, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: membershipLevelsService.getItem(storeId, id),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'memberships',
        path: path,
      }
    }
  };
}


export function createMembershipLevel(storeId, data, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: membershipLevelsService.createItem(storeId, data),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'membership_level',
        path: path,
        callback: function (state, result){
          return concat(state, [result]);
        },
      }
    }
  };
}

export function updateMembershipLevel(storeId, id, data, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: membershipLevelsService.updateItem(storeId, id, data),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'membership_level',
        path: path,
        callback: function (state, result){
          return state;
        },
      }
    }
  };
}


export function removeMembershipLevel(storeId, id, path) {
  return {
    [HANDLE_PROMISE]: {
      promise: membershipLevelsService.removeItem(storeId, id),
      actions: {
        type: SET_PATH_STATE,
        stateName: 'membership_level',
        path: path,
        callback: function (state, result){
          return without(state, result);
        },
      }
    }
  };
}



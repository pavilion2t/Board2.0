import { camelizeKeys, decamelizeKeys } from 'humps';
import uomGroupService from '~/services/uomGroupService';

export const CREATE_UOM_GROUP_REQUEST = 'CREATE_UOM_GROUP_REQUEST';
export const CREATE_UOM_GROUP_SUCCESS = 'CREATE_UOM_GROUP_SUCCESS';
export const CREATE_UOM_GROUP_FAILURE = 'CREATE_UOM_GROUP_FAILURE';
export const GET_UOM_GROUP_REQUEST = 'GET_UOM_GROUP_REQUEST';
export const GET_UOM_GROUP_SUCCESS = 'GET_UOM_GROUP_SUCCESS';
export const GET_UOM_GROUP_FAILURE = 'GET_UOM_GROUP_FAILURE';
export const GET_UOM_GROUPS_REQUEST = 'GET_UOM_GROUPS_REQUEST';
export const GET_UOM_GROUPS_SUCCESS = 'GET_UOM_GROUPS_SUCCESS';
export const GET_UOM_GROUPS_FAILURE = 'GET_UOM_GROUPS_FAILURE';
export const UPDATE_UOM_GROUP_REQUEST = 'UPDATE_UOM_GROUP_REQUEST';
export const UPDATE_UOM_GROUP_SUCCESS = 'UPDATE_UOM_GROUP_SUCCESS';
export const UPDATE_UOM_GROUP_FAILURE = 'UPDATE_UOM_GROUP_FAILURE';
export const REMOVE_UOM_GROUP_REQUEST = 'REMOVE_UOM_GROUP_REQUEST';
export const REMOVE_UOM_GROUP_SUCCESS = 'REMOVE_UOM_GROUP_SUCCESS';
export const REMOVE_UOM_GROUP_FAILURE = 'REMOVE_UOM_GROUP_FAILURE';

import {
  SET_ENTITIES,
  REMOVE_ENTITY
} from './entityActions';

export const getGroups = (storeId) => (dispatch) => {
  dispatch({ type: GET_UOM_GROUPS_REQUEST });
  return uomGroupService.getGroups(storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.data.unitGroups;
      if (data) {
        let entities = {};
        data.forEach(item => {
          let { id } = item;
          entities[id] = item;
        });
        dispatch({ type: GET_UOM_GROUPS_SUCCESS, data });
        dispatch({ type: SET_ENTITIES, collection: 'uomGroups', data: entities });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: GET_UOM_GROUPS_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: GET_UOM_GROUPS_FAILURE, error });
      return { error };
    });
};

export const getGroup = (storeId, id) => (dispatch) => {
  dispatch({ type: GET_UOM_GROUP_REQUEST });
  return uomGroupService.getGroup(storeId, id)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.unitGroup;
      if (data) {
        dispatch({ type: GET_UOM_GROUP_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: GET_UOM_GROUP_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: GET_UOM_GROUP_FAILURE, error });
      return { error };
    });
};

export const create = (data, storeId) => (dispatch) => {
  dispatch({ type: CREATE_UOM_GROUP_REQUEST });
  return uomGroupService.create(decamelizeKeys(data), storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.unitGroup;
      if (data) {
        dispatch({ type: CREATE_UOM_GROUP_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: CREATE_UOM_GROUP_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: CREATE_UOM_GROUP_FAILURE, error });
      return { error };
    });
};

export const update = (data, id, storeId) => (dispatch) => {
  dispatch({ type: UPDATE_UOM_GROUP_REQUEST });
  return uomGroupService.update(decamelizeKeys(data), id, storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.unitGroup;
      if (data) {
        dispatch({ type: UPDATE_UOM_GROUP_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: UPDATE_UOM_GROUP_FAILURE, error });
      }
    })
    .catch(error => {
      dispatch({ type: UPDATE_UOM_GROUP_FAILURE, error });
      return { error };
    });
};

export const remove = (id, storeId) => (dispatch) => {
  dispatch({ type: REMOVE_UOM_GROUP_REQUEST });
  return uomGroupService.remove(id, storeId)
    .then(resp => {
      let { message } = resp;
      if (message === 'success') {
        dispatch({ type: REMOVE_UOM_GROUP_SUCCESS });
        dispatch({ type: REMOVE_ENTITY, collection: 'uomGroups', id });
        return {};
      } else {
        let error = new Error(message);
        dispatch({ type: REMOVE_UOM_GROUP_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: REMOVE_UOM_GROUP_FAILURE, error });
      return { error };
    });
};

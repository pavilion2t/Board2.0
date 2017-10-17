import { camelizeKeys, decamelizeKeys } from 'humps';
import unitService from '~/services/unitService';
import { pick } from 'lodash';

export const CREATE_UNIT_REQUEST = 'CREATE_UNIT_REQUEST';
export const CREATE_UNIT_SUCCESS = 'CREATE_UNIT_SUCCESS';
export const CREATE_UNIT_FAILURE = 'CREATE_UNIT_FAILURE';
export const GET_UNIT_REQUEST = 'GET_UNIT_REQUEST';
export const GET_UNIT_SUCCESS = 'GET_UNIT_SUCCESS';
export const GET_UNIT_FAILURE = 'GET_UNIT_FAILURE';
export const GET_UNITS_REQUEST = 'GET_UNITS_REQUEST';
export const GET_UNITS_SUCCESS = 'GET_UNITS_SUCCESS';
export const GET_UNITS_FAILURE = 'GET_UNITS_FAILURE';
export const UPDATE_UNIT_REQUEST = 'UPDATE_UNIT_REQUEST';
export const UPDATE_UNIT_SUCCESS = 'UPDATE_UNIT_SUCCESS';
export const UPDATE_UNIT_FAILURE = 'UPDATE_UNIT_FAILURE';
export const REMOVE_UNIT_REQUEST = 'REMOVE_UNIT_REQUEST';
export const REMOVE_UNIT_SUCCESS = 'REMOVE_UNIT_SUCCESS';
export const REMOVE_UNIT_FAILURE = 'REMOVE_UNIT_FAILURE';

export const getUnits = (unitGroupId, storeId) => (dispatch) => {
  dispatch({ type: GET_UNITS_REQUEST });
  return unitService.getUnits(unitGroupId, storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.data.units;
      if (data) {
        dispatch({ type: GET_UNITS_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: GET_UNITS_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: GET_UNITS_FAILURE, error });
      return { error };
    });
};

export const getUnit = (storeId, id) => (dispatch) => {
  dispatch({ type: GET_UNIT_REQUEST });
  return unitService.getUnit(storeId, id)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.unit;
      if (data) {
        dispatch({ type: GET_UNIT_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: GET_UNIT_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: GET_UNIT_FAILURE, error });
      return { error };
    });
};

export const create = (data, unitGroupId, storeId) => (dispatch) => {
  dispatch({ type: CREATE_UNIT_REQUEST });
  return unitService.create(decamelizeKeys(data), unitGroupId, storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.unit;
      if (data) {
        dispatch({ type: CREATE_UNIT_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: CREATE_UNIT_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: CREATE_UNIT_FAILURE, error });
      return { error };
    });
};

export const update = (data, id, unitGroupId, storeId) => (dispatch) => {
  dispatch({ type: UPDATE_UNIT_REQUEST });
  data = pick(data, ['name', 'unitGroupId', 'ratio', 'isBaseUnit']);
  return unitService.update(decamelizeKeys(data), id, unitGroupId, storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.unit;
      if (data) {
        dispatch({ type: UPDATE_UNIT_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: UPDATE_UNIT_FAILURE, error });
      }
    })
    .catch(error => {
      dispatch({ type: UPDATE_UNIT_FAILURE, error });
      return { error };
    });
};

export const remove = (id, storeId) => (dispatch) => {
  dispatch({ type: REMOVE_UNIT_REQUEST });
  return unitService.remove(id, storeId)
    .then(resp => {
      let { message } = resp;
      if (message === 'success') {
        dispatch({ type: REMOVE_UNIT_SUCCESS });
        return {};
      } else {
        let error = new Error(message);
        dispatch({ type: REMOVE_UNIT_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: REMOVE_UNIT_FAILURE, error });
      return { error };
    });
};

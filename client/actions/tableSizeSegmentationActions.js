import { camelizeKeys, decamelizeKeys } from 'humps';
import tableSizeSegmentationService from '~/services/tableSizeSegmentationService';

export const GET_TABLE_SIZE_SEGMENTATION_REQUEST = 'GET_TABLE_SIZE_SEGMENTATION_REQUEST';
export const GET_TABLE_SIZE_SEGMENTATION_SUCCESS = 'GET_TABLE_SIZE_SEGMENTATION_SUCCESS';
export const GET_TABLE_SIZE_SEGMENTATION_FAILURE = 'GET_TABLE_SIZE_SEGMENTATION_FAILURE';
export const CREATE_TABLE_SIZE_SEGMENTATION_REQUEST = 'CREATE_TABLE_SIZE_SEGMENTATION_REQUEST';
export const CREATE_TABLE_SIZE_SEGMENTATION_SUCCESS = 'CREATE_TABLE_SIZE_SEGMENTATION_SUCCESS';
export const CREATE_TABLE_SIZE_SEGMENTATION_FAILURE = 'CREATE_TABLE_SIZE_SEGMENTATION_FAILURE';
export const UPDATE_TABLE_SIZE_SEGMENTATION_REQUEST = 'UPDATE_TABLE_SIZE_SEGMENTATION_REQUEST';
export const UPDATE_TABLE_SIZE_SEGMENTATION_SUCCESS = 'UPDATE_TABLE_SIZE_SEGMENTATION_SUCCESS';
export const UPDATE_TABLE_SIZE_SEGMENTATION_FAILURE = 'UPDATE_TABLE_SIZE_SEGMENTATION_FAILURE';
export const REMOVE_TABLE_SIZE_SEGMENTATION_REQUEST = 'REMOVE_TABLE_SIZE_SEGMENTATION_REQUEST';
export const REMOVE_TABLE_SIZE_SEGMENTATION_SUCCESS = 'REMOVE_TABLE_SIZE_SEGMENTATION_SUCCESS';
export const REMOVE_TABLE_SIZE_SEGMENTATION_FAILURE = 'REMOVE_TABLE_SIZE_SEGMENTATION_FAILURE';
export const REFRESH_QUEUEING_DISPLAY_REQUEST = 'REFRESH_QUEUEING_DISPLAY_REQUEST';
export const REFRESH_QUEUEING_DISPLAY_SUCCESS = 'REFRESH_QUEUEING_DISPLAY_SUCCESS';
export const REFRESH_QUEUEING_DISPLAY_FAILURE = 'REFRESH_QUEUEING_DISPLAY_FAILURE';
export const get = (storeId) => (dispatch) => {
  dispatch({ type: GET_TABLE_SIZE_SEGMENTATION_REQUEST });
  return tableSizeSegmentationService.get(storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.partySizeSegment;
      if (data) {
        dispatch({ type: GET_TABLE_SIZE_SEGMENTATION_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: GET_TABLE_SIZE_SEGMENTATION_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: GET_TABLE_SIZE_SEGMENTATION_FAILURE, error });
      return { error };
    });
};
export const create = (data, storeId) => (dispatch) => {
  dispatch({ type: CREATE_TABLE_SIZE_SEGMENTATION_REQUEST });
  return tableSizeSegmentationService.create(decamelizeKeys(data), storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.partySizeSegment;
      if (data) {
        dispatch({ type: CREATE_TABLE_SIZE_SEGMENTATION_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: CREATE_TABLE_SIZE_SEGMENTATION_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: CREATE_TABLE_SIZE_SEGMENTATION_FAILURE, error });
      return { error };
    });
};
export const update = (data, storeId) => (dispatch) => {
  dispatch({ type: UPDATE_TABLE_SIZE_SEGMENTATION_REQUEST });
  return tableSizeSegmentationService.update(decamelizeKeys(data), storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.partySizeSegment;
      if (data) {
        dispatch({ type: UPDATE_TABLE_SIZE_SEGMENTATION_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        dispatch({ type: UPDATE_TABLE_SIZE_SEGMENTATION_FAILURE, error });
      }
    })
    .catch(error => {
      dispatch({ type: UPDATE_TABLE_SIZE_SEGMENTATION_FAILURE, error });
      return { error };
    });
};
export const remove = (storeId) => (dispatch) => {
  dispatch({ type: REMOVE_TABLE_SIZE_SEGMENTATION_REQUEST });
  return tableSizeSegmentationService.remove(storeId)
    .then(resp => {
      let { message } = resp;
      if (message === 'success') {
        dispatch({ type: REMOVE_TABLE_SIZE_SEGMENTATION_SUCCESS });
        return {};
      } else {
        let error = new Error(message);
        dispatch({ type: REMOVE_TABLE_SIZE_SEGMENTATION_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: REMOVE_TABLE_SIZE_SEGMENTATION_FAILURE, error });
      return { error };
    });
};
export const refresh = (storeId) => (dispatch) => {
  dispatch({ type: REFRESH_QUEUEING_DISPLAY_REQUEST});
  return tableSizeSegmentationService.refresh(storeId)
    .then(resp => {
      dispatch({ type: REFRESH_QUEUEING_DISPLAY_SUCCESS });
      return {};
    })
    .catch(error => {
      dispatch({ type: REFRESH_QUEUEING_DISPLAY_FAILURE, error });
      return { error };
    });
};

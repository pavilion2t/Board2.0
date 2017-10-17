import lineItemStatusService from '~/services/lineItemStatusService';

import { startFetch, stopFetch } from './baseActions';

import {
  ADD_ENTITY,
  SET_ENTITIES,
  UPDATE_ENTITY,
  REMOVE_ENTITY
} from './entityActions';

export function createLineItemStatus(status, color, storeId) {
  return dispatch => {
    dispatch(startFetch());

    return lineItemStatusService.createLineItemStatus(status, color, storeId)
      .then(resp => {
        let { data, message } = resp;
        if (data) {
          const { id } = data;
          dispatch({ type: ADD_ENTITY, collection: 'lineItemStatuses', id, data: data});
          dispatch(stopFetch());
          return { data };
        }
        if (message) {
          return { error: new Error(message)};
        }
      })
      .catch(e => {
        dispatch(stopFetch());
        return { error: e };
      });
  };
}

export function getLineItemStatuses(storeId) {
  return dispatch => {
    dispatch(startFetch());

    return lineItemStatusService.getLineItemStatuses(storeId)
      .then(resp => {
        let { data, message } = resp;
        if (data) {
          let entities = {};
          if (data && data.line_item_statuses){
            data.line_item_statuses.forEach(s => {
              let { id } = s;
              entities[id] = s;
            });
          }
          dispatch({ type: SET_ENTITIES, collection: 'lineItemStatuses', data: entities });
          dispatch(stopFetch());
          return { data };
        }
        if (message) {
          return { error: new Error(message)};
        }
      })
      .catch(e => {
        dispatch(stopFetch());
        return { error: e };
      });
  };
}

export const updateLineItemStatus = (id, status, storeId) => (dispatch) => {
  dispatch(startFetch());

  return lineItemStatusService.updateLineItemStatus(id, status, storeId).then(resp => {
    dispatch(stopFetch());

    let { message } = resp;
    if (message === 'success') {
      dispatch({ type: UPDATE_ENTITY, collection: 'lineItemStatuses', id, data: status });
      return { error: null };
    } else {
      return { error: new Error(message)};
    }
  }).catch(e => {
    dispatch(stopFetch());

    return { error: e };
  });
};

export const removeLineItemStatus = (id, storeId) => (dispatch) => {
  dispatch(startFetch());

  return lineItemStatusService.removeLineItemStatus(id, storeId).then(resp => {
    dispatch(stopFetch());

    let { message } = resp;
    if (message === 'success') {
      dispatch({ type: REMOVE_ENTITY, collection: 'lineItemStatuses', id});
    } else {
      return { error: new Error(message)};
    }
  }).catch(e => {
    dispatch(stopFetch());

    return { error: e };
  });
};

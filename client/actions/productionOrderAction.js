import { camelizeKeys, decamelizeKeys } from 'humps';
import productionOrderService from '~/services/productionOrderService';

// import { startFetch, stopFetch } from './baseActions';

export const GET_PRODUCTION_ORDERS_REQUEST = 'GET_PRODUCTION_ORDERS_REQUEST';
export const GET_PRODUCTION_ORDERS_SUCCESS = 'GET_PRODUCTION_ORDERS_SUCCESS';
export const GET_PRODUCTION_ORDERS_FAILURE = 'GET_PRODUCTION_ORDERS_FAILURE';
export const GET_PRODUCTION_ORDER_REQUEST = 'GET_PRODUCTION_ORDER_REQUEST';
export const GET_PRODUCTION_ORDER_SUCCESS = 'GET_PRODUCTION_ORDER_SUCCESS';
export const GET_PRODUCTION_ORDER_FAILURE = 'GET_PRODUCTION_ORDER_FAILURE';
export const CREATE_PRODUCTION_ORDER_REQUEST = 'CREATE_PRODUCTION_ORDER_REQUEST';
export const CREATE_PRODUCTION_ORDER_SUCCESS = 'CREATE_PRODUCTION_ORDER_SUCCESS';
export const CREATE_PRODUCTION_ORDER_FAILURE = 'CREATE_PRODUCTION_ORDER_FAILURE';
export const UPDATE_PRODUCTION_ORDER_REQUEST = 'UPDATE_PRODUCTION_ORDER_REQUEST';
export const UPDATE_PRODUCTION_ORDER_SUCCESS = 'UPDATE_PRODUCTION_ORDER_SUCCESS';
export const UPDATE_PRODUCTION_ORDER_FAILURE = 'UPDATE_PRODUCTION_ORDER_FAILURE';
// export const REMOVE_PRODUCTION_ORDER_REQUEST = 'REMOVE_PRODUCTION_ORDER_REQUEST';
// export const REMOVE_PRODUCTION_ORDER_SUCCESS = 'REMOVE_PRODUCTION_ORDER_SUCCESS';
// export const REMOVE_PRODUCTION_ORDER_FAILURE = 'REMOVE_PRODUCTION_ORDER_FAILURE';
export const APPROVE_PRODUCTION_ORDER_REQUEST = 'APPROVE_PRODUCTION_ORDER_REQUEST';
export const APPROVE_PRODUCTION_ORDER_SUCCESS = 'APPROVE_PRODUCTION_ORDER_SUCCESS';
export const APPROVE_PRODUCTION_ORDER_FAILURE = 'APPROVE_PRODUCTION_ORDER_FAILURE';
export const FULFILL_PRODUCTION_ORDER_REQUEST = 'FULFILL_PRODUCTION_ORDER_REQUEST';
export const FULFILL_PRODUCTION_ORDER_SUCCESS = 'FULFILL_PRODUCTION_ORDER_SUCCESS';
export const FULFILL_PRODUCTION_ORDER_FAILURE = 'FULFILL_PRODUCTION_ORDER_FAILURE';
export const CANCEL_PRODUCTION_ORDER_REQUEST = 'CANCEL_PRODUCTION_ORDER_REQUEST';
export const CANCEL_PRODUCTION_ORDER_SUCCESS = 'CANCEL_PRODUCTION_ORDER_SUCCESS';
export const CANCEL_PRODUCTION_ORDER_FAILURE = 'CANCEL_PRODUCTION_ORDER_FAILURE';

import {
  SET_ENTITIES
  // UPDATE_ENTITY
} from './entityActions';

export const getProductionOrders = (storeId, page = 1, perPage = 25, orderBy = undefined, filters = []) => (dispatch) => {
  dispatch({ type: GET_PRODUCTION_ORDERS_REQUEST });
  // dispatch(startFetch());
  return productionOrderService.getOrders(storeId, page, perPage, orderBy, filters)
    .then(resp => {
      // dispatch(startFetch());
      resp = camelizeKeys(resp);
      let data = resp.data.productionOrders;
      if (data) {
        let entities = {};
        data.forEach(d => entities[d.id] = d);
        dispatch({ type: GET_PRODUCTION_ORDERS_SUCCESS, data });
        dispatch({ type: SET_ENTITIES, collection: 'productionOrders', data: entities });
        return resp;
      } else {
        let error = new Error('Invalid response.');
        dispatch({ type: GET_PRODUCTION_ORDERS_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      // dispatch(startFetch());
      dispatch({ type: GET_PRODUCTION_ORDERS_FAILURE, error });
      return { error };
    });
};

export const getProductionOrder = (id, storeId) => (dispatch) => {
  dispatch({ type: GET_PRODUCTION_ORDER_REQUEST });
  return productionOrderService.getOrder(id, storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.productionOrder;
      if (data) {
        dispatch({ type: GET_PRODUCTION_ORDER_SUCCESS, data });
        return { data };

      } else {
        let error = new Error('Invalid response.');
        dispatch({ type: GET_PRODUCTION_ORDER_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: GET_PRODUCTION_ORDER_FAILURE, error });
      return { error };
    });
};

export const create = (productionOrder, storeId) => (dispatch) => {
  dispatch({ type: CREATE_PRODUCTION_ORDER_REQUEST });
  return productionOrderService.create(decamelizeKeys({ productionOrder }), storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.productionOrder;
      if (data) {
        dispatch({ type: CREATE_PRODUCTION_ORDER_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response.');
        dispatch({ type: CREATE_PRODUCTION_ORDER_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: CREATE_PRODUCTION_ORDER_FAILURE, error });
      return { error };
    });
};

export const update = (productionOrder, id, storeId) => (dispatch) => {
  dispatch({ type: UPDATE_PRODUCTION_ORDER_REQUEST });
  return productionOrderService.update(decamelizeKeys({ productionOrder }), id, storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.productionOrder;
      if (data) {
        dispatch({ type: UPDATE_PRODUCTION_ORDER_SUCCESS, data });
        // dispatch({ type: UPDATE_ENTITY, collection: 'productionOrders', id: data.id, data });
        return { data };
      } else {
        let error = new Error('Invalid response.');
        dispatch({ type: UPDATE_PRODUCTION_ORDER_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: UPDATE_PRODUCTION_ORDER_FAILURE, error });
      return { error };
    });
};

// export const remove = (id, storeId) => (dispatch) => {
//   dispatch({ type: REMOVE_PRODUCTION_ORDER_REQUEST });
//   return productionOrderService.remove(id, storeId)
//     .then(resp => {
//       let { message } = resp;
//       if (message === 'success') {
//         dispatch({ type: REMOVE_PRODUCTION_ORDER_SUCCESS });
//         return { };
//       } else {
//         let error = new Error(message || 'Invalid response.');
//         dispatch({ type: REMOVE_PRODUCTION_ORDER_FAILURE, error });
//         return { error };
//       }
//     })
//     .catch(error => {
//       dispatch({ type: UPDATE_PRODUCTION_ORDER_FAILURE, error });
//     });
// };

export const approve = (id, storeId) => (dispatch) => {
  dispatch({ type: APPROVE_PRODUCTION_ORDER_REQUEST });
  return productionOrderService.approve(id, storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.productionOrder;
      if (data) {
        dispatch({ type: APPROVE_PRODUCTION_ORDER_SUCCESS, data });
        // dispatch({ type: UPDATE_ENTITY, collection: 'productionOrders', id: data.id, data });
        return { data };
      } else {
        let error = new Error('Invalid response.');
        dispatch({ type: APPROVE_PRODUCTION_ORDER_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: APPROVE_PRODUCTION_ORDER_FAILURE, error });
      return { error };
    });
};

export const fulfill = (productionOrder, id, storeId) => (dispatch) => {
  dispatch({ type: FULFILL_PRODUCTION_ORDER_REQUEST });
  return productionOrderService.fulfill(decamelizeKeys({ productionOrder }), id, storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.productionOrder;
      if (data) {
        dispatch({ type: FULFILL_PRODUCTION_ORDER_SUCCESS, data });
        // dispatch({ type: UPDATE_ENTITY, collection: 'productionOrders', id: data.id, data });
        return { data };
      } else {
        let error = new Error('Invalid response.');
        dispatch({ type: FULFILL_PRODUCTION_ORDER_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: FULFILL_PRODUCTION_ORDER_FAILURE, error });
      return { error };
    });
};

export const cancel = (id, storeId) => (dispatch) => {
  dispatch({ type: CANCEL_PRODUCTION_ORDER_REQUEST });
  return productionOrderService.cancel(id, storeId)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.productionOrder;
      if (data) {
        dispatch({ type: CANCEL_PRODUCTION_ORDER_SUCCESS, data });
        // dispatch({ type: UPDATE_ENTITY, collection: 'productionOrders', id: data.id, data });
        return { data };
      } else {
        let error = new Error('Invalid response.');
        dispatch({ type: CANCEL_PRODUCTION_ORDER_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      dispatch({ type: CANCEL_PRODUCTION_ORDER_FAILURE, error });
      return { error };
    });
};

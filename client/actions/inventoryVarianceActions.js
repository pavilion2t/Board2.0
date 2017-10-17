import { camelizeKeys, decamelizeKeys } from 'humps';
import { get, pick } from 'lodash';
import { browserHistory } from 'react-router';

import { INVENTORY_VARIANCE } from '~/constants';
const { MODE, TAB } = INVENTORY_VARIANCE;
import inventoryService from '~/services/inventoryService';
import inventoryVarianceService from '~/services/inventoryVarianceService';
import routeHelper from '~/helpers/routeHelper';
import { drainAllPages } from '~/helpers/apiHelper';

import { alert } from './alertActions';
import { startFetch, stopFetch } from './baseActions';
import { SET_ENTITIES } from './entityActions';
import { closeDepartmentSelection } from './formActions/departmentSelection';

export const GET_INVENTORY_VARIANCES_REQUEST          = 'GET_INVENTORY_VARIANCES_REQUEST';
export const GET_INVENTORY_VARIANCES_SUCCESS          = 'GET_INVENTORY_VARIANCES_SUCCESS';
export const GET_INVENTORY_VARIANCES_FAILURE          = 'GET_INVENTORY_VARIANCES_FAILURE';
export const INVENTORY_VARIANCE_INIT                  = 'INVENTORY_VARIANCE_INIT';
export const INVENTORY_VARIANCE_SET_FIELDS            = 'INVENTORY_VARIANCE_SET_FIELDS';
export const INVENTORY_VARIANCE_ADD_LISTINGS          = 'INVENTORY_VARIANCE_ADD_LISTINGS';
export const INVENTORY_VARIANCE_REMOVE_LISTINGS       = 'INVENTORY_VARIANCE_REMOVE_LISTINGS';
export const INVENTORY_VARIANCE_UPDATE_ACTUAL_QTY     = 'INVENTORY_VARIANCE_UPDATE_ACTUAL_QTY';
export const INVENTORY_VARIANCE_UPDATE_VARIANCE_QTY   = 'INVENTORY_VARIANCE_UPDATE_VARIANCE_QTY';
export const INVENTORY_VARIANCE_UPDATE_COST           = 'INVENTORY_VARIANCE_UPDATE_COST';
export const INVENTORY_VARIANCE_UPDATE_IV_FIELD       = 'INVENTORY_VARIANCE_UPDATE_IV_FIELD';
export const INVENTORY_VARIANCE_LISTING_GO_TO_PAGE    = 'INVENTORY_VARIANCE_LISTING_GO_TO_PAGE';
export const INVENTORY_VARIANCE_UPDATE_SERIAL_NUMBERS = 'INVENTORY_VARIANCE_UPDATE_SERIAL_NUMBERS';
export const INVENTORY_VARIANCE_LOAD_ITEM             = 'INVENTORY_VARIANCE_LOAD_ITEM';
export const INVENTORY_VARIANCE_LOAD_LISTINGS         = 'INVENTORY_VARIANCE_LOAD_LISTINGS';
export const INVENTORY_VARIANCE_UPDATE_ITEM           = 'INVENTORY_VARIANCE_UPDATE_ITEM';

export const createInventoryVarianceByDepartments = (currentStore) => (dispatch, getState) => {
  const state = getState();
  const departmentIds = get(state, 'forms.departmentSelection.selected', []).map(d => d.department_id);
  const type = get(state, 'pages.inventoryVarianceIndex.type');
  dispatch(initInventoryVariance(currentStore, null, MODE.NEW, TAB.OVERVIEW, type));
  dispatch(closeDepartmentSelection());
  dispatch({ type: INVENTORY_VARIANCE_SET_FIELDS, payload: { type }});
  routeHelper.goInventoryVariance(currentStore.id, 'new');
  return dispatch(addListingsByDepartments(currentStore.id, departmentIds));
};


export const searchInventoryVariances = (storeId, page = 1, perPage = 25, orderBy = undefined, filters = []) => (dispatch) => {
  dispatch({ type: GET_INVENTORY_VARIANCES_REQUEST });
  return inventoryVarianceService.getVariances(storeId, page, perPage, orderBy, filters)
    .then(resp => {
      // dispatch(startFetch());
      resp = camelizeKeys(resp);
      let data = resp.data.inventoryVariances;
      if (data) {
        let entities = {};
        data.forEach(d => entities[d.id] = d);
        dispatch({ type: GET_INVENTORY_VARIANCES_SUCCESS, data });
        dispatch({ type: SET_ENTITIES, collection: 'inventoryVariances', data: entities });
        return resp;
      } else {
        let error = new Error('Invalid response.');
        dispatch({ type: GET_INVENTORY_VARIANCES_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      // dispatch(startFetch());
      dispatch({ type: GET_INVENTORY_VARIANCES_FAILURE, error });
      return { error };
    });
};

export const addListingsByDepartments = (storeId, departmentId = []) => (dispatch, getState) => {
  const search = {
    filter: { departmentId, trackQuantity: true },
  };
  dispatch(startFetch());
  return drainAllPages((page) => {
      return inventoryService.searchEs(storeId, search, page, 200)
        .then(res => {
          res.data = res.data.listings;
          dispatch(addListings(res.data));
          return res;
        });
    })
    .then(res => {
      dispatch(stopFetch());
    })
    .catch(err => {
      dispatch(stopFetch());
      dispatch(alert('danger', err.message));
    });
};

export const initInventoryVariance = (currentStore, id, mode, tab, type) => (dispatch, getState) => {
  dispatch({ type: INVENTORY_VARIANCE_INIT, payload: {currentStore, mode, tab, type} });
  if (mode === MODE.VIEW){
    return dispatch(loadInventoryVariance(currentStore.id, id));
  }
};

export const loadInventoryVariance = (storeId, itemId) => (dispatch, getState) => {
  if (storeId && itemId){
    const state = getState();
    const { inventoryVariance = {} } = state;
    const { perPage = 200 } = inventoryVariance;

    dispatch(startFetch());
    return inventoryVarianceService.getVariance(itemId, storeId)
      .then(res => {
        dispatch({ type: INVENTORY_VARIANCE_LOAD_ITEM, payload: res });
      })
      .then(() =>
        drainAllPages(
          (page) => inventoryVarianceService.getVarianceListings(itemId, storeId, page, perPage).then(res => {
            res.data = res.data.inventory_variance_items;
            dispatch({ type: INVENTORY_VARIANCE_LOAD_LISTINGS, payload: res.data });
            return res;
          })
        )
      )
      .then(res => {
        dispatch(stopFetch());
      })
      .catch(err => {
        dispatch(stopFetch());
        dispatch(alert('danger', err.message));
      });
  }
};

export const addListings = (listings = []) => (dispatch, getState) => {
  dispatch({ type: INVENTORY_VARIANCE_ADD_LISTINGS, payload: listings });
};

export const removeListings = (listingIds = []) => (dispatch, getState) => {
  dispatch({ type: INVENTORY_VARIANCE_REMOVE_LISTINGS, payload: listingIds });
};

export const updateActualQty = (listingId, value) => (dispatch, getState) => {
  const payload = { listingId, value };
  dispatch({ type: INVENTORY_VARIANCE_UPDATE_ACTUAL_QTY, payload });
};

export const updateVarianceQty = (listingId, value) => (dispatch, getState) => {
  const payload = { listingId, value };
  dispatch({ type: INVENTORY_VARIANCE_UPDATE_VARIANCE_QTY, payload });
};

export const updateCost = (listingId, value) => (dispatch, getState) => {
  const payload = { listingId, value };
  dispatch({ type: INVENTORY_VARIANCE_UPDATE_COST, payload });
};

export const updateSerialNumbers = (listingId, value) => (dispatch, getState) => {
  const payload = { listingId, value };
  dispatch({ type: INVENTORY_VARIANCE_UPDATE_SERIAL_NUMBERS, payload });
};

export const updateIvField = (field, value) => (dispatch, getState) => {
  const payload = { field, value };
  dispatch({ type: INVENTORY_VARIANCE_UPDATE_IV_FIELD, payload });
};

export const listingGoToPage = (page) => (dispatch, getState) => {
  const payload = { page };
  dispatch({ type: INVENTORY_VARIANCE_LISTING_GO_TO_PAGE, payload });
};

export const startEdit = () => (dispatch, getState) => {
  const payload = { mode: MODE.EDIT };
  dispatch({ type: INVENTORY_VARIANCE_SET_FIELDS, payload });
};

export const cancelEdit = () => (dispatch, getState) => {
  const state = getState();
  const { inventoryVariance = {} } = state;
  const { currentStore, mode, tab, type, iv = {} } = inventoryVariance;
  const { id: itemId } = iv;
  if (mode === MODE.EDIT){
    return dispatch(initInventoryVariance(currentStore, itemId, MODE.VIEW, tab, type));
  } else {
    browserHistory.goBack();
  }
};

export const saveItem = () => (dispatch, getState) => {
  const state = getState();
  const { inventoryVariance = {} } = state;
  const { mode, type, iv = {}, entities = {}, currentStore = {} } = inventoryVariance;
  const { id: storeId } = currentStore;
  let data = { ...iv };
  const itemId = data.id;
  const isEdit = mode === MODE.EDIT && itemId;
  const items = iv.items
    .map(id => entities[id])
    .filter(item => isEdit ? item && (item._destroy || item._modified) : item && !item._destroy)
    .map(item => {
      const { id, listingId, actualQty, varianceQty, cost, lots, serialNumbers, _destroy } = item;
      return {
        id,
        listingId,
        actualQty:   actualQty.toString(),
        varianceQty: varianceQty.toString(),
        cost:        cost.toString(),
        lots,
        serialNumbers,
        _destroy,
      };
    });
  data.typeId = type;
  data.inventoryVarianceItemsAttributes = items;
  data = {
    inventoryVariance: pick(data, [
      'id',
      'typeId',
      'name',
      'effectiveDate',
      'inventoryVarianceItemsAttributes',
      'remarks'
    ]),
  };
  data = decamelizeKeys(data);
  dispatch(startFetch());
  let promise = null;
  if (isEdit){
    promise = inventoryVarianceService.update(data, itemId, storeId);
  } else {
    promise = inventoryVarianceService.create(data, storeId);
  }
  return promise
    .then(res => {
      const { inventory_variance: ret = {} } = res;
      if (mode === MODE.NEW){
        routeHelper.goInventoryVariance(storeId, ret.id);
      } else {
        location.reload();
      }
    })
    .catch(err => {
      dispatch(stopFetch());
      dispatch(alert('danger', err.message));
    });
};

export const changeItemStatus = (status) => (dispatch, getState) => {
  const state = getState();
  const { inventoryVariance = {} } = state;
  const { currentStore = {}, iv = {} } = inventoryVariance;
  if (currentStore.id && iv.id && status){
    dispatch(startFetch());
    return inventoryVarianceService.changeVarianceStatus(currentStore.id, iv.id, status)
      .then(res => {
        const statusNeedGoBack = {
          submit: true,
          approve: true,
        };
        dispatch(stopFetch());
        if (statusNeedGoBack){
          routeHelper.goInventoryVariance(currentStore.id);
        } else {
          dispatch({ type: INVENTORY_VARIANCE_UPDATE_ITEM, payload: res });
        }
      })
      .catch(err => {
        dispatch(stopFetch());
        dispatch(alert('danger', err.message));
      });
  }
};

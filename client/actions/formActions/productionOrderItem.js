import keykey from 'keykey';
import Big from 'big.js';
import flatten from 'tree-flatten';
import routeHelper from '~/helpers/routeHelper';
import {
  create,
  update,
  fulfill,
  approve as approveOrder,
  cancel as cancelOrder,
  getProductionOrder as getOrder
} from '~/actions/productionOrderAction';
import { getCollection as getListingBillOfMaterialCollection } from '~/actions/billOfMaterialsActions';
import { getListingItems } from '~/actions/inventoryActions';
import { getGroups as getAllUom } from '~/actions/uomGroupActions';
import { startFetch, stopFetch } from '~/actions/baseActions';
import { pick, differenceBy, intersectionBy, slice, forEach, concat } from 'lodash';

export const actionTypes = keykey([
  'OPEN_PRODUCTION_ORDER_OVERVIEW_REQUEST',
  'OPEN_PRODUCTION_ORDER_OVERVIEW_SUCCESS',
  'OPEN_PRODUCTION_ORDER_OVERVIEW_FAILURE',
  'CLOSE_PRODUCTION_ORDER_OVERVIEW',
  'SUBMIT_PRODUCTION_ORDER_OVERVIEW_REQUEST',
  'SUBMIT_PRODUCTION_ORDER_OVERVIEW_SUCCESS',
  'SUBMIT_PRODUCTION_ORDER_OVERVIEW_FAILURE',
  'LOAD_LISTINGS_FOR_PRODUCTION_ORDER_REQUEST',
  'LOAD_LISTINGS_FOR_PRODUCTION_ORDER_SUCCESS',
  'LOAD_LISTINGS_FOR_PRODUCTION_ORDER_FAILURE',
  'LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_REQUEST',
  'LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_SUCCESS',
  'LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_FAILURE',
  'LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_REQUEST',
  'LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_SUCCESS',
  'LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_FAILURE',

  'ENABLE_PRODUCTION_ORDER_EDITMODE',
  'CHANGE_PRODUCTION_ORDER_TYPE',
  'CHANGE_PRODUCTION_ORDER_PLANNED_QUANTITY',
  'CHANGE_PRODUCTION_ORDER_PROCESSED_QUANTITIY',
  'CHANGE_PRODUCTION_ORDER_UOM',
  'REMOVE_PRODUCTION_ORDER_LISTING_ITEM',
  'ADD_PRODUCTION_ORDER_LISTING_ITEM',
  'DISCARD_PRODUCTION_ORDER_OVERVIEW'
]);

export const open = (id, storeId) => (dispatch) => {
  if (!id) {
    dispatch(openNew(storeId));
  } else {
    dispatch(openExist(id, storeId));
  }
};

const openNew = (storeId) => (dispatch) => {
  dispatch({ type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_REQUEST, storeId });
  return dispatch(enableEditMode());
};

const openExist = (id, storeId) => (dispatch) => {
  dispatch({ type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_REQUEST, storeId, id });
  dispatch(startFetch());
  return dispatch(getOrder(id, storeId))
    .then(resp => {
      const { data, error } = resp;
      if (error) {
        alert(`Cannot load the production order: ${error.message}`);
        dispatch({ type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_FAILURE, error });
        dispatch(stopFetch());
        return { error };
      } else {
        const { productionOrderItems } = data;
        dispatch({ type: actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_SUCCESS, data, id, storeId });
        if (Array.isArray(productionOrderItems) && productionOrderItems.length > 0) {
          let listingIds = getListingIdFromNested(productionOrderItems);
          dispatch({ type: actionTypes.LOAD_LISTINGS_FOR_PRODUCTION_ORDER_REQUEST });
          return dispatch(getListingItems(listingIds, storeId))
            .then(resp => {
              const { data, error } = resp;
              dispatch(stopFetch());
              if (!error) {
                dispatch({ type: actionTypes.LOAD_LISTINGS_FOR_PRODUCTION_ORDER_SUCCESS, data });
                return {};
              } else {
                alert(`Cannot load the listing info for production order: ${error.message}`);
                dispatch({ type: actionTypes.LOAD_LISTINGS_FOR_PRODUCTION_ORDER_FAILURE, error });
                return { error };
              }
            });
        } else {
          dispatch(stopFetch());
        }
      }
    });
};
const loadAllUnitOfMeasure = (storeId) => (dispatch) => {
  dispatch({ type: actionTypes.LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_REQUEST });
  dispatch(startFetch());
  return dispatch(getAllUom(storeId))
    .then(resp => {
      dispatch(stopFetch());
      const { data, error } = resp;
      if (!error) {
        dispatch({ type: actionTypes.LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_SUCCESS, data });
        return { data };
      } else {
        alert(`Cannot load all unit groups: ${error.message}`);
        dispatch({ type: actionTypes.LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_FAILURE, error });
        return { error };
      }
    });
};

const loadBomForListingItem = (listingId, storeId) => (dispatch) => {
  dispatch({ type: actionTypes.LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_REQUEST });
  dispatch(startFetch());
  return dispatch(getListingBillOfMaterialCollection(listingId, storeId))
    .then(resp => {
      dispatch(stopFetch());
      const { data, error } = resp;
      if (!error) {
        dispatch({ type: actionTypes.LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_SUCCESS, data });
        return { data };
      } else {
        alert(`Cannot load the bill of material: ${error.message}`);
        dispatch({ type: actionTypes.LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_FAILURE, error });
        return { error };
      }
    });
};

export const close = () => ({ type: actionTypes.CLOSE_PRODUCTION_ORDER_OVERVIEW });
export const enableEditMode = (enable = true) => (dispatch, getState) => {
  if (!enable) {
    return dispatch({ type: actionTypes.ENABLE_PRODUCTION_ORDER_EDITMODE, mode: enable });
  } else {
    const state = getState();
    const { storeId } = state.forms.productionOrderItem;
    return dispatch(loadAllUnitOfMeasure(storeId))
      .then(resp => {
        const { error } = resp;
        if (!error) {
          dispatch({ type: actionTypes.ENABLE_PRODUCTION_ORDER_EDITMODE, mode: enable });
          return {};
        } else {
          return { error };
        }
      });
  }
};
export const changeOrderType = (value) => ({ type: actionTypes.CHANGE_PRODUCTION_ORDER_TYPE, value });
export const changePlannedQuantity = (value, index) => ({
  type: actionTypes.CHANGE_PRODUCTION_ORDER_PLANNED_QUANTITY,
  value,
  index
});
export const changeProcessedQuantity = (value, index) => ({
  type: actionTypes.CHANGE_PRODUCTION_ORDER_PROCESSED_QUANTITIY,
  value,
  index
});
export const changeUom = (value, index) => ({ type: actionTypes.CHANGE_PRODUCTION_ORDER_UOM, value, index });
export const removeListingItem = (index) => ({ type: actionTypes.REMOVE_PRODUCTION_ORDER_LISTING_ITEM, index });
export const addListingItem = (listings) => (dispatch, getState) => {
  const state = getState();
  const { storeId, productionOrderItems } = state.forms.productionOrderItem;
  listings.forEach(l => l.listingId = l.id);
  let diff = differenceBy(listings, productionOrderItems, 'listingId');
  if (!diff.length) return;
  let ids = diff.map(l => l.id);

  return dispatch(loadBomForListingItem(ids, storeId))
    .then(resp => {
      const { error } = resp;
      if (!error) {
        dispatch({ type: actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM, data: diff });
        return {};
      } else {
        alert(error.message);
        return { error };
      }
    });
};
export const discard = () => (dispatch, getState) => {
  if (window.confirm("Do you really want to discard you changes?")) {
    const state = getState();
    const { isCreating, storeId } = state.forms.productionOrderItem;
    if (!isCreating) {
      dispatch({ type: actionTypes.DISCARD_PRODUCTION_ORDER_OVERVIEW });
    } else {
      routeHelper.goProductionOrders(storeId);
    }
  }
};
const createProductionOrder = (data, storeId) => (dispatch) => {
  dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_REQUEST });
  return dispatch(create(data, storeId))
    .then(resp => {
      const { data, error } = resp;
      if (!error) {
        let { id } = data;
        routeHelper.goProductionOrders(storeId, id);
      } else {
        alert(error.message);
        dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_FAILURE, error });
      }
    });
};
const updateProductionOrder = (data, id, storeId) => (dispatch) => {
  dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_REQUEST });
  return dispatch(update(data, id, storeId))
    .then(resp => {
      const { error, data } = resp;
      if (!error) {
        dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_SUCCESS, data });
      } else {
        alert(error.message);
        dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_FAILURE, error });
      }
    });
};

const fulfillProductionOrder = (data, id, storeId) => (dispatch) => {
  dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_REQUEST });
  return dispatch(fulfill(data, id, storeId))
    .then(resp => {
      const { error, data } = resp;
      if (!error) {
        dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_SUCCESS, data });
      } else {
        alert(error.message);
        dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_FAILURE, error });
      }
    });
};

export const approve = () => (dispatch, getState) => {
  const state = getState();
  const { id, storeId } = state.forms.productionOrderItem;
  dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_REQUEST });
  return dispatch(approveOrder(id, storeId))
    .then(resp => {
      const { error, data } = resp;
      if (error) {
        alert(error.message);
        dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_FAILURE, error });
      } else {
        dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_SUCCESS, data });
      }
    });
};

export const cancel = () => (dispatch, getState) => {
  if (window.confirm("Do you really want to cancel this order?")) {
    const state = getState();
    const { id, storeId } = state.forms.productionOrderItem;
    dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_REQUEST });
    return dispatch(cancelOrder(id, storeId))
      .then(resp => {
        const { error, data } = resp;
        if (error) {
          alert(error.message);
          dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_FAILURE, error });
        } else {
          dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_SUCCESS, data });
        }
      });
  }
};

export const submit = () => (dispatch, getState) => {
  const state = getState();
  const { isCreating, errors, storeId, id, productionOrderItems, initialValues } = state.forms.productionOrderItem;
  if (errors.loadBOM.length && errors.loadUOM.length && errors.loadListing.length) {
    alert(`Faild to save, missing data.`);
    return;
  }

  let error = null;
  productionOrderItems.forEach(i => {
    if (Big(i.qtyFulfilled).gt(i.quantity)) {
      error = 'Processed quantity should not be greater than planned quantity.';
    }
  });
  if (error) {
    alert(error);
    return;
  }

  dispatch({ type: actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_REQUEST });

  let isProcessing = ['approved', 'fulfilling'].indexOf(initialValues.state) > -1;

  let data = { typeId: 1, productionOrderItemsAttributes: [] };

  if (isCreating) {
    productionOrderItems.forEach(p => {
      let picked = cleanItem(p);
      if (Array.isArray(p.productionOrderItemMaterials) && p.productionOrderItemMaterials.length) {
        p.productionOrderItemMaterials = p.productionOrderItemMaterials.map(nested => flatten(nested, 'children'));
        p.productionOrderItemMaterials = [].concat.apply([], p.productionOrderItemMaterials);
        picked.productionOrderItemMaterialsAttributes = p.productionOrderItemMaterials.map(cleanMaterials);
      }
      data.productionOrderItemsAttributes.push(picked);
    });
  }
  else {
    if (isProcessing) {
      data = { productionOrderItemsAttributes: [] };
      data.productionOrderItemsAttributes = productionOrderItems.map(i => pick(i, ['id', 'qtyFulfilled', 'qtyFulfilledInDisplayUnit']));
    } else {
      productionOrderItems.forEach(p => {
        let picked = cleanItem(p);
        if (Array.isArray(p.productionOrderItemMaterials) && p.productionOrderItemMaterials.length) {
          p.productionOrderItemMaterials = p.productionOrderItemMaterials.map(nested => flatten(nested, 'children'));
          p.productionOrderItemMaterials = [].concat.apply([], p.productionOrderItemMaterials);
          picked.productionOrderItemMaterialsAttributes = p.productionOrderItemMaterials.map(cleanMaterials);
        }
      });
      data.productionOrderItemsAttributes = itemDiff(initialValues.productionOrderItems, productionOrderItems);
    }
  }

  dispatch(isCreating ? createProductionOrder(data, storeId) : isProcessing ? fulfillProductionOrder(data, id, storeId) : updateProductionOrder(data, id, storeId));
};

const cleanItem = (item) => {
  return pick(item, [
    'id',
    '_destroy',
    'listingId',
    'ean13',
    "listingBarcode",
    "quantity",
    "baseUnitId",
    "baseUnit",
    "quantityInDisplayUnit",
    "displayUnitId",
    "displayUnit",
    'trackQuantity',
    "productionOrderItemMaterialsAttributes",
    "qtyFulfilledInDisplayUnit",
    "qtyFulfilled"]);
};

const cleanMaterials = (item) => {
  return pick(item, [
    'name',
    'baseUnit',
    'baseUnitId',
    'autoAssembly',
    'ean13',
    'listingBarcode',
    'trackQuantity',
    'bomRatio',
    'unitRatio',
    'listingId',
    'parentListingId',
    'quantity',
    'baseUnitId',
    'baseUnit',
    'quantityInDisplayUnit',
    'displayUnitId',
    'displayUnit',
    'uuid',
    'qtyFulfilled',
    'qtyFulfilledInDisplayUnit',
    'parentUuid']);
};

const itemDiff = (prev, next) => {
  let toRemove = slice(differenceBy(prev, next, 'id'));
  let toAdd = slice(differenceBy(next, prev, 'id'));
  let toUpdate = slice(intersectionBy(next, prev, 'id'));

  forEach(toRemove, item => item['_destroy'] = true);
  return concat(toRemove, toAdd, toUpdate);
};

const getListingIdFromNested = (productionOrderItems) => {
  let itemIds = productionOrderItems.map(i => i.listingId);
  productionOrderItems.forEach(i => {
    if (Array.isArray(i.productionOrderItemMaterials) && i.productionOrderItemMaterials.length) {
      let materialListingIds = i.productionOrderItemMaterials.map(m => m.listingId);

      itemIds = itemIds.concat(materialListingIds);
    }
  });
  return itemIds;
};

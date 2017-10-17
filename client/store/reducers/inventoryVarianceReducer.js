import Big from 'big.js';
import { camelizeKeys } from 'humps';

import { createReducer } from '~/helpers/reduxHelper';
import * as actionTypes from '~/actions/inventoryVarianceActions';

import { INVENTORY_VARIANCE } from '~/constants';
const {
  MODE,
  TYPE,
  TAB,
} = INVENTORY_VARIANCE;

const initialState = {
  mode:              MODE.VIEW,
  tab:               TAB.OVERVIEW,
  type:              TYPE.OPENING,
  currentStore:      {},
  currentPage:       0, // start from 1
  totalPages:        0,
  perPage:           20,
  totalEntries:      0,
  varianceCostTotal: Big(0),
  activeItems:       [],
  errors:            {},
  entities:          {},
  iv: {
    id:            null,
    typeId:        TAB.OPENING,
    name:          '',
    effectiveDate: null,
    remarks:       '',
    items:         [],
  },
};

const activeFilter = (ids = [], entities = {}) => ids.filter(id => entities[id] && !entities[id]._destroy);

const calTotalPagesInfo = (state) => {
  const { iv: { items = [] }, entities = {}, currentPage, perPage } = state;
  const activeIds = activeFilter(items, entities);
  const totalEntries = activeIds.length;
  const totalPages = Math.ceil(totalEntries / perPage);
  let newCurrentPage = currentPage;
  if (currentPage === 0 && totalPages > 0){
    newCurrentPage = 1;
  } else if (currentPage > totalPages){
    newCurrentPage = totalPages;
  }
  const currentIdx = (newCurrentPage - 1) * perPage;
  const activeItems = activeIds.slice(currentIdx, currentIdx + perPage).map(id => entities[id]);
  const varianceCostTotal = activeIds.reduce((sum, id) => {
    const item = entities[id] || {};
    return state.type == TYPE.OPENING ? sum.add(item.totalCost || 0) : sum.add(item.varianceCost || 0);
  }, Big(0));
  return {
    ...state,
    totalEntries,
    totalPages,
    perPage,
    currentPage: newCurrentPage,
    varianceCostTotal,
    activeItems,
  };
};

const actionHandlers = {
  [actionTypes.INVENTORY_VARIANCE_INIT]: (state, { payload = {} }) => {
    return { ...initialState, ...payload };
  },
  [actionTypes.INVENTORY_VARIANCE_SET_FIELDS]: (state, { payload = {} }) => {
    return { ...state, ...payload };
  },
  [actionTypes.INVENTORY_VARIANCE_ADD_LISTINGS]: (state, { payload = [] }) => {
    if (payload.length > 0) {
      const entities = { ...state.entities };
      const items = state.iv.items.slice();
      const mappedPayload = payload
        .map(listing => camelizeKeys(listing))
        .map(listing => {
          listing.listingId    = listing.id;
          listing.id           = null;
          listing.productName  = listing.name;
          listing.qtyBefore    = Big(listing.quantity || 0);
          listing.actualQty    = Big(listing.quantity || 0);
          listing.varianceQty  = Big(0);
          listing.costBefore   = Big(listing.cost || 0);
          listing.cost         = Big(listing.cost || 0);
          listing.varianceCost = Big(0);
          listing.totalCost    = listing.actualQty.times(listing.cost);
          listing.errors       = [];
          listing._destroy     = false;
          listing._modified    = false;
          listing.serialNumbers         = (listing.serialNumbers||[]).map(v => typeof v === 'string' ? v : v.number);
          listing.listingReferenceCodes = (listing.listingReferenceCodes||[]).map(v => typeof v === 'string' ? v : v.code);
          return listing;
        });
      mappedPayload.forEach(listing => {
        const { listingId } = listing;
        if (entities[listingId]){
          entities[listingId] = { ...entities[listingId] };
          entities[listingId]._destroy = false;
        } else {
          entities[listingId] = listing;
          items.push(listing.listingId);
        }
      });
      const iv = {
        ...state.iv,
        items,
      };
      return calTotalPagesInfo({ ...state, iv, entities });
    }
    return state;
  },
  [actionTypes.INVENTORY_VARIANCE_LOAD_LISTINGS]: (state, { payload = [] }) => {
    if (payload.length > 0) {
      const { type, errors = {} } = state;
      const entities = { ...state.entities };
      const isVarQty = type === TYPE.VARIANCE_QTY_ADJ;
      const isVarCost = type === TYPE.COST_ADJ;
      const items = state.iv.items.slice();
      const mappedPayload = payload
        .map(listing => camelizeKeys(listing))
        .map(listing => {
          listing.qtyBefore    = Big(listing.qtyBefore || 0);
          listing.actualQty    = Big(listing.actualQty || 0);
          listing.varianceQty  = isVarQty ? Big(listing.varianceQty) : Big(listing.actualQty).minus(listing.qtyBefore);
          listing.costBefore   = Big(listing.costBefore || 0);
          listing.cost         = Big(listing.cost || 0);
          listing.varianceCost = isVarCost ?
            Big(listing.cost).minus(listing.costBefore).times(listing.qtyBefore) :
            Big(listing.varianceQty).times(listing.cost);
          listing.totalCost    = listing.actualQty.times(listing.cost);
          listing.errors       = errors[listing.id] || [];
          listing._destroy     = false;
          listing._modified    = false;
          listing.serialNumbers         = (listing.serialNumbers||[]).map(v => typeof v === 'string' ? v : v.number);
          listing.listingReferenceCodes = (listing.listingReferenceCodes||[]).map(v => typeof v === 'string' ? v : v.code);
          return listing;
        });
      mappedPayload.forEach(listing => {
        const { listingId } = listing;
        if (entities[listingId]){
          entities[listingId] = { ...entities[listingId] };
          entities[listingId]._destroy = false;
        } else {
          entities[listingId] = listing;
          items.push(listing.listingId);
        }
      });
      const iv = {
        ...state.iv,
        items,
      };
      return calTotalPagesInfo({ ...state, iv, entities });
    }
    return state;
  },
  [actionTypes.INVENTORY_VARIANCE_REMOVE_LISTINGS]: (state, { payload = [] }) => {
    if (payload.length > 0){
      const entities = { ...state.entities };
      const items = state.iv.items.slice();
      payload.forEach(listingId => {
        if (entities[listingId]){
          entities[listingId] = { ...entities[listingId] };
          entities[listingId]._destroy = true;
        }
      });
      const iv = {
        ...state.iv,
        items,
      };
      return calTotalPagesInfo({ ...state, iv, entities });
    }
    return state;
  },
  [actionTypes.INVENTORY_VARIANCE_UPDATE_ACTUAL_QTY]: (state, { payload = {} }) => {
    const { listingId, value } = payload;
    if (state.entities[listingId]){
      const entities = { ...state.entities };
      let {
        qtyBefore, actualQty, varianceQty,
        costBefore, cost, varianceCost, totalCost,
      } = entities[listingId];
      actualQty = Big(value || 0);
      varianceQty = Big(actualQty).minus(qtyBefore);
      varianceCost = Big(varianceQty).times(cost);
      totalCost = Big(actualQty).times(cost);
      entities[listingId] = {
        ...entities[listingId],
        qtyBefore, actualQty, varianceQty,
        costBefore, cost, varianceCost, totalCost,
        _modified: true,
      };
      return calTotalPagesInfo({ ...state, entities });
    }
    return state;
  },
  [actionTypes.INVENTORY_VARIANCE_UPDATE_VARIANCE_QTY]: (state, { payload = {} }) => {
    const { listingId, value } = payload;
    if (state.entities[listingId]){
      const entities = { ...state.entities };
      let {
        qtyBefore, actualQty, varianceQty,
        costBefore, cost, varianceCost, totalCost,
      } = entities[listingId];
      varianceQty = Big(value || 0);
      actualQty = Big(qtyBefore).plus(varianceQty);
      varianceCost = Big(varianceQty).times(cost);
      totalCost = Big(actualQty).times(cost);
      entities[listingId] = {
        ...entities[listingId],
        qtyBefore, actualQty, varianceQty,
        costBefore, cost, varianceCost, totalCost,
        _modified: true,
      };
      return calTotalPagesInfo({ ...state, entities });
    }
    return state;
  },
  [actionTypes.INVENTORY_VARIANCE_UPDATE_COST]: (state, { payload = {} }) => {
    const { listingId, value } = payload;
    if (state.entities[listingId]){
      const entities = { ...state.entities };
      let {
        qtyBefore, actualQty, varianceQty,
        costBefore, cost, varianceCost, totalCost,
      } = entities[listingId];
      cost = Big(value || 0);
      varianceCost = Big(cost).minus(costBefore).times(qtyBefore);
      totalCost = Big(qtyBefore).times(cost);
      entities[listingId] = {
        ...entities[listingId],
        qtyBefore, actualQty, varianceQty,
        costBefore, cost, varianceCost, totalCost,
        _modified: true,
      };
      return calTotalPagesInfo({ ...state, entities });
    }
    return state;
  },
  [actionTypes.INVENTORY_VARIANCE_UPDATE_SERIAL_NUMBERS]: (state, { payload = {} }) => {
    const { listingId, value = [] } = payload;
    if (state.entities[listingId]){
      const entities = { ...state.entities };
      let {
        qtyBefore, actualQty, varianceQty,
        costBefore, cost, varianceCost, totalCost,
      } = entities[listingId];
      const serialNumbers = value;
      actualQty = Big(value.length || 0);
      varianceQty = Big(actualQty).minus(qtyBefore);
      varianceCost = Big(varianceQty).times(cost);
      totalCost = Big(actualQty).times(cost);
      entities[listingId] = {
        ...entities[listingId],
        qtyBefore, actualQty, varianceQty,
        costBefore, cost, varianceCost, totalCost,
        serialNumbers,
        _modified: true,
      };
      return calTotalPagesInfo({ ...state, entities });
    }
    return state;
  },
  [actionTypes.INVENTORY_VARIANCE_UPDATE_IV_FIELD]: (state, { payload = {} }) => {
    const { field, value } = payload;
    const iv = { ...state.iv, [field]: value };
    return { ...state, iv };
  },
  [actionTypes.INVENTORY_VARIANCE_LISTING_GO_TO_PAGE]: (state, { payload = {} }) => {
    const { page } = payload;
    const currentPage = page ? page : 0;
    return calTotalPagesInfo({ ...state, currentPage });
  },
  [actionTypes.INVENTORY_VARIANCE_LOAD_ITEM]: (state, { payload = {} }) => {
    const data = camelizeKeys(payload).inventoryVariance;
    const {
      typeId: type = TYPE.OPENING,
      humanizeValidationErrors: errors = {},
      ...iv,
    } = data;
    iv.items = [];
    return { ...state, type, iv, errors };
  },
  [actionTypes.INVENTORY_VARIANCE_UPDATE_ITEM]: (state, { payload = {} }) => {
    const data = camelizeKeys(payload).inventoryVariance;
    const {
      typeId: type = TYPE.OPENING,
      humanizeValidationErrors: errors = {},
      ...newIv,
    } = data;
    const iv = Object.assign({}, state.iv, newIv);
    return { ...state, type, iv, errors };
  },
};


export default createReducer(initialState, actionHandlers);

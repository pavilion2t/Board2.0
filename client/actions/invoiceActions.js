import { browserHistory } from 'react-router';
import routeHelper from '~/helpers/routeHelper';
import { formatCurrency, dateToIso } from '~/helpers/formatHelper';
import { camelizeKeys, decamelizeKeys } from 'humps';
import { normalize, arrayOf } from 'normalizr';

import { HANDLE_PROMISE } from '../store/middlewares/handlePromiseMiddleware';
import { InvoiceSchema, UnitGroupSchema } from '../store/middlewares/schema';

import inventoryService from '../services/inventoryService';
import invoiceService from '../services/invoiceService';
import quoteService from '../services/quoteService';
import unitGroupsService from '../services/unitGroupsService';
import deliveryOrderService from '../services/deliveryOrderService';

import { PURCHASABLE_TYPE_ROUNDING } from '../constants';

import { alert } from './alertActions';
import { startFetch, stopFetch } from './baseActions';
import { askRecipientThenSendEmail, EMAIL_TEMPLATE_TYPE } from './emailTemplateActions';

import {
  VIEW, NEW, EDIT,
  OVERVIEW,
  INVOICE_TYPE, QUOTE_TYPE,
} from '../pages/invoice/constant';

export const INIT_INVOICE_STATE = 'INIT_INVOICE_STATE';
export const SET_INVOICE_STATE = 'SET_INVOICE_STATE';
export const CHANGE_INVOICE_TAB = 'CHANGE_INVOICE_TAB';
export const ADD_LISTINGS_TO_INVOICE = 'ADD_LISTINGS_TO_INVOICE';
export const REMOVE_LISTINGS_FROM_INVOICE = 'REMOVE_LISTINGS_FROM_INVOICE';
export const CHANGE_INVOICE_FIELD = 'CHANGE_INVOICE_FIELD';
export const CHANGE_INVOICE_FIELDS = 'CHANGE_INVOICE_FIELDS';
export const CHANGE_INVOICE_LISTING_QUANTITY = 'CHANGE_INVOICE_LISTING_QUANTITY';
export const CHANGE_INVOICE_LISTING_UNIT = 'CHANGE_INVOICE_LISTING_UNIT';
export const CHANGE_INVOICE_LISTING_UNIT_PRICE = 'CHANGE_INVOICE_LISTING_UNIT_PRICE';
export const CALCULATE_INVOICE_ORDER_TOTAL = 'CALCULATE_INVOICE_ORDER_TOTAL';
export const LOAD_INVOICE_TO_FORM = 'LOAD_INVOICE_TO_FORM';
export const PATCH_INVOICE_LISTING_MISSING_INFO = 'PATCH_INVOICE_LISTING_MISSING_INFO';
export const PATCH_INVOICE_LISTING_UNIT_GROUP = 'PATCH_INVOICE_LISTING_UNIT_GROUP';
export const LOAD_INVOICE_HISTORY_REQUEST = 'LOAD_INVOICE_HISTORY_REQUEST';
export const LOAD_INVOICE_HISTORY_SUCCESS = 'LOAD_INVOICE_HISTORY_SUCCESS';
export const LOAD_INVOICE_HISTORY_FAILURE = 'LOAD_INVOICE_HISTORY_FAILURE';
export const LOAD_INVOICE_DELIVERY_ORDER_SUCCESS = 'LOAD_INVOICE_DELIVERY_ORDER_SUCCESS';

export function getInvoice(storeId, number) {
    return {
        [HANDLE_PROMISE]: {
            promise: invoiceService.getItem(storeId, number).then(res => normalize(res.invoice, InvoiceSchema))
        }
    };
}

export const getInvoiceHistory = () => (dispatch, getState) => {
  const state = getState();
  const { currentStore = {}, order = {} } = state.invoice;
  const { number } = order;
  const { id: storeId } = currentStore;
  if (!number || !storeId) return;
  dispatch({ type: LOAD_INVOICE_HISTORY_REQUEST });
  return invoiceService.getItemHistory(storeId, number)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.histories;
      if (data) {
        dispatch({ type: LOAD_INVOICE_HISTORY_SUCCESS, data });
        return { data };
      } else {
        let error = new Error('Invalid response');
        alert(error.message);
        dispatch({ type: LOAD_INVOICE_HISTORY_FAILURE, error });
        return { error };
      }
    })
    .catch(error => {
      alert(error.message);
      dispatch({ type: LOAD_INVOICE_HISTORY_FAILURE, error });
      return { error };
    });
};


/* istanbul ignore next */
export function goToInvoiceSearch(storeId) {
    window.top.location.replace(`/${storeId}/invoices`);
}

export function initInvoiceState(type, mode, tab, orderNumber, currentStore, multiStore) {
    return (dispatch) => {
        const { module = {} } = currentStore;
        const {
            decimal_points,
            rounding_type,
            line_item_decimal_points,
            line_item_rounding_type,
            quantity_decimal_points,
        } = module;

        dispatch({
            type: INIT_INVOICE_STATE,
            data: {
                type,
                mode,
                currentTab:       tab,
                multiStore,
                currentStore,
                orderNumber,
                totalDp:          decimal_points,
                totalRoundType:   rounding_type,
                listingDp:        line_item_decimal_points,
                listingRoundType: line_item_rounding_type,
                quantityDp:       quantity_decimal_points,
            },
        });

        if (mode === VIEW){
            loadInvoiceToForm(type, currentStore.id, orderNumber)(dispatch);
        }
    };
}

export function loadInvoiceToForm(type, storeId, orderNumber) {
    return (dispatch) => {
        let order = null;
        if (type === INVOICE_TYPE){
            order = invoiceService.getItem(storeId, orderNumber).then(res => res.invoice);
        } else if (type === QUOTE_TYPE){
            order = quoteService.getItem(storeId, orderNumber).then(res => res.quote);
        }
        if (order){
            dispatch(startFetch());
            return order
                .then(raw => {
                    const data = camelizeKeys(raw);
                    dispatch({ type: LOAD_INVOICE_TO_FORM, data });
                    const listingIds = (data.listingLineItems||[]).map(d => d.purchasableId);
                    return refreshInvoiceLineItemDetails(storeId, listingIds)(dispatch);
                })
                .then(() => dispatch(getInvoiceDeliveryNote()))
                .then(() => dispatch(stopFetch()))
                .catch(err => {
                    dispatch(stopFetch());
                    dispatch(alert('danger', err.message));
                });
        }
    };
}

export const refreshInvoice = () => (dispatch, getState) => {
  const state = getState();
  const { invoice = {} } = state;
  const { type, currentStore = {}, order = {} } = invoice;
  const { id: storeId } = currentStore;
  const { number } = order;
  if (type && storeId && number){
    return loadInvoiceToForm(type, storeId, number)(dispatch);
  }
};

export function refreshInvoiceLineItemDetails(storeId, listingIds = []){
    return (dispatch) => {
        const ids = Array.isArray(listingIds) ? listingIds : [listingIds];
        if (ids.length > 0){
            dispatch(startFetch());
            const promise = inventoryService.getItems(storeId, ids);
            return promise
                .then(res => {
                    const { count, data: { listings = [] } } = res;
                    const data = camelizeKeys(listings);
                    const unitGroupIds = data.reduce((ret, item) => {
                        if (item.unitGroupId){
                            ret.add(item.unitGroupId);
                        }
                        return ret;
                    }, new Set());

                    if (count > 0){
                        dispatch({ type: PATCH_INVOICE_LISTING_MISSING_INFO, data });
                        return fetchInvoiceLineItemUnitGroups(storeId, unitGroupIds)(dispatch);
                    }
                })
                .then(() => dispatch(stopFetch()))
                .catch(err => {
                    dispatch(stopFetch());
                    dispatch(alert('danger', err.message));
                });
        }
    };
}

export function fetchInvoiceLineItemUnitGroups(storeId, unitGroupIds = []){
    return (dispatch) => {
        if (unitGroupIds.size > 0 || unitGroupIds.length > 0){
            const promises = [...unitGroupIds].map(id => unitGroupsService.getItem(storeId, id));
            dispatch(startFetch());
            return Promise.all(promises)
                .then((result) => {
                    const unitGroups = camelizeKeys(result).map(d => d.unitGroup);
                    const { entities } = normalize(unitGroups, arrayOf(UnitGroupSchema));
                    dispatch({ type: PATCH_INVOICE_LISTING_UNIT_GROUP, data: entities });
                })
                .then(() => dispatch(stopFetch()))
                .catch(err => {
                    dispatch(stopFetch());
                    dispatch(alert('danger', err.message));
                });
        }
    };
}

export function changeInvoiceTab(tab) {
    return {
        type: CHANGE_INVOICE_TAB,
        data: tab,
    };
}

export function addListingsToInvoice(listings = [], storeId, unitGroupIds = {}, units = {}) {
    return dispatch => {
        const ls = Array.isArray(listings) ? camelizeKeys(listings) : camelizeKeys([listings]);
        if (ls.length > 0){
            dispatch({ type: ADD_LISTINGS_TO_INVOICE, data: ls });
            dispatch({ type: CALCULATE_INVOICE_ORDER_TOTAL });

            const missingUnitGroupIds = ls.reduce((ids, listing) => {
                if (listing.unitGroupId && !unitGroupIds[listing.unitGroupId]){
                    ids.add(listing.unitGroupId);
                }
                return ids;
            }, new Set());
            fetchInvoiceLineItemUnitGroups(storeId, missingUnitGroupIds)(dispatch);
        }
    };
}

export function removeListingsFromInvoice(indexes = []) {
    return dispatch => {
        const idxs = Array.isArray(indexes) ? indexes : [indexes];
        if (idxs.length > 0){
            dispatch({ type: REMOVE_LISTINGS_FROM_INVOICE, data: idxs });
            dispatch({ type: CALCULATE_INVOICE_ORDER_TOTAL });
        }
    };
}
export function changeInvoiceField(field, value) {
    return dispatch => {
        if (field){
            const specialHandling = {
                billingAddressInfo: (f, v) => {
                    const address = camelizeKeys(v || {});
                    const data = {
                        [f]: address.id ? address : null,
                        billToId: address.id ? address.id : null,
                    };
                    dispatch({ type: CHANGE_INVOICE_FIELDS, data });
                },
                shippingAddressInfo: (f, v) => {
                    const address = camelizeKeys(v || {});
                    const data = {
                        [f]: address.id ? address : null,
                        shipToId: address.id ? address.id : null,
                    };
                    dispatch({ type: CHANGE_INVOICE_FIELDS, data });
                },
            };

            if (specialHandling[field]){
                specialHandling[field](field, value);
            } else {
                dispatch({
                    type: CHANGE_INVOICE_FIELD,
                    data: { field, value },
                });
            }
        }
    };
}

export function changeInvoiceListingQuantity(index, value) {
    return dispatch => {
        dispatch({ type: CHANGE_INVOICE_LISTING_QUANTITY, data: { index, value } });
        dispatch({ type: CALCULATE_INVOICE_ORDER_TOTAL });
    };
}

export function changeInvoiceListingUnit(index, value) {
    return (dispatch) => {
        dispatch({ type: CHANGE_INVOICE_LISTING_UNIT, data: { index, value } });
        dispatch({ type: CALCULATE_INVOICE_ORDER_TOTAL });
    };
}

export const changeInvoiceListingUnitPrice = (index, value) => (dispatch) => {
  dispatch({ type: CHANGE_INVOICE_LISTING_UNIT_PRICE, data: { index, value } });
  dispatch({ type: CALCULATE_INVOICE_ORDER_TOTAL });
};

export function saveInvoice(params = {}) {
    return dispatch => {
        const { type, mode, currentTab, currentStore = {}, multiStore, order } = params;
        const { id: storeId, timezone } = currentStore;
        const { number } = order;
        let mappedLineItems = (order.lineItems||[]).map(
            item => {
                let {
                    id,
                    label,
                    purchasableId,
                    purchasableType,
                    price,
                    unitPrice,
                    quantity,
                    unitQuantity,
                    roundingAmount,
                    baseUnitId,
                    baseUnit,
                    unitId,
                    unit,
                    quantityAllowDecimal,
                } = item;
                price = price.toString();
                unitPrice = unitPrice.toString();
                quantity = quantity.toString();
                unitQuantity = unitQuantity.toString();
                roundingAmount = roundingAmount.toString();
                return {
                    id,
                    label,
                    purchasableId,
                    purchasableType,
                    price,
                    unitPrice,
                    quantity,
                    unitQuantity,
                    roundingAmount,
                    baseUnitId,
                    baseUnit,
                    unitId,
                    unit,
                    quantityAllowDecimal,
                };
            }
        );
        if (!order.rounding.eq(0)){
            mappedLineItems.push({
                id: order.roundingId,
                purchasableType: PURCHASABLE_TYPE_ROUNDING,
                price: order.rounding.toString(),
                quantity: 1,
            });
        }
        if (type && mode && storeId && order && (number || mode === NEW)){
            let data = {
                order: {
                    referenceNumber: order.referenceNumber,
                    effectiveCreatedAt: dateToIso(order.effectiveCreatedAt, timezone),
                    dueDate: order.dueDate,
                    deliveryDate: order.deliveryDate,
                    customerId: order.customerId,
                    billToId: order.billToId,
                    shipToId: order.shipToId,
                    note: order.note,
                    lineItems: mappedLineItems,
                }
            };
            data = decamelizeKeys(data);

            let promise = null;
            if (type === INVOICE_TYPE && mode === NEW){
                dispatch(startFetch());
                promise = invoiceService.createItem(storeId, data);
                promise.then(res => {
                    const { invoice } = res || {};
                  browserHistory.push('/v2' + routeHelper.invoices(storeId, invoice.number));
                });
            } else if (type === INVOICE_TYPE && mode === EDIT){
                dispatch(startFetch());
                promise = invoiceService.updateItem(storeId, number, data);
                promise.then(res => {
                    initInvoiceState(type, VIEW, currentTab, number, currentStore, multiStore)(dispatch);
                });
            } else if (type === QUOTE_TYPE && mode === NEW){
                dispatch(startFetch());
                promise = quoteService.createItem(storeId, data);
                promise.then(res => {
                    const { quote } = res || {};
                  browserHistory.push('/v2' + routeHelper.quotes(storeId, quote.number));
                });
            } else if (type === QUOTE_TYPE && mode === EDIT){
                dispatch(startFetch());
                promise = quoteService.updateItem(storeId, number, data);
                promise.then(res => {
                    initInvoiceState(type, VIEW, currentTab, number, currentStore, multiStore)(dispatch);
                });
            }
            if (promise) {
                return promise.catch(err => {
                    dispatch(stopFetch());
                    dispatch(alert('danger', err.message));
                });
            }
        }
    };
}

export function startEditInvoice(currentTab = OVERVIEW){
    return (dispatch) => {
        dispatch({ type: SET_INVOICE_STATE, data: { currentTab, mode: EDIT } });
    };
}

export function convertQuoteToInvoice(storeId, orderNumber){
    return (dispatch) => {
        dispatch(startFetch());
        const promise = quoteService.convertToInvoice(storeId, orderNumber);
        return promise
            .then(res => {
              routeHelper.goInvoices(storeId, orderNumber);
            })
            .catch(err => {
                dispatch(stopFetch());
                dispatch(alert('danger', err.message));
            });
    };
}

export function cancelInvoice(params = {}){
    return (dispatch) => {
        const { type, mode, currentTab, currentStore = {}, multiStore, order } = params;
        const { id: storeId } = currentStore;
        const { number } = order;
        const msg = `Are you sure to cancel this ${type.toLowerCase()}?`;
        if (confirm(msg)){
            let promise = null;
            if (type === INVOICE_TYPE){
                promise = invoiceService.cancelItem(storeId, number);
            } else {
                promise = quoteService.cancelItem(storeId, number);
            }
            if (promise){
                dispatch(startFetch());
                return promise.then(res => {
                        initInvoiceState(type, mode, currentTab, number, currentStore, multiStore)(dispatch);
                    })
                    .catch(err => {
                        dispatch(stopFetch());
                        dispatch(alert('danger', err.message));
                    });
            }
        }
    };
}

/* istanbul ignore next */
export const confirmVoidTransaction = (storeId, orderNumber, transactionId) => (dispatch, getState) => {
  if (storeId && orderNumber && transactionId) {
    const state = getState();
    const { invoice = {} } = state;
    const { order = {} } = invoice;
    const { saleTransactions = [] } = order;
    const transaction = saleTransactions.find(t => t.id === transactionId);

    if (transaction) {
      const { extra, payment, amount, currency } = transaction;
      const paymentType = extra ? 'Credit Card' : payment;
      const msg = `Are you sure to void the ${formatCurrency(amount, { currency })} ${paymentType} settlement?`;
      return !!confirm(msg);
    }
  }
  return null;
};

export const voidTransaction = (storeId, orderNumber, transactionId) => (dispatch, getState) => {
  dispatch(startFetch());
  return invoiceService.voidTransaction(storeId, orderNumber, transactionId)
    .then(res => {
      refreshInvoice()(dispatch, getState);
    })
    .catch(err => {
      dispatch(stopFetch());
      dispatch(alert('danger', err.message));
    });
};

export const getInvoiceDeliveryNote = () => (dispatch, getState) => {
  const state = getState();
  const { invoice = {} } = state;
  const { currentStore = {}, order = {} } = invoice;
  dispatch(startFetch());
  return deliveryOrderService.getItems(currentStore.id, { order_id: order.id }, 1, 9999)
    .then(res => {
      const json = camelizeKeys(res);
      dispatch(stopFetch());
      dispatch({ type: LOAD_INVOICE_DELIVERY_ORDER_SUCCESS, payload: json.data });
    })
    .catch(err => {
      dispatch(stopFetch());
      dispatch(alert('danger', err.message));
    });
};

/* istanbul ignore next */
export const exportInvoicePdf = (storeId, number) => (dispatch) => {
  dispatch(startFetch());
  return invoiceService.exportPdf(storeId, number)
    .then(res => {
      dispatch(stopFetch());
      if (res.url){
        location.assign(res.url);
      }
    })
    .catch(err => {
      dispatch(stopFetch());
      dispatch(alert('danger', err.message));
    });
};

export const sendInvoice = (storeId, recipient, number) => (dispatch) => {
  return askRecipientThenSendEmail({
    storeId,
    templateType: EMAIL_TEMPLATE_TYPE.INVOICE,
    defaultRecipient: recipient,
    params: {
      order_number: number,
    }
  })(dispatch);
};

export const voidInvoice = (params) => (dispatch) => {
  const { type, mode, currentTab, currentStore = {}, multiStore, order } = params;
  const { id: storeId } = currentStore;
  const { number } = order;
  const msg = `Are you sure to void this invoice?`;
  if (confirm(msg)) {
    dispatch(startFetch());
    return invoiceService.voidItem(storeId, number).then(res => {
      initInvoiceState(type, mode, currentTab, number, currentStore, multiStore)(dispatch);
    })
    .catch(err => {
      dispatch(stopFetch());
      dispatch(alert('danger', err.message));
    });
  }
};

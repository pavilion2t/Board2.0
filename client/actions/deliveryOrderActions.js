import { normalize, arrayOf } from 'normalizr';

import routeHelper from '~/helpers/routeHelper';
import { HANDLE_PROMISE } from '../store/middlewares/handlePromiseMiddleware';
import { InvoiceSchema, ListingSchema } from '../store/middlewares/schema';
import { SET_PATH_STATE } from './baseActions';


import inventoryService from '../services/inventoryService';
import invoiceService from '../services/invoiceService';
import deliveryOrderService from '../services/deliveryOrderService';
import emailTemplateService from '../services/emailTemplateService';
import customerService from '../services/customerService';
import * as emailTemplateActions from './emailTemplateActions';

export const SET_DELIVERY_ORDER_STATE = 'SET_DELIVERY_ORDER_STATE';
export const CLEANUP_DELIVERY_ORDER_FORM = 'CLEANUP_DELIVERY_ORDER_FORM';
export const ADD_INVOICE_TO_DELIVERY_ORDER = 'ADD_INVOICE_TO_DELIVERY_ORDER';
export const REFRESH_DELIVERY_ORDER_ITEMS = 'REFRESH_DELIVERY_ORDER_ITEMS';
export const REMOVE_INVOICE_FROM_DELIVERY_ORDER = 'REMOVE_INVOICE_FROM_DELIVERY_ORDER';
export const REFRESH_DELIVERY_ORDER_OVERVIEW = 'REFRESH_DELIVERY_ORDER_OVERVIEW';
export const REFRESH_DELIVERY_ORDER_HISTORIES = 'REFRESH_DELIVERY_ORDER_HISTORIES';
export const REFRESH_DELIVERY_ORDER_CUSTOMER = 'REFRESH_DELIVERY_ORDER_CUSTOMER';

function getDeliveryOrders(storeId, page, count, orderBy, filters = [], path) {
    return {
        [HANDLE_PROMISE]: {
            promise: deliveryOrderService.getList(storeId, page, count, orderBy, filters),
            actions: {
                type: SET_PATH_STATE,
                stateName: 'delivery_orders',
                path: path,
            }
        }
    };
}

function changeDeliveryOrderTab(currentTab) {
    return dispatch => {
        dispatch({ type: SET_DELIVERY_ORDER_STATE, data: { currentTab } });
    };
}

function initDeliveryOrderForInvoice(storeId, number) {
    return dispatch => {
        dispatch({
            type: SET_DELIVERY_ORDER_STATE,
            data: {
                storeId,
                page: 'new',
                type: 'invoice',
                refId: number,
                currentTab: 'overview',
            }
        });
        dispatch({ type: CLEANUP_DELIVERY_ORDER_FORM });

        addInvoiceToDeliveryOrder(storeId, [number])(dispatch);
    };
}

function addInvoiceToDeliveryOrder(storeId, numbers) {
    return dispatch => {
        let numbersAry = numbers ? (Array.isArray(numbers) ? numbers : [numbers]) : [];

        // Get invoices info
        let invoices = numbersAry.map(number => invoiceService.getItem(storeId, number).then(res => normalize(res.invoice, InvoiceSchema)));
        invoices.forEach(invoice => {
            dispatch({ [HANDLE_PROMISE]: { promise: invoice } });
            invoice.then(data => dispatch({ type: ADD_INVOICE_TO_DELIVERY_ORDER, data: data }));
        });

        // Get missing fields for listings
        Promise.all(invoices).then(invoiceResults => {
            let listingIds = invoiceResults.reduce((ids, invoiceNormalized) => {
                let { result, entities: { invoices } } = invoiceNormalized;
                let invoice = invoices[result];
                return ids.concat((invoice.listing_line_items || []).map(d => d.purchasable_id));
            }, []);
            refreshDeliveryOrderItems(storeId, listingIds)(dispatch);
        });
    };
}

function refreshDeliveryOrderItems(storeId, listingIds) {
    return dispatch => {
        let listings = inventoryService.getItems(storeId, listingIds).then(res => {
            let { data, ...meta } = res;
            let obj = normalize(data.listings, arrayOf(ListingSchema));
            obj.meta = meta;
            return obj;
        });
        dispatch({ [HANDLE_PROMISE]: { promise: listings } });
        listings.then(data => dispatch({ type: REFRESH_DELIVERY_ORDER_ITEMS, data: data }));
    };
}

function removeInvoiceFromDeliveryOrder(numbers) {
    return dispatch => {
        let data = numbers != null ? (Array.isArray(numbers) ? numbers : [numbers]) : [];
        if (data.length > 0) {
            dispatch({ type: REMOVE_INVOICE_FROM_DELIVERY_ORDER, data });
        }
    };
}

function initDeliveryOrderOverview(storeId, deliveryId) {
    return dispatch => {
        dispatch({
            type: SET_DELIVERY_ORDER_STATE,
            data: {
                storeId,
                deliveryId,
                page: 'view',
                currentTab: 'overview',
            }
        });
        dispatch({ type: CLEANUP_DELIVERY_ORDER_FORM });

        let promise = deliveryOrderService.getItem(storeId, deliveryId);
        dispatch({ [HANDLE_PROMISE]: { promise: promise } });
        promise.then(data => {
            let deliveryOrder = data.entities.deliveryOrders[data.result];
            refreshDeliveryOrderOverview(storeId, deliveryOrder)(dispatch);
        });
    };
}

// Refresh Delivery Order Overview page then refresh Delivery Order Items
function refreshDeliveryOrderOverview(storeId, deliveryOrderObject) {
    return dispatch => {
        dispatch({ type: REFRESH_DELIVERY_ORDER_OVERVIEW, data: deliveryOrderObject });
        const { orders = []} = deliveryOrderObject;

        // Query additional info, eg. billing customer, listings' details
        orders.map(order => order.number).forEach(id => addInvoiceToDeliveryOrder(storeId, id)(dispatch));

        // Query customer info
        let promise = customerService.get(storeId, deliveryOrderObject.customer_id);
        dispatch({ [HANDLE_PROMISE]: { promise: promise } });
        promise.then(data => {
            dispatch({ type: REFRESH_DELIVERY_ORDER_CUSTOMER, data: data });
        });
    };
}

function startEditDeliveryOrder(currentTab) {
    return dispatch => {
        dispatch({ type: SET_DELIVERY_ORDER_STATE, data: { page: 'edit' } });
        if (currentTab === 'log') {
            changeDeliveryOrderTab('overview')(dispatch);
        }
    };
}

function createDeliveryOrder(storeId, data) {
    return dispatch => {
        let promise = deliveryOrderService.createItem(storeId, data);
        dispatch({ [HANDLE_PROMISE]: { promise: promise } });
        promise.then(res => {
          routeHelper.goDeliveryNote(storeId, res.result);
        });
    };
}

function updateDeliveryOrder(storeId, deliveryId, data) {
    return dispatch => {
        let promise = deliveryOrderService.updateItem(storeId, deliveryId, data);
        dispatch({ [HANDLE_PROMISE]: { promise: promise } });
        promise.then(res => {
            initDeliveryOrderOverview(storeId, deliveryId)(dispatch);
        });
    };
}

function cancelDeliveryOrder(storeId, deliveryId) {
    return dispatch => {
        let promise = deliveryOrderService.cancelItem(storeId, deliveryId);
        dispatch({ [HANDLE_PROMISE]: { promise: promise } });
        promise.then(res => {
            initDeliveryOrderOverview(storeId, deliveryId)(dispatch);
        });
    };
}

function fulfillDeliveryOrder(storeId, deliveryId, data) {
    return dispatch => {
        let promise = deliveryOrderService.fulfillItem(storeId, deliveryId, data);
        dispatch({ [HANDLE_PROMISE]: { promise: promise } });
        promise.then(res => {
            initDeliveryOrderOverview(storeId, deliveryId)(dispatch);
        });
    };
}

function viewDeliveryOrderLogs(storeId, deliveryId) {
    return dispatch => {
        changeDeliveryOrderTab('log')(dispatch);

        let promise = deliveryOrderService.getItemLogs(storeId, deliveryId);
        dispatch({ [HANDLE_PROMISE]: { promise: promise } });
        promise.then(data => dispatch({ type: REFRESH_DELIVERY_ORDER_HISTORIES, data }));
    };
}

function sendEmailTemplate(storeId, recipient, deliveryOrderId, orderId) {
  return dispatch => {
    return emailTemplateActions.askRecipientThenSendEmail({
      storeId,
      templateType: emailTemplateService.TYPE.DELIVERY_ORDER,
      defaultRecipient: recipient,
      params: {
        delivery_order_id: deliveryOrderId,
        order_id: orderId,
      }
    })(dispatch);
  };
}

export {
getDeliveryOrders,
changeDeliveryOrderTab,
initDeliveryOrderForInvoice,
addInvoiceToDeliveryOrder,
removeInvoiceFromDeliveryOrder,
initDeliveryOrderOverview,
refreshDeliveryOrderOverview,
startEditDeliveryOrder,
createDeliveryOrder,
updateDeliveryOrder,
cancelDeliveryOrder,
fulfillDeliveryOrder,
viewDeliveryOrderLogs,
sendEmailTemplate,
};

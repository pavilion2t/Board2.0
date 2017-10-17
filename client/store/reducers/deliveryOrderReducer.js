import { defaultsDeep } from 'lodash';

import {
    ADD_INVOICE_TO_DELIVERY_ORDER,
    CLEANUP_DELIVERY_ORDER_FORM,
    SET_DELIVERY_ORDER_STATE,
    REFRESH_DELIVERY_ORDER_ITEMS,
    REMOVE_INVOICE_FROM_DELIVERY_ORDER,
    REFRESH_DELIVERY_ORDER_OVERVIEW,
    REFRESH_DELIVERY_ORDER_HISTORIES,
    REFRESH_DELIVERY_ORDER_CUSTOMER,
} from '../../actions/deliveryOrderActions';

const initialState = {
    page: null,
    type: 'invoice',
    refId: null,
    currentTab: 'overview',
    initialValues: {},
    logs: [],
};

export default function storeReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_INVOICE_TO_DELIVERY_ORDER: {
            let { data: {result, entities: {invoices = {}}}} = action;
            let invoice = invoices[result];
            if (result && invoice) {
                let billingCustomerId = invoice.billing_address_info && invoice.billing_address_info.id;
                let billingCustomerName =  invoice.billing_address_info && invoice.billing_address_info.name;
                let billingAddress = invoice.billing_address_info && invoice.billing_address_info.billing_address;
                let billingPhone = invoice.billing_address_info && invoice.billing_address_info.phone;
                let shippingCustomerId = (invoice.shipping_address_info && invoice.shipping_address_info.id) || billingCustomerId;
                let shippingCustomerName =  (invoice.shipping_address_info && invoice.shipping_address_info.name) || billingCustomerName;
                let shippingAddress = invoice.shipping_address || (invoice.shipping_address_info && invoice.shipping_address_info.billing_address) || billingAddress;
                let shippingPhone = (invoice.shipping_address_info && invoice.shipping_address_info.phone) || billingPhone;
                let initialValues = defaultsDeep({}, state.initialValues, {
                    delivery_order: {
                        order_ids: [],
                        billing: {
                            customer_id: billingCustomerId,
                            customer_name: billingCustomerName,
                            address: billingAddress,
                            phone: billingPhone,
                        },
                        delivery_note: {
                            customer_id: shippingCustomerId,
                            customer_name: shippingCustomerName,
                            address: shippingAddress,
                            phone: shippingPhone,
                        }
                    },
                    delivery_order_items: [],
                });

                if (initialValues.delivery_order.order_ids.indexOf(result) === -1) {
                    initialValues.delivery_order.order_ids = [].concat(initialValues.delivery_order.order_ids, result);
                    initialValues.delivery_order_items = initialValues.delivery_order_items.concat(
                        invoice.listing_line_items.map(listing => {
                            let total_quantity = parseFloat(listing.quantity || 0);
                            let qty_fulfilled = parseFloat(listing.qty_fulfilled || 0);
                            let qty_remaining = total_quantity - qty_fulfilled;
                            return {
                                invoice_id: result,
                                invoice_number: invoice.number, // UI only field
                                line_item_id: listing.id,
                                line_item: listing,
                                description: listing.label,
                                total_quantity,          // ordered quantity in order
                                quantity: qty_remaining, // default set to the remaining qty
                                qty_sent: 0,             // sent quantity in DN
                                qty_fulfilled,           // fulfilled quantity in order
                                qty_remaining: 0,        // default set to 0, treat the DN will delivery all the remaining
                                serial_number_enabled: listing.serial_number_enabled,
                                serial_numbers: [],
                            };
                        })
                    );
                }

                let newState = Object.assign({}, state, { initialValues });
                return newState;
            } else {
                return state;
            }
        }

        case CLEANUP_DELIVERY_ORDER_FORM: {
            let newState = Object.assign({}, state, {
                initialValues: {
                    delivery_order: {
                        billing: {},
                        delivery_note: {},
                        order_ids_included: true,
                    },
                    delivery_order_items: []
                }
            });
            return newState;
        }

        case SET_DELIVERY_ORDER_STATE: {
            let { data = {} } = action;
            let newState = Object.assign({}, state, data);
            return newState;
        }

        case REFRESH_DELIVERY_ORDER_ITEMS: {
            let { data = {} } = action;
            if (data.result && data.result.length > 0) {
                let initialValues = defaultsDeep({
                    delivery_order_items: [],
                }, state.initialValues);
                let { entities: { listings = {} } } = data;

                initialValues.delivery_order_items = initialValues.delivery_order_items.map(item => {
                    let {line_item = {}} = item;
                    let {purchasable_id} = line_item;
                    let newItem = item;
                    if (listings[purchasable_id]) {
                        let listing = listings[purchasable_id];
                        newItem = Object.assign({}, item, {
                            description: listing.name,
                            upc: listing.upc || listing.upc_e,
                            ean13: listing.ean13,
                            listing_barcode: listing.listing_barcode,
                            serial_number_enabled: listing.serial_number_enabled,
                            expiration_date_enabled: listing.expiration_date_enabled,
                        });
                    }
                    return newItem;
                });

                let newState = Object.assign({}, state, { initialValues });
                return newState;
            } else {
                return state;
            }
        }

        case REMOVE_INVOICE_FROM_DELIVERY_ORDER: {
            let { data = []} = action;
            if (data.length > 0) {
                let initialValues = defaultsDeep({
                    delivery_order: { order_ids: [] },
                    delivery_order_items: [],
                }, state.initialValues);

                initialValues.delivery_order.order_ids = initialValues.delivery_order.order_ids.filter(id => data.indexOf(id) < 0);
                initialValues.delivery_order_items = initialValues.delivery_order_items.filter(item => data.indexOf(item.invoice_id) < 0);
                let newState = Object.assign({}, state, { initialValues });
                return newState;
            } else {
                return state;
            }
        }

        case REFRESH_DELIVERY_ORDER_OVERVIEW: {
            if (action.data) {
                let { delivery_order_items = [], ...delivery_order } = action.data;

                delivery_order.order_ids_included = (delivery_order.order_ids || []).length > 0;
                delivery_order.stock_transfer_ids_included = (delivery_order.stock_transfer_ids || []).length > 0;
                delivery_order.delivery_note = {
                    customer_id: delivery_order.customer_id,
                    customer_name: delivery_order.customer_name,
                    address: delivery_order.address,
                    phone: delivery_order.phone,
                };
                delivery_order_items = delivery_order_items.map(item => {
                    let { delivery_order_item } = item;
                    let { line_item: { order_id: invoice_id } } = delivery_order_item;
                    let { orders = []} = delivery_order;
                    let invoice_number = (orders.filter(order => order.id === invoice_id)[0] || {}).number;
                    let { line_item: { qty_requested: total_quantity }, quantity, qty_sent, qty_remaining } = delivery_order_item;
                    total_quantity = parseFloat(total_quantity);
                    quantity = parseFloat(quantity);
                    qty_sent = parseFloat(qty_sent);
                    qty_remaining = parseFloat(qty_remaining);
                    let qty_fulfilled = total_quantity - qty_remaining - quantity;
                    return Object.assign({}, delivery_order_item, {
                        invoice_id,
                        invoice_number,
                        total_quantity,
                        quantity,
                        qty_sent,
                        qty_fulfilled,
                        qty_remaining,
                    });
                });

                let initialValues = { delivery_order, delivery_order_items };
                let newState = Object.assign({}, state, { initialValues });
                return newState;
            } else {
                return state;
            }
        }

        case REFRESH_DELIVERY_ORDER_HISTORIES: {
            if (action.data) {
                let { result, entities: { deliveryOrderHistories = {} } } = action.data;
                let logs = result.map(id => deliveryOrderHistories[id]);
                let newState = Object.assign({}, state, { logs });
                return newState;
            } else {
                return state;
            }
        }

        case REFRESH_DELIVERY_ORDER_CUSTOMER: {
            if (action.data) {
                const customer = action.data;
                const initialValues = Object.assign({}, state.initialValues);
                initialValues.delivery_order_items = initialValues.delivery_order_items || [];
                const delivery_order = initialValues.delivery_order = Object.assign({}, initialValues.delivery_order);
                const delivery_note = delivery_order.delivery_note = Object.assign({}, delivery_order.delivery_note);
                delivery_note.email = customer.email;
                const newState = Object.assign({}, state, { initialValues });
                return newState;
            } else {
                return state;
            }
        }

        default: {
            return state;
        }
    }
}

import Big from 'big.js';
import { findIndex } from 'lodash';

import { createReducer } from '../../helpers/reduxHelper';
import { dateTz } from '../../helpers/formatHelper';
import { roundAsBig } from '../../helpers/roundHelper';

import * as actions from '../../actions/index';

import * as constants from '../../constants';

const initialState = {
  type: null,
  mode: null,
  currentTab: null,
  multiStore: false,
  currentStore: null,
  orderNumber: null,
  totalDp: constants.DECIMAL_POINTS_ZERO_DP,
  totalRoundType: constants.ROUNDING_TYPE_NORMAL,
  listingDp: constants.DECIMAL_POINTS_ZERO_DP,
  listingRoundType: constants.ROUNDING_TYPE_NORMAL,
  quantityDp: constants.QUANTITY_DECIMAL_POINTS_FOUR_DP,
  order: {
    lineItems: [],
    totalItems: Big(0),
    subtotal: Big(0),
    tax: Big(0),
    taxError: Big(0),
    discountTotal: Big(0),
    serviceFee: Big(0),
    tips: Big(0),
    charge: Big(0),
    rounding: Big(0),
    total: Big(0),
    paidTotal: Big(0),
    refundTotal: Big(0),
    amountLefted: Big(0),
    roundingId: undefined,
    saleTransactions: [],
    refundTransactions: [],
  },
  history: [],
  isLoadingHistory: false,
  deliveryOrders: [],
};

function initLineItemNumber(item = {}) {
  const ret = Object.assign({}, item);
  [
    'quantity',
    'unitQuantity',
    'qtyFulfilled',
    'qtyFulfilledInDisplayUnit',
    'qtyRefunded',
    'qtyRefundedInDisplayUnit',
    'price',
    'unitPrice',
    'roundingAmount',
    'total',
  ].forEach(key => {
    ret[key] = Big(ret[key] || 0);
  });
  return ret;
}

function patchBaseUnit(item = {}, unitGroups = {}, units = {}) {
  const unitGroup = unitGroups[item.unitGroupId];
  if (unitGroup) {
    const allowedUnits = unitGroup.units.map(unitId => units[unitId]);
    const itemBaseUnit = allowedUnits.find(unit => unit.isBaseUnit);
    // const itemDefaultUnit = allowedUnits.find(unit => unit.id === item.defaultOrderUnitId); // Design fault, don't use this now
    const itemUnit = allowedUnits.find(unit => unit.id === item.unitId) || itemBaseUnit;
    let baseUnitId, baseUnit, unitId, unit, unitRatio, unitPrice;
    if (itemBaseUnit) {
      const { id, name, ratio } = itemBaseUnit;
      baseUnitId = id;
      baseUnit = name;
      unitRatio = Big(ratio);
    }
    if (itemUnit) {
      const { id, name, ratio } = itemUnit;
      unitId = id;
      unit = name;
      unitRatio = Big(ratio);
      unitPrice = Big(item.price).times(unitRatio);
    }
    return Object.assign({}, item, { baseUnitId, baseUnit, unitId, unit, unitRatio, unitPrice });
  }
  return item;
}

function calculateUnitPriceAndLineItemTotal(item, options) {
  const { listingDp, listingRoundType, quantityDp } = options;
  let {
    price,
    unitPrice,
    unitRatio,
    quantity,
    unitQuantity,
    roundingAmount,
    total,
    qtyFulfilled,
    qtyFulfilledInDisplayUnit,
    qtyRefunded,
    qtyRefundedInDisplayUnit,
    quantityAllowDecimal,
  } = item;
  unitQuantity = roundAsBig(unitQuantity || 0, quantityAllowDecimal ? quantityDp : 0);
  quantity = roundAsBig(unitQuantity.times(unitRatio || 1), quantityAllowDecimal ? quantityDp : 0);
  unitPrice = roundAsBig(Big(price || 0).times(unitRatio || 1), 2);
  total = roundAsBig(quantity.times(price), listingDp, listingRoundType);
  roundingAmount = total.minus(quantity.times(price)),
    qtyFulfilledInDisplayUnit = roundAsBig(Big(qtyFulfilled).div(unitRatio || 1), quantityAllowDecimal ? quantityDp : 0);
  qtyRefundedInDisplayUnit = roundAsBig(Big(qtyRefunded).div(unitRatio || 1), quantityAllowDecimal ? quantityDp : 0);
  return Object.assign({}, item, {
    price,
    unitPrice,
    unitRatio,
    quantity,
    unitQuantity,
    roundingAmount,
    total,
    qtyFulfilled,
    qtyFulfilledInDisplayUnit,
    qtyRefunded,
    qtyRefundedInDisplayUnit,
    quantityAllowDecimal,
  });
}

function calculateOrderTotal(state) {
  const order = Object.assign({}, state.order);
  const { totalDp, totalRoundType, listingDp, listingRoundType } = state;
  const totalItems = (order.lineItems || []).reduce((sum, item) => {
    return sum.add(item.unitId ? 1 : item.quantity);
  }, Big(0));
  const subtotal = (order.lineItems || []).reduce((sum, item) => {
    return sum.add(roundAsBig(item.total, listingDp, listingRoundType));
  }, Big(0));
  const taxError =  Big(order.initialIncludedInPriceTaxError || '0');
  const tax = Big(order.tax || '0');
  const discountTotal = Big(order.discountTotal || '0');
  const serviceFee = Big(order.serviceFee || '0');
  const bill = subtotal.add(tax).minus(discountTotal).add(serviceFee);
  const tips = Big(order.tips || '0');
  const total = roundAsBig(bill, totalDp, totalRoundType).add(tips).add(taxError);
  const rounding = total.minus(bill).minus(tips).minus(taxError);
  const paidTotal = Big(order.paidTotal || '0'); // Already deduct refund total
  const refundTotal = Big(order.refundTotal || '0');
  const amountLefted = total.minus(paidTotal);

  order.totalItems = totalItems;
  order.subtotal = subtotal;
  order.tax = tax;
  order.taxError = taxError;
  order.discountTotal = discountTotal;
  order.serviceFee = serviceFee;
  order.tips = tips;
  order.charge = bill;
  order.rounding = rounding;
  order.total = total;
  order.paidTotal = paidTotal;
  order.refundTotal = refundTotal;
  order.amountLefted = amountLefted;
  return Object.assign({}, state, { order });
}

function calculateAllFields(state) {
  const order = Object.assign({}, state.order);
  let lineItems = order.lineItems.map(item => calculateUnitPriceAndLineItemTotal(item, state));
  order.lineItems = lineItems;
  let newState = Object.assign({}, state, { order });
  return calculateOrderTotal(newState);
}

const actionHandlers = {
  [actions.INIT_INVOICE_STATE]: (state, { data }) => {
    return Object.assign({}, initialState, data);
  },
  [actions.SET_INVOICE_STATE]: (state, { data }) => {
    return Object.assign({}, state, data);
  },
  [actions.CHANGE_INVOICE_TAB]: (state, { data }) => {
    return Object.assign({}, state, { currentTab: data });
  },
  [actions.ADD_LISTINGS_TO_INVOICE]: (state, { data = []}) => {
    const { unitGroups = {}, units = {} } = state;
    const order = Object.assign({}, state.order);
    const lineItems = (order.lineItems || []).slice(0);
    const addingLineItems = Array.isArray(data) ? data : [data];
    if (addingLineItems.length > 0){
      addingLineItems.forEach(item => {
        const targetIdx = findIndex(lineItems, lineItem => lineItem.purchasableId === item.id);
        if (targetIdx >= 0){
          let target = Object.assign({}, lineItems[targetIdx]);
          target.unitQuantity = target.unitQuantity.add(1);
          if (target.unitQuantity.lt(target.qtyFulfilledInDisplayUnit)){
            target.unitQuantity = Big(target.qtyFulfilledInDisplayUnit);
          }
          target = calculateUnitPriceAndLineItemTotal(target, state);
          lineItems[targetIdx] = target;
        } else {
          item.purchasableType = constants.PURCHASABLE_TYPE_LISTING;
          item.purchasableId = item.id;
          item.id = null;
          item.label = item.name;
          item.quantity = item.unitQuantity = 0;
          item.unitPrice = item.price;
          item.unitRatio = Big(1);
          item.roundingAmount = Big(0);
          delete item.name;
          item = patchBaseUnit(initLineItemNumber(item), unitGroups, units);
          item.unitQuantity = Big(1);
          item = calculateUnitPriceAndLineItemTotal(item, state);
          lineItems.push(item);
        }
      });
      order.lineItems = lineItems;
      return Object.assign({}, state, { order });
    } else {
      return state;
    }
  },
  [actions.REMOVE_LISTINGS_FROM_INVOICE]: (state, {data = []}) => {
    const order = Object.assign({}, state.order);
    const lineItems = (order.lineItems || []);
    const newLineItems = lineItems.filter((item, i) => data.indexOf(i) < 0);
    if (lineItems.length !== newLineItems) {
      order.lineItems = newLineItems;
      return Object.assign({}, state, { order });
    } else {
      return state;
    }
  },
  [actions.CHANGE_INVOICE_FIELD]: (state, { data = {} }) => {
    const { field, value } = data;
    const order = Object.assign({}, state.order);
    if (field) {
      order[field] = value;
      return Object.assign({}, state, { order });
    } else {
      return state;
    }
  },
  [actions.CHANGE_INVOICE_FIELDS]: (state, { data = {} }) => {
    if (Object.keys(data).length > 0) {
      const order = Object.assign({}, state.order);
      for (let field in data) {
        if (field === 'billingAddressInfo' || field === 'shippingAddressInfo') {
          if (!order.billingAddressInfo && !order.shippingAddressInfo) {
            order.billingAddressInfo = order.shippingAddressInfo = data[field];
            order.billToId = order.shipToId = (data[field] || {}).id || null;
          }
          order[field] = data[field];
          const b = order.billingAddressInfo || {};
          const s = order.shippingAddressInfo || {};
          order.customerId = b.id || s.id || null;
          order.customerName = b.name || s.name || null;
          order.customerPhone = b.phone || s.phone || null;
          order.customerEmail = b.email || s.email || null;
        }
        order[field] = data[field];
      }
      return Object.assign({}, state, { order });
    } else {
      return state;
    }
  },
  [actions.CHANGE_INVOICE_LISTING_QUANTITY]: (state, { data = {} }) => {
    const { index, value } = data;
    const order = Object.assign({}, state.order);
    const lineItems = (order.lineItems || []).slice(0);
    if (lineItems[index]) {
      let item = Object.assign({}, lineItems[index]);
      item.unitQuantity = Big(value || 0);
      if (item.unitQuantity.lt(item.qtyFulfilledInDisplayUnit)){
        item.unitQuantity = Big(item.qtyFulfilledInDisplayUnit);
      }
      item = calculateUnitPriceAndLineItemTotal(item, state);
      lineItems[index] = item;
      order.lineItems = lineItems;
      return Object.assign({}, state, { order });
    } else {
      return state;
    }
  },
  [actions.CHANGE_INVOICE_LISTING_UNIT]: (state, { data = {} }) => {
    const { index, value } = data;
    const { units } = state;
    const unit = units[value];
    const order = Object.assign({}, state.order);
    const lineItems = order.lineItems = (order.lineItems || []).slice(0);
    if (unit && lineItems[index]) {
      let item = Object.assign({}, lineItems[index]);
      let { id: unitId, name: unitName, ratio: unitRatio } = unit;
      item.unitRatio = Big(unitRatio);
      item.unitId = unitId;
      item.unit = unitName;
      item = calculateUnitPriceAndLineItemTotal(item, state);
      lineItems[index] = item;
      order.lineItems = lineItems;
      return Object.assign({}, state, { order });
    } else {
      return state;
    }
  },
  [actions.CHANGE_INVOICE_LISTING_UNIT_PRICE]: (state, { data = {} }) => {
    const { index, value } = data;
    const order = Object.assign({}, state.order);
    const lineItems = (order.lineItems || []).slice(0);
    if (lineItems[index]) {
      let item = Object.assign({}, lineItems[index]);
      item.unitPrice = Big(value || 0);
      item.price = roundAsBig(Big(item.unitPrice).div(item.unitRatio || 1), 2);
      item = calculateUnitPriceAndLineItemTotal(item, state);
      lineItems[index] = item;
      order.lineItems = lineItems;
      return Object.assign({}, state, { order });
    } else {
      return state;
    }
  },
  [actions.CALCULATE_INVOICE_ORDER_TOTAL]: (state) => {
    return calculateOrderTotal(state);
  },
  [actions.LOAD_INVOICE_TO_FORM]: (state, { data = {} }) => {
    const { currentStore = {}, listingDp, listingRoundType } = state;
    const { timezone } = currentStore;
    const {
      listingLineItems = [],
      roundingLineItem,
      subtotal,
      initialTax,
      discountTotal,
      initialServiceFee,
      initialTips,
      initialRounding,
      initialTotal,
      paidTotal,
      amountLefted,
      saleTransactions = [],
      refundTransactions = [],
      ...order
    } = Object.assign({}, data);
    order.effectiveCreatedAt = dateTz(order.effectiveCreatedAt, timezone);
    order.lineItems = listingLineItems
      .map(item => {
        const ret = Object.assign({}, item);
        ret.price = Big(ret.price);
        ret.quantity = Big(ret.quantity);
        ret.unitQuantity = Big(ret.unitQuantity || ret.quantity); // Old data may have null
        ret.roundingAmount = Big(ret.roundingAmount);
        ret.total = roundAsBig(Big(ret.price).times(ret.quantity), listingDp, listingRoundType);
        ret.qtyFulfilled = Big(ret.qtyFulfilled);
        ret.qtyFulfilledInDisplayUnit = Big(ret.qtyFulfilledInDisplayUnit || ret.qtyFulfilled); // Old data may have null
        ret.qtyRefunded = Big(ret.qtyRefunded);
        ret.qtyRefundedInDisplayUnit = Big(ret.qtyRefundedInDisplayUnit || ret.qtyRefunded); // Old data may have null
        // quantityAllowDecimal, unitRatio, unitPrice is not given by default
        ret.quantityAllowDecimal = ret.quantityAllowDecimal == null ? true : ret.quantityAllowDecimal;
        if (ret.unitId == null || ret.unitQuantity.eq(0)) {
          ret.unitRatio = Big(1);
          ret.unitPrice = ret.price;
        } else {
          ret.unitRatio = Big(ret.quantity).div(ret.unitQuantity);
          ret.unitPrice = ret.price.times(ret.unitRatio);
        }
        return ret;
      })
      .sort((a, b) => {
        const aCode = a.lineItemCode;
        const bCode = b.lineItemCode;
        return aCode === bCode ? 0 : aCode > bCode ? 1 : -1;
      });
    order.subtotal = subtotal || 0;
    order.tax = initialTax || 0;
    order.discountTotal = discountTotal || 0;
    order.serviceFee = initialServiceFee || 0;
    order.tips = initialTips || 0;
    order.roundingId = (roundingLineItem || {}).id;
    order.rounding = initialRounding || 0;
    order.total = initialTotal || 0;
    order.paidTotal = paidTotal || 0;
    order.amountLefted = amountLefted || 0;
    order.saleTransactions = saleTransactions.map(t => {
      t.amount = Big(t.amount || 0);
      t.changeAmount = Big(t.changeAmount || 0);
      t.actualPaymentAmount = Big(t.actualPaymentAmount || 0);
      t.amountLefted = Big(t.amountLefted || 0);
      return t;
    });
    order.refundTransactions = refundTransactions.map(t => {
      t.amount = Big(t.amount || 0);
      t.changeAmount = Big(t.changeAmount || 0);
      t.actualPaymentAmount = Big(t.actualPaymentAmount || 0);
      t.amountLefted = Big(t.amountLefted || 0);
      return t;
    });
    let newState = Object.assign({}, state, { order });
    return calculateOrderTotal(newState);
  },
  [actions.PATCH_INVOICE_LISTING_MISSING_INFO]: (state, { data = []}) => {
    const order = Object.assign({}, state.order);
    const lineItems = (order.lineItems || []).map(item => {
      const ret = Object.assign({}, item);
      const match = data.find(i => i.id === item.purchasableId);
      if (match) {
        ret.description = match.description;
        ret.upc = match.upc || match.upc_e;
        ret.ean13 = match.ean13;
        ret.listingBarcode = match.listingBarcode;
        ret.unitGroupId = match.unitGroupId;
        ret.defaultOrderUnitId = match.defaultOrderUnitId;
        ret.quantityAllowDecimal = match.quantityAllowDecimal;
        return ret;
      } else {
        return item;
      }
    });
    order.lineItems = lineItems;
    return Object.assign({}, state, { order });
  },
  [actions.PATCH_INVOICE_LISTING_UNIT_GROUP]: (state, { data = {} }) => {
    const { unitGroups = {}, units = {} } = data;
    const newState = Object.assign({}, state);
    newState.unitGroups = Object.assign({}, state.unitGroups, unitGroups);
    newState.units = Object.assign({}, state.units, units);
    const order = Object.assign({}, state.order);
    order.lineItems = order.lineItems.map(item => patchBaseUnit(item, newState.unitGroups, newState.units));
    newState.order = order;
    return calculateAllFields(newState);
  },
  [actions.LOAD_INVOICE_HISTORY_REQUEST]: (state) => {
    return { ...state, isLoadingHistory: true };
  },
  [actions.LOAD_INVOICE_HISTORY_SUCCESS]: (state, { data = []}) => {
    return { ...state, history: data, isLoadingHistory: false };
  },
  [actions.LOAD_INVOICE_HISTORY_FAILURE]: (state) => {
    return { ...state, isLoadingHistory: false };
  },
  [actions.LOAD_INVOICE_DELIVERY_ORDER_SUCCESS]: (state, { payload = {} }) => {
    const { deliveryOrders = []} = payload;
    return { ...state, deliveryOrders };
  },
};

export default createReducer(initialState, actionHandlers);

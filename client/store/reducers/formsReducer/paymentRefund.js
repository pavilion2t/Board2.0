import Big from 'big.js';
import { createReducer } from '~/helpers/reduxHelper';

import * as actions from '../../../actions/formActions/paymentRefund';

import PaymentRefundModal from '../../../pages/invoice/components/paymentRefundModal';

const { TYPE, DEFAULT_PAYMENT_TYPE } = PaymentRefundModal;

const initialState = {
  loading: false,
  isOpen: false,
  type: TYPE.PAYMENT,
  storeId: '',
  orderNumber: null,
  amountDue: Big(0),
  amountSettled: Big(0),
  amountBalance: Big(0),
  refundTo: null,
  saleTransactions: [],
  refundTransactions: [],
  amount: Big(0),
  max: null,
  tenderAmount: Big(0),
  changeAmount: Big(0),
  tipsAmount: Big(0),
  note: '',
  showTips: false,
  showChange: true,
  errors: [],
  successResponse: null,
  instrumentId: DEFAULT_PAYMENT_TYPE.CASH,
  instrumentName: '',
  paymentInstruments: [],
  cardNumber: '',
  expMonth: '',
  expYear: '',
  cvv: '',
};

const actionHandlers = {
  [actions.PAYMENT_REFUND_INIT]: (state, { payload }) => {
    return Object.assign({}, initialState);
  },
  [actions.PAYMENT_REFUND_OPEN]: (state, { payload }) => {
    if (!payload || !payload.type || !payload.storeId || !payload.orderNumber) return state;
    const max = payload.type === TYPE.PAYMENT ? payload.amountBalance : null;
    return Object.assign({}, state, { isOpen: true, max, ...payload });
  },
  [actions.PAYMENT_REFUND_CLOSE]: (state, { payload }) => {
    return Object.assign({}, state, { isOpen: false });
  },
  [actions.PAYMENT_REFUND_CHANGE_REFUND_TO]: (state, { payload = {} }) => {
    const { refundTo } = payload;
    const { state: oldRefundTo, saleTransactions = []} = state;
    const refundableTransactions = saleTransactions.filter(t => t.amountLefted.gt(0));
    const refundToTransaction = refundableTransactions.filter(t => t.id === refundTo)[0] || refundableTransactions[0];
    if (refundToTransaction) {
      const newRefundTo = refundTo || refundToTransaction.id;
      if (newRefundTo !== oldRefundTo) {
        return Object.assign({}, state, {
          refundTo: newRefundTo,
          amount: refundToTransaction.amountLefted,
          max: refundToTransaction.amountLefted,
        });
      }
    }
    return state;
  },
  [actions.PAYMENT_REFUND_CHANGE_PAYMENT_TYPE]: (state, { payload = {} }) => {
    const { instrumentId } = payload;
    const { paymentInstruments = []} = state;
    const otherPayment = paymentInstruments.find(p => p.id === instrumentId) || {};
    const showTips = otherPayment.tippingEnabled || instrumentId === DEFAULT_PAYMENT_TYPE.CREDIT_CARD;
    const showChange = instrumentId === DEFAULT_PAYMENT_TYPE.CASH;
    return Object.assign({}, state, { instrumentId, showTips, showChange });
  },
  [actions.PAYMENT_REFUND_CHANGE_AMOUNT]: (state, { payload = {} }) => {
    const zero = Big(0);
    let { max, tenderAmount, changeAmount } = state;
    let { amount } = payload;
    amount = max && amount.gt(max) ? Big(max) : amount;
    amount = amount.lt(zero) ? zero : amount;
    tenderAmount = amount.gt(tenderAmount) ? Big(amount) : tenderAmount;
    changeAmount = tenderAmount.minus(amount);
    return Object.assign({}, state, { amount, tenderAmount, changeAmount });
  },
  [actions.PAYMENT_REFUND_CHANGE_TENDER_AMOUNT]: (state, { payload = {} }) => {
    let { amount } = state;
    let { tenderAmount } = payload;
    tenderAmount = Big(tenderAmount);
    if (tenderAmount) {
      tenderAmount = tenderAmount.lt(amount) ? Big(amount) : tenderAmount;
      const changeAmount = tenderAmount.minus(amount);
      return Object.assign({}, state, { tenderAmount, changeAmount });
    }
    return state;
  },
  [actions.PAYMENT_REFUND_CHANGE_FIELDS]: (state, { payload }) => {
    if (!payload) return state;
    return Object.assign({}, state, payload);
  },
  [actions.PAYMENT_REFUND_START_LOADING]: (state, { payload }) => {
    return Object.assign({}, state, { loading: true });
  },
  [actions.PAYMENT_REFUND_STOP_LOADING]: (state, { payload }) => {
    return Object.assign({}, state, { loading: false });
  },
  [actions.PAYMENT_REFUND_CLEAR_ERRORS]: (state, { payload }) => {
    return Object.assign({}, state, { errors: [] });
  },
  [actions.PAYMENT_REFUND_ADD_ERRORS]: (state, { payload }) => {
    if (!payload) return state;
    let { errors = []} = state;
    errors = errors.concat(payload.errors || []);
    return Object.assign({}, state, { errors });
  },
  [actions.PAYMENT_REFUND_SET_ERRORS]: (state, { payload }) => {
    if (!payload) return state;
    let { errors = []} = payload;
    return Object.assign({}, state, { errors });
  },
  [actions.PAYMENT_REFUND_SUCCESS_REFUND]: (state, { payload }) => {
    if (!payload) return state;
    let { order: successResponse, amount } = payload;
    let { amountSettled, amountBalance } = state;
    amountSettled = Big(amountSettled).minus(amount);
    amountBalance = Big(amountBalance).plus(amount);
    return Object.assign({}, state, { successResponse, amountSettled, amountBalance });
  },
  [actions.PAYMENT_REFUND_SUCCESS_PAY]: (state, { payload }) => {
    if (!payload) return state;
    let { order: successResponse, amount } = payload;
    let { amountSettled, amountBalance } = state;
    amountSettled = Big(amountSettled).plus(amount);
    amountBalance = Big(amountBalance).minus(amount);
    return Object.assign({}, state, { successResponse, amountSettled, amountBalance });
  },
};

export default createReducer(initialState, actionHandlers);

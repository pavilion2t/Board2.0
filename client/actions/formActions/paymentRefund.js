import Big from 'big.js';
import moment from 'moment';
import { camelizeKeys, decamelizeKeys } from 'humps';

import invoiceService from '~/services/invoiceService';
import otherPaymentInstrumentService from '~/services/otherPaymentInstrumentService';
import PaymentRefundModal from '../../pages/invoice/components/paymentRefundModal';

const { TYPE, DEFAULT_PAYMENT_TYPE } = PaymentRefundModal;

export const PAYMENT_REFUND_INIT = 'PAYMENT_REFUND_INIT';
export const PAYMENT_REFUND_OPEN = 'PAYMENT_REFUND_OPEN';
export const PAYMENT_REFUND_CLOSE = 'PAYMENT_REFUND_CLOSE';
export const PAYMENT_REFUND_CHANGE_REFUND_TO = 'PAYMENT_REFUND_CHANGE_REFUND_TO';
export const PAYMENT_REFUND_CHANGE_PAYMENT_TYPE = 'PAYMENT_REFUND_CHANGE_PAYMENT_TYPE';
export const PAYMENT_REFUND_CHANGE_AMOUNT = 'PAYMENT_REFUND_CHANGE_AMOUNT';
export const PAYMENT_REFUND_CHANGE_TENDER_AMOUNT = 'PAYMENT_REFUND_CHANGE_TENDER_AMOUNT';
export const PAYMENT_REFUND_CHANGE_FIELDS = 'PAYMENT_REFUND_CHANGE_FIELDS';
export const PAYMENT_REFUND_START_LOADING = 'PAYMENT_REFUND_START_LOADING';
export const PAYMENT_REFUND_STOP_LOADING = 'PAYMENT_REFUND_STOP_LOADING';
export const PAYMENT_REFUND_CLEAR_ERRORS = 'PAYMENT_REFUND_CLEAR_ERRORS';
export const PAYMENT_REFUND_ADD_ERRORS = 'PAYMENT_REFUND_ADD_ERRORS';
export const PAYMENT_REFUND_SET_ERRORS = 'PAYMENT_REFUND_SET_ERRORS';
export const PAYMENT_REFUND_SUCCESS_REFUND = 'PAYMENT_REFUND_SUCCESS_REFUND';
export const PAYMENT_REFUND_SUCCESS_PAY = 'PAYMENT_REFUND_SUCCESS_PAY';

export const startLoading = () => (dispatch) => {
  dispatch({ type: PAYMENT_REFUND_START_LOADING });
};

export const stopLoading = () => (dispatch) => {
  dispatch({ type: PAYMENT_REFUND_STOP_LOADING });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: PAYMENT_REFUND_CLEAR_ERRORS });
};

export const addErrors = (errors) => (dispatch) => {
  dispatch({ type: PAYMENT_REFUND_ADD_ERRORS, payload: { errors } });
};

export const setErrors = (errors) => (dispatch) => {
  dispatch({ type: PAYMENT_REFUND_SET_ERRORS, payload: { errors } });
};

export const openPaymentRefundModal = (type, storeId, order = {}, refundTo) => (dispatch, getState) => {

  const {
    number,
    saleTransactions = [],
    refundTransactions = [],
    total,
    paidTotal,
    refundTotal,
    amountLefted,
  } = order;
  const settled = Big(paidTotal || 0).minus(Big(refundTotal || 0));
  const now = moment();
  const payload = {
    type,
    storeId,
    orderNumber: number,
    amountDue: total,
    amountSettled: settled,
    amountBalance: amountLefted,
    refundTo,
    saleTransactions,
    refundTransactions,
    expYear: now.format('YY'),
    expMonth: now.format('MM'),
  };
  dispatch({ type: PAYMENT_REFUND_INIT });
  dispatch({ type: PAYMENT_REFUND_OPEN, payload });
  if (type === TYPE.PAYMENT) {
    startLoading()(dispatch);
    changeAmount(amountLefted)(dispatch);
    return otherPaymentInstrumentService.getAll(storeId)
      .then(res => {
        const data = camelizeKeys(res);
        let { paymentInstruments = []} = data;
        changeFields({ paymentInstruments })(dispatch);
        stopLoading()(dispatch);
      })
      .catch(err => {
        const errors = err && err.message ? [err.message] : ['Fail to get other payment types.'];
        setErrors(errors)(dispatch);
        stopLoading()(dispatch);
      });
  } else {
    changeRefundTo(refundTo)(dispatch, getState);
  }
};

export const closePaymentRefundModal = () => dispatch => {
  dispatch({ type: PAYMENT_REFUND_CLOSE });
};

export const changeRefundTo = (refundTo) => (dispatch) => {
  dispatch({
    type: PAYMENT_REFUND_CHANGE_REFUND_TO,
    payload: {
      refundTo: refundTo ? Number(refundTo) : null
    }
  });
};

export const changePaymentType = (instrumentId) => (dispatch, getState) => {
  dispatch({ type: PAYMENT_REFUND_CHANGE_PAYMENT_TYPE, payload: { instrumentId } });
};

export const changeAmount = (amount) => (dispatch, getState) => {
  dispatch({ type: PAYMENT_REFUND_CHANGE_AMOUNT, payload: { amount } });
};

export const changeTenderAmount = (tenderAmount) => (dispatch, getState) => {
  dispatch({ type: PAYMENT_REFUND_CHANGE_TENDER_AMOUNT, payload: { tenderAmount } });
};

export const changeField = (field, value) => (dispatch) => {
  dispatch({ type: PAYMENT_REFUND_CHANGE_FIELDS, payload: { [field]: value } });
};

export const changeFields = (fields) => (dispatch) => {
  dispatch({ type: PAYMENT_REFUND_CHANGE_FIELDS, payload: fields });
};

export const refundInvoice = (order = {}) => (dispatch) => {
  const { storeId, orderNumber, refundTo, amount, note } = order;
  if (storeId && orderNumber && refundTo && Big(amount || 0).gt(0)) {
    const transactions = [
      { transaction_id: refundTo, amount: amount.toString(), note }
    ];
    startLoading()(dispatch);
    return invoiceService.returnMoney(storeId, orderNumber, transactions)
      .then(res => {
        const data = camelizeKeys(res);
        const {order} = data;
        dispatch({ type: PAYMENT_REFUND_SUCCESS_REFUND, payload: { order, amount } });
        stopLoading()(dispatch);
      })
      .catch(err => {
        const errors = err && err.message ? [err.message] : ['Fail to refund transactions.'];
        setErrors(errors)(dispatch);
        stopLoading()(dispatch);
      });
  }
};

const validateCreditCard = (payment = {}) => {
  let errors = [];
  const {
    number,
    cvv,
  } = payment;
  if (!number) {
    errors.push('Card Number is required.');
  } else if (!/\d{16}/.test(number)) {
    errors.push('Card Number is not valid');
  }
  if (!cvv) {
    errors.push('CVV/CVC is required.');
  } else if (!/\d{3,4}/.test(cvv)) {
    errors.push('CVV/CVC is not valid');
  }
  return errors;
};

export const payInvoice = (order) => (dispatch) => {
  const {
    storeId,
    orderNumber,
    instrumentId,
    instrumentName,
    amount,
    tipsAmount,
    changeAmount,
    showTips,
    showChange,
    note,
    cardNumber,
    expMonth,
    expYear,
    cvv,
  } = order;

  if (storeId && orderNumber && instrumentId && Big(amount || 0).gt(0)) {
    let errors = [];
    let payment = {
      amount: amount.toString(),
      note,
    };
    if (showChange) {
      payment.changeAmount = changeAmount.toString();
    }
    if (showTips) {
      payment.tipsAmount = tipsAmount.toString();
      payment.amount = amount.add(tipsAmount).toString(); // Tips affect pay amount
    }
    const paymentTypes = {
      [DEFAULT_PAYMENT_TYPE.CASH]: 'cashes',
      [DEFAULT_PAYMENT_TYPE.CHECK]: 'checks',
      [DEFAULT_PAYMENT_TYPE.CREDIT_CARD]: 'creditCards',
      [DEFAULT_PAYMENT_TYPE.STORE_CREDIT]: 'storeCredits',
      [DEFAULT_PAYMENT_TYPE.OCTOPUS]: 'octopuses',
    };
    const otherPaymentType = 'others';
    const paymentType = paymentTypes[instrumentId] ? paymentTypes[instrumentId] : otherPaymentType;
    if (paymentType === otherPaymentType) {
      payment = Object.assign({}, payment, {
        instrumentId,
        instrumentName,
      });
    }
    if (instrumentId === DEFAULT_PAYMENT_TYPE.CREDIT_CARD) {
      payment = Object.assign({}, payment, {
        number: cardNumber,
        expMonth,
        expYear,
        cvv,
      });
      errors = validateCreditCard(payment);
    }

    if (errors.length > 0) {
      setErrors(errors)(dispatch);
    } else {
      const data = { [paymentType]: [payment] };
      const params = decamelizeKeys(data);
      clearErrors()(dispatch);
      startLoading()(dispatch);
      return invoiceService.payMoney(storeId, orderNumber, params)
        .then(res => {
          const data = camelizeKeys(res);
          const { order } = data;
          dispatch({ type: PAYMENT_REFUND_SUCCESS_PAY, payload: { order, amount } });
          stopLoading()(dispatch);
        })
        .catch(err => {
          const errors = err && err.message ? [err.message] : ['Fail to pay transactions.'];
          setErrors(errors)(dispatch);
          stopLoading()(dispatch);
        });
    }
  }
};

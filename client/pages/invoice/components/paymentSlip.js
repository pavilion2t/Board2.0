import React, { PropTypes } from 'react';
import Big from 'big.js';
import { pascalize } from 'humps';

import * as constants from '../../../constants';

import CurrencyInput from '../../../components/input-currency';
import Slip from './slip';

const inputStyle = {
  paddingLeft: 0,
  paddingRight: 0,
};

function createPaymentData(item, i, ary, isRefund, currency) {
  const len = ary.length;
  const ret = [];
  const num = i + 1;
  let suffix = 'th';
  if (num < 10 || num > 20) {
    const remainder = num % 10;
    if (remainder === 1) {
      suffix = 'st';
    } else if (remainder === 2) {
      suffix = 'nd';
    } else if (remainder === 3) {
      suffix = 'rd';
    }
  }
  const count = `${num}${suffix} `;
  const prefix = len === 1 ? '' : count;
  const paymentTitle = `${prefix}${isRefund ? 'Refund' : 'Payment'}`;
  const paymentEl = <CurrencyInput value={ item.amount } currency={ currency } style={ inputStyle } readOnly />;
  ret.push({ field: paymentTitle, value: paymentEl, className: 'slip__detail--bold' });

  if (item.paymentMethod === constants.PAYMENT_METHOD_CP || item.paymentMethod === constants.PAYMENT_METHOD_CNP) {
    const { extra = {} } = item;
    const cardType = pascalize(extra.creditCardType || 'Credit Card');
    const holder = extra.holderName;
    const cardNumber = `**** **** **** ${extra.last4Digits}`;
    ret.push({ field: 'Cardholder', value: holder });
    ret.push({ field: `Pay via ${cardType}`, value: cardNumber });
  } else if (item.paymentMethod === constants.PAYMENT_METHOD_OCTOPUS) {
    ret.push({ field: 'Pay via Octopus', value: item.octopusCardNumber });
  } else {
    ret.push({ field: `Pay via ${item.payment}` });
  }
  return ret;
}

function PaymentSlip(props) {
  const { currency, paidTotal, refundTotal, remaining, saleTransactions = [], refundTransactions = [], showDetails } = props;
  const salesLength = saleTransactions.length;
  const refundLength = refundTransactions.length;
  let details = [];
  const totals = [
    {
      field: 'Paid Total',
      value: <CurrencyInput value={ Big(paidTotal || 0).add(refundTotal || 0) } currency={ currency } style={ inputStyle } readOnly />,
      hide: !showDetails,
    },
    {
      field: 'Refund Total',
      value: <CurrencyInput value={ refundTotal } currency={ currency } style={ inputStyle } readOnly />,
      hide: !showDetails,
    },
    {
      field: 'Settled Amount',
      value: <CurrencyInput value={ paidTotal } currency={ currency } style={ inputStyle } readOnly />,
      hide: showDetails,
    },
    {
      field: 'Amount Remaining',
      value: <CurrencyInput value={ remaining } currency={ currency } style={ inputStyle } readOnly />,
    }
  ];

  if (salesLength > 0) {
    details.push({ title: 'Payment Summary' });
    saleTransactions.forEach((item, i, ary) => {
      details = details.concat(createPaymentData(item, i, ary, false, currency));
    });
  }

  if (refundLength > 0) {
    details.push({ title: 'Refund Summary' });
    refundTransactions
      .map(item => Object.assign({}, item, { amount: Big(-1).times(item.amount || 0) }))
      .forEach((item, i, ary) => {
        details = details.concat(createPaymentData(item, i, ary, true, currency));
      });
  }

  return <Slip details={ showDetails ? details : [] } totals={ totals } style={ { marginTop: 30 } } />;
}

PaymentSlip.propTypes = {
  currency: PropTypes.string,
  paidTotal: PropTypes.instanceOf(Big),
  refundTotal: PropTypes.instanceOf(Big),
  remaining: PropTypes.instanceOf(Big),
  saleTransactions: PropTypes.arrayOf(PropTypes.object),
  refundTransactions: PropTypes.arrayOf(PropTypes.object),
  showDetails: PropTypes.bool,
};

export default PaymentSlip;

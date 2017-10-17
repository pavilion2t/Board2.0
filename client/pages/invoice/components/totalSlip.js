import React, { PropTypes } from 'react';
import Big from 'big.js';

import InputCurrency from '../../../components/input-currency';
import InputNumber from '../../../components/input-number';
import Slip from './slip';

function TotalSlip(props) {
  const { totalItems, subtotal, tax, discountTotal, serviceFee, tips, rounding, total } = props;
  const { currency, totalDp, listingDp } = props;
  const style = { paddingLeft: 0, paddingRight: 0 };
  const details = [
    {
      field: `Total Item${ Big(totalItems || 0).gt(1) ? 's' : ''}`,
      value: <InputNumber value={ totalItems } readOnly style={ style } />
    },
    {
      field: 'Subtotal',
      value: <InputCurrency currency={ currency } dp={ listingDp } value={ subtotal } readOnly style={ style } />
    },
    {
      field: 'Discount',
      value: <InputCurrency currency={ currency } dp={ listingDp } value={ discountTotal } readOnly style={ style } />,
      hide: discountTotal.eq(0)
    },
    {
      field: 'Tax',
      value: <InputCurrency currency={ currency } dp={ listingDp } value={ tax } readOnly style={ style } />,
      hide: tax.eq(0)
    },
    {
      field: 'Service Fee',
      value: <InputCurrency currency={ currency } dp={ listingDp } value={ serviceFee } readOnly style={ style } />,
      hide: serviceFee.eq(0)
    },
    {
      field: 'Tips',
      value: <InputCurrency currency={ currency } dp={ listingDp } value={ tips } readOnly style={ style } />,
      hide: tips.eq(0)
    },
    {
      field: 'Rounding',
      value: <InputCurrency currency={ currency } dp={ listingDp } value={ rounding } readOnly style={ style } />,
      hide: rounding.eq(0)
    },
  ];
  const totals = [
    {
      field: 'Order Total',
      value: <InputCurrency currency={ currency } dp={ totalDp } value={ total } readOnly style={ style } />,
      style: { fontSize: 18 }
    },
  ];
  return (
    <Slip details={ details } totals={ totals } />
  );
}

TotalSlip.propTypes = {
  currency: PropTypes.string,
  totalDp: PropTypes.number,
  listingDp: PropTypes.number,
  totalItems: PropTypes.instanceOf(Big),
  subtotal: PropTypes.instanceOf(Big),
  tax: PropTypes.instanceOf(Big),
  discountTotal: PropTypes.instanceOf(Big),
  serviceFee: PropTypes.instanceOf(Big),
  tips: PropTypes.instanceOf(Big),
  rounding: PropTypes.instanceOf(Big),
  total: PropTypes.instanceOf(Big),
};

export default TotalSlip;

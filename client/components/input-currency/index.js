import React, { PropTypes } from 'react';
import Big from 'big.js';
import { currencySymbol } from '~/helpers/formatHelper';

import InputNumber from '../input-number';

function InputCurrency(props, context) {
    const { currentStore = {} } = context;
    const { currency: defaultCurrency } = currentStore;
    const { currency, ...otherProps } = props;
    const prefix = currencySymbol(currency || defaultCurrency);
    return <InputNumber prefix={ prefix } {...otherProps} />;
}

InputCurrency.contextTypes = {
    currentStore: PropTypes.object,
};

InputCurrency.propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Big),
    ]),
    dp: PropTypes.number,
    currency: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default InputCurrency;

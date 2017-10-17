import moment from 'moment';
import React, { PropTypes } from 'react';

function MonthField(props) {
  const { value, displayFormat = 'MMM', valueFormat = 'MM', className, style, ...otherProps } = props;
  const monthKeys = Array(12).fill(0).map((v, i) => i + 1).map(v => ('0' + v).substr(-2));
  const monthValues = monthKeys.map(v => moment(v, 'MM').format(valueFormat));
  const monthDisplays = monthKeys.map(v => moment(v, 'MM').format(displayFormat));

  return (
    <select className={ className } style={ style } { ...otherProps }>
      {
        monthKeys.map((m, i) =>
          <option key={ m } value={ monthValues[i] }>{ monthDisplays[i] }</option>
        )
      }
    </select >
  );
}

MonthField.contextTypes = {
  currentStore: PropTypes.object.isRequired,
};

MonthField.propTypes = {
  value: PropTypes.string.isRequired,
  displayFormat: PropTypes.string,
  valueFormat: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default MonthField;

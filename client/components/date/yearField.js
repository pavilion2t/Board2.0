import moment from 'moment';
import React, { PropTypes } from 'react';

function YearField(props) {
  const keyFormat = 'YYYY';
  const now = moment().format(keyFormat);
  let {
    value,
    displayFormat = 'YYYY',
    valueFormat = 'YYYY',
    min = now,
    max = now,
    count,
    className,
    style,
    ...otherProps
  } = props;
  count = count != null ? count : min - max;
  const optionKeys = Array(count + 1).fill(0).map((_, i) => parseInt(min) + i);
  const optionValues = optionKeys.map(v => moment(v, keyFormat).format(valueFormat));
  const optionDisplays = optionKeys.map(v => moment(v, keyFormat).format(displayFormat));

  return (
    <select className={ className } style={ style } { ...otherProps }>
      {
        optionKeys.map((m, i) =>
          <option key={ m } value={ optionValues[i] }>{ optionDisplays[i] }</option>
        )
      }
    </select >
  );
}

YearField.contextTypes = {
  currentStore: PropTypes.object.isRequired,
};

YearField.propTypes = {
  value: PropTypes.string.isRequired,
  displayFormat: PropTypes.string,
  valueFormat: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  count: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default YearField;

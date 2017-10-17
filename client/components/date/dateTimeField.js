import React, { PropTypes } from 'react';
import moment from 'moment';
import 'moment-timezone/builds/moment-timezone-with-data-2010-2020';

import './dateTimeField.scss';

import DateTimeDisplay from './dateTimeDisplay';

function DateTimeField(props, context) {
  const { name, value, className = '', style = {}, readOnly, disabled, onChange, offsetTips } = props;
  const timezone = props.timezone ? props.timezone : context.currentStore && context.currentStore.timezone;
  const handleChange = (field, event) => {
    const newValue = event.target.value;
    if (!newValue) {
      onChange(null);
    } else {
      let old = moment(value).isValid() ? moment(value) : moment();
      let date = field === 'date' ? newValue : old.format('YYYY-MM-DD');
      let time = field === 'time' ? newValue : old.format('HH:mm:ss');
      const ret = moment.tz(`${date} ${time}`, timezone).format('YYYY-MM-DDTHH:mm:ssZ');
      onChange(ret);
    }
  };
  let offsetStr = '';
  let dateStr = '';
  let timeStr = '';
  if (value && moment(value).isValid()) {
    const d1 = moment(value).tz(timezone);
    dateStr = d1.format('YYYY-MM-DD');
    timeStr = d1.format('HH:mm:ss');
    if (offsetTips) {
      const d2 = moment().tz(timezone).startOf('day');
      const diff = Math.floor(moment.duration(d1.diff(d2)).asDays());
      if (diff === 0) {
        offsetStr = 'Today';
      } else if (diff > 0) {
        offsetStr = `${diff} Day${diff > 1 ? 's' : ''} Later`;
      } else {
        offsetStr = `${-diff} Day${diff < -1 ? 's' : ''} Before`;
      }
    }
  }

  return (
    <div className="datetime-field">
      {
        !readOnly ? null :
          <DateTimeDisplay
            value={ value }
            timezone={ timezone }
            className={ className }
            style={ style }
            formField
          />
      }
      {
        readOnly ? null :
          <input type="date"
            className={ `form-control datetime-field__date ${className}` }
            style={ style }
            name={ `${name}-date` }
            value={ dateStr }
            readOnly={ readOnly }
            disabled={ disabled }
            onChange={ (event) => handleChange('date', event) } />
      }
      {
        readOnly ? null :
          <input type="time"
            className={ `form-control datetime-field__time ${className}` }
            style={ style }
            name={ `${name}-time` }
            value={ timeStr }
            readOnly={ readOnly }
            disabled={ disabled }
            onChange={ (event) => handleChange('time', event) } />
      }
      <span>{ offsetStr }</span>
    </div>
  );
}

DateTimeField.contextTypes = {
  currentStore: PropTypes.object.isRequired,
};

DateTimeField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  timezone: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  offsetTips: PropTypes.bool,
};

export default DateTimeField;

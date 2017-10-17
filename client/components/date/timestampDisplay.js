import React, { PropTypes } from 'react';
import cz from 'classnames';

import { dateTime } from '../../helpers/formatHelper';

function TimestampDisplay(props, context) {
  const { at, by, formField, className = '', style } = props;
  const cl = cz(className, { 'form-control': formField });
  let timezone = props.timezone ? props.timezone : context.currentStore && context.currentStore.timezone;
  let dateString = at ? dateTime(at, timezone) : '';

  return (
    <span className={ cl } style={ style } readOnly={ formField }>
      <div>{ by }</div>
      <div>{ dateString }</div>
    </span>
  );
}

TimestampDisplay.contextTypes = {
  currentStore: PropTypes.object.isRequired,
};

TimestampDisplay.propTypes = {
  at: PropTypes.string,
  by: PropTypes.string,
  timezone: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  formField: PropTypes.bool,
};

export default TimestampDisplay;

import './status-icon.scss';

import React, { PropTypes } from 'react';

function StatusIcon(props) {
  let { state, customColor } = props;
  let className = `status-icon ${state}`;
  let style = {};
  if (customColor) {
    style.backgroundColor = customColor;
  }

  return (
    state ? <i className={ className } style={ style }></i> : null
  );
}

StatusIcon.propTypes = {
  state: PropTypes.string,
  customColor: PropTypes.string
};

export default StatusIcon;

import React, { PropTypes } from 'react';

function Alert(props) {
  let { style, children} = props;
  let className = 'alert alert-' + style;

  return (
    <div className={ className }>{ children }</div>
  );
}

Alert.propTypes = {
  style: PropTypes.oneOf(['success', 'info', 'warning', 'danger']),
  children: PropTypes.node.isRequired,
};

export default Alert;

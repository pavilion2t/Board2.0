import './action-button.scss';

import React, { PropTypes } from 'react';

function ActionButton(props) {
  let { type, children } = props;
  let className = 'btn btn-action-' + type;
  className += props.defaultTextColor ? ' btn-action--default-text' : '';
  return (
    <button { ...props } className={ className } type="button">{ children }</button>
  );
}

ActionButton.propTypes = {
  type: PropTypes.oneOf(['add', 'delete']),
  defaultTextColor: PropTypes.bool,
  children: PropTypes.node,
};

export default ActionButton;

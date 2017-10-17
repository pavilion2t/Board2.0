import './status.scss';

import React, { PropTypes } from 'react';
import { isFunction } from 'lodash';
import cz from 'classnames';
import StatusIcon from './status-icon';

function Status(props) {
  let { state, label, colorTransformer, labelTransformer, formControl } = props;
  let stateDisplay = label ? label : state ? state.replace('_', ' ') : null;
  if (isFunction(labelTransformer)) stateDisplay = labelTransformer(state);
  let customColor = isFunction(colorTransformer) ? colorTransformer(state) : undefined;
  let className = cz('status', { 'form-control': formControl });
  return (
    !state ? null :
      <span className={ className } readOnly={ formControl }>
        <StatusIcon state={ state } customColor={ customColor }/>
        <span className="status__label">{ stateDisplay }</span>
      </span>
  );
}

Status.propTypes = {
  state: PropTypes.string,
  label: PropTypes.string,
  colorTransformer: PropTypes.func,
  labelTransformer: PropTypes.func,
  formControl: PropTypes.bool,
};

export default Status;

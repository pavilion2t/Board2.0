import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

class FormGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    state: PropTypes.object,
    children: PropTypes.node,
    label: PropTypes.string,
    display: PropTypes.string,
    autoHideHelpText: PropTypes.bool,
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { state, autoHideHelpText, className = '', label, display } = this.props;
    state = state || {};

    return (
      <div className={ cx('form-group', className, { 'has-danger': state.touched && state.invalid }) }>
        {
          label ? <label>{ label }</label> : null
        }
        {
          display != null && display !== '' ?
            <span className="form-control" readOnly>{ display }</span>
            :
            this.props.children
        }
        {
          !autoHideHelpText || state.touched || state.error ?
            <div className="text-help">{ state.touched && state.error }&nbsp;</div>
            :
            null
        }
      </div>
    );
  }
}

export default FormGroup;

import React, { Component, PropTypes } from 'react';
import cz from 'classnames';

import './input-select.scss';

export default class InputSelect extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    wrapperClassName: PropTypes.string,
    inputClassName: PropTypes.string,
  };

  static defaultProps = {
    onClick: () => {},
    disabled: false,
    readOnly: false,
    value: '',
    placeholder: '',
    wrapperClassName: '',
    inputClassName: '',
  };

  render() {
    const {
      disabled, readOnly,
      onClick,
      value, placeholder,
      wrapperClassName, inputClassName,
    } = this.props;
    const cls = cz('input-select', (wrapperClassName || ''), {
      'input-select--readonly': readOnly,
      'input-select--disabled': disabled,
    });
    const editable = !disabled && !readOnly;
    const onClickHandle = editable ? onClick : null;
    return (
      <div className={ cls } onClick={ onClickHandle }>
        { !editable ? null : <i className="fa fa-ellipsis-h"/> }
        <input disabled={ disabled }
               readOnly={ readOnly }
               type="text"
               className={ inputClassName }
               value={ value }
               placeholder={ placeholder }
               onChange={ () => {} }
               />
      </div>
    );
  }
}

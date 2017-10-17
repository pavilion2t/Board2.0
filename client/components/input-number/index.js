import React, { Component, PropTypes } from 'react';
import Big from 'big.js';

import { decodeNumberMask } from '~/helpers/formatHelper';

export default class InputNumber extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Big),
    ]),
    dp: PropTypes.number,
    signAfterPrefix: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    value: 0,
    dp: 2,
    signAfterPrefix: false,
    prefix: '',
    suffix: '',
    onChange: () => {},
    className: '',
    style: {},
    readOnly: false,
    disabled: false,
    placeholder: ''
  };

  //TODO: calculate state in one method
  state = {
      value: this.getValue(this.props.value),
      mask: this.valueToMask(this.props.value),
  };

  componentWillReceiveProps(nextProps){
    // Update state when input element is not focus
    if (document.activeElement !==this.refs.input) {
      this.setState({
        value: this.getValue(nextProps.value),
        mask: this.valueToMask(nextProps.value)
      });
    }
  }

  getValue(value){
    if (value === null || value === ''){
      return ''
    } else {
      return Big(value)
    }
  }

  valueToMask(value){
    if (value === null|| value === '')
      return ''
    return this.decodeMask(Big(value).toString()).formatted;
  }

  decodeMask(mask){
    const { dp, prefix = '', suffix = '', signAfterPrefix } = this.props;
    return decodeNumberMask(mask, {dp, prefix, suffix, signAfterPrefix});
  }

  onFocus = () => {
    const input = this.refs.input;
    input.select();
  };

  callOnChange(value){
    if (typeof this.props.onChange === 'function'){
      this.props.onChange(value);
    }
  }

  onBlur = () => {
    const { value } = this.state;
    const mask = this.valueToMask(value);
    this.setState({ value, mask });
    this.callOnChange(value);
  };

  onKeyPress = (event) => {
    const validKey = '0123456789-' + (this.props.dp > 0 ? '.' : '');
    const key = event.data;

    if (validKey.indexOf(key) < 0){
      event.preventDefault();
    }
  };

  onChange = (event) => {
    const newMask = event.target.value || '';

    if (newMask === ''){
      this.setState({ value: Big(0), mask: '' });
    } else {
      const decode = this.decodeMask(newMask);
      if (decode.valid){
        this.setState({ value: decode.value, mask: decode.mask });
      }
    }
  };

  render() {
    const { className = '', style = {}, readOnly, disabled, placeholder } = this.props;
    const { mask } = this.state;
    const eventHandler = readOnly ? {} : {
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onBeforeInput: this.onKeyPress,
      onChange: this.onChange,
    };
    return (
        <input
          ref="input"
          className={ `form-control ${className}` }
          style={ Object.assign({ textAlign: 'right' }, style) }
          type="text"
          value={ mask }
          readOnly={ readOnly }
          disabled={ disabled }
          { ...eventHandler }
          placeholder={ placeholder }
        />
    );
  }
}

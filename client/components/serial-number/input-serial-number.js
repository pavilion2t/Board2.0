import React, { Component, PropTypes } from 'react';
import { uniq, union } from 'lodash';

class InputSerialNumber extends Component {

  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    style: PropTypes.object,
  };

  static trimSn = (sns) => uniq((sns || []).map(sn => (sn || '').trim()).filter(sn => sn));
  static diffSn = (perv, next) => {
    const prevSn = InputSerialNumber.trimSn(perv);
    const nextSn = InputSerialNumber.trimSn(next);
    const snDiff = prevSn.length !== nextSn.length || union(prevSn, nextSn).length !== prevSn.length;
    return snDiff;
  };

  constructor(props) {
    super(props);
    this.state = this.getByValue(props.value);
  }

  componentWillReceiveProps = (nextProps) => {
    if (InputSerialNumber.diffSn(this.state.value, nextProps.value)) {
      this.setState(this.getByValue(InputSerialNumber.trimSn(nextProps.value)));
    }
  };

  getByValue = (value) => {
    const v = (value !== undefined ? value : this.state.value) || [];
    const mask = v.join('\n');
    return { value: v, mask };
  };

  getStateMask = (mask) => {
    const m = (mask !== undefined ? mask : this.state.mask) || '';
    const value = InputSerialNumber.trimSn(m.split('\n'));
    return { value, mask: m };
  }

  handleOnChange = (event) => {
    const value = event.target.value;
    const s = this.getStateMask(value);
    this.setState(s);
    this.props.onChange && this.props.onChange(s.value);
  };

  render() {
    const { value, onChange, style = {}, ...rest } = this.props;
    const combineStyle = Object.assign({}, { minHeight: 200 }, style);
    const { mask } = this.state;
    return (
      <textarea { ...rest } style={ combineStyle } value={ mask } onChange={ this.handleOnChange } />
    );
  }
}

export default InputSerialNumber;

import React, { Component, PropTypes } from 'react';
import ModalToggle from '../modal/modal-toggle';
import HouseNumber from '../house-number';
import InputSerialNumber, { diffSn } from './input-serial-number';

class CountSerialNumber extends Component {

  static propTypes = {
    value: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ])
    ),
    productName: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = this.getByValue(props.value);
  }

  componentWillReceiveProps = (nextProps) => {
    const prevSn = this.state.value;
    const nextSn = this.getByValue(nextProps.value).value;
    if (diffSn(prevSn, nextSn)) {
      this.setState({ value: nextSn });
    }
  };

  getByValue = (value) => {
    const sn = (value || this.state.value || [])
      .map(v => typeof v === 'string' ? v : v.number ? v.number : '')
      .filter(v => v);
    return { value: sn };
  };

  handleOnChange = (value) => {
    this.setState({ value });
  };

  handleOnClose = () => {
    this.setState(this.getByValue(this.props.value));
  };

  handleOnConfirm = () => {
    return this.props.onConfirm ? this.props.onConfirm(this.state.value) : undefined;
  };

  render() {
    const { value: propValue, productName = '', onConfirm, readOnly, ...rest } = this.props;
    const { value } = this.state;
    return (
      <ModalToggle
        { ...rest }
        onConfirm={ this.handleOnConfirm }
        onClose={ this.handleOnClose }
        togglerLabel={ <HouseNumber value={ value } /> }
        header={ productName }
      >
        <InputSerialNumber
          value={ value }
          className="form-control"
          style={
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }
          }
          readOnly={ readOnly }
          onChange={ this.handleOnChange }
          />
      </ModalToggle>
    );
  }
}

export default CountSerialNumber;

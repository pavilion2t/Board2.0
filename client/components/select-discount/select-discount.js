import './select-discount.scss';

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as selectDiscountSelectors from '~/selectors/components/selectDiscountSelectors';
import * as selectDiscountActions from '~/actions/componentActions/selectDiscountActions';

import InputSelect from '~/components/input-select';
import SelectDiscountModal from './select-discount-modal';

const mapStateToProp = (state, props, context) => {
  return {
    selected: selectDiscountSelectors.getSelectedDiscount(state, props),
    value: props.value
  };
};

const mapDispatchToProp = (dispatch) => {
  const actions = {
    ...selectDiscountActions,
  };
  return bindActionCreators(actions, dispatch);
};

@connect(mapStateToProp, mapDispatchToProp)
export default class SelectDiscount extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    placeholder: PropTypes.string,
    name:        PropTypes.string,
    modalState:  PropTypes.object,
    onConfirm:   PropTypes.func,
    onCancel:    PropTypes.func,
    openSelectDiscountModal: PropTypes.func,
    valueDisplay: PropTypes.object,
    selected: PropTypes.number,
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: 'Select a discount...',
    name:        'discount',
  };

  openModal = () => {
    const {
      name,
      modalState,
      openSelectDiscountModal,
    } = this.props;
    openSelectDiscountModal(name, modalState);
  };

  handleOnConfirm = (event, modalState) => {
    const {
      onConfirm,
      selected
    } = this.props;
    onConfirm(selected)
  };

  render() {
    const {
      name,
      value,
      placeholder,
      readOnly
    } = this.props;
    return (
      <span>
        <InputSelect
          inputClassName="form-control"
          placeholder={ placeholder }
          value={ value?value.name:'' }
          onClick={ this.openModal }
          readOnly={ readOnly }
        />
        <SelectDiscountModal
          name={ name }
          onConfirm={ this.handleOnConfirm }
          />
      </span>
    );
  }
}

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Loading from '~/components/loading/loading'

import FilterInput from './FilterInput'
import Discount from './Discount'

import * as selectDiscountSelectors from '~/selectors/components/selectDiscountSelectors';
import * as selectDiscountActions from '~/actions/componentActions/selectDiscountActions';

import {
  Modal,
  ModalContainer,
  ModalHeader,
  ModalContent,
  ModalBottom
} from '~/components/modal';

const mapStateToProp = (state, props, context) => {
  return {
    isOpen: selectDiscountSelectors.getIsOpen(state, props),
    loading: selectDiscountSelectors.getLoading(state, props),
    pathState: selectDiscountSelectors.getComponentState(state, props),
    discounts: selectDiscountSelectors.getFilteredDiscountOptions(state, props),
    selected: selectDiscountSelectors.getSelected(state)
  };
};

const mapDispatchToProp = (dispatch) => {
  const actions = {
    ...selectDiscountActions,
  };
  return bindActionCreators(actions, dispatch);
};

@connect(mapStateToProp, mapDispatchToProp)
export default class SelectDiscountModal extends Modal {
  static propTypes = {
    name: PropTypes.string,
    isOpen: PropTypes.bool,
    loading: PropTypes.bool,
    pathState: PropTypes.object,
  };
  static contextTypes = {
    currentStore: React.PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps){
    let nextIsOpen = nextProps.isOpen
    let isOpen = this.props.isOpen
    if (nextIsOpen && !isOpen){
      this.props.loadDiscountOptions(this.context.currentStore.id)
    }
  }

  handleOnCancel = () => {
    const {
      onCancel,
      pathState,
      closeSelectDiscountModal,
    } = this.props;
    closeSelectDiscountModal();
    if (typeof onCancel === 'function') {
      onCancel(pathState);
    }
  };

  handleOnConfirm = () => {
    const {
      onConfirm,
      selected,
      pathState,
      closeSelectDiscountModal,
    } = this.props;
    closeSelectDiscountModal();
    if (typeof onConfirm === 'function') {
      onConfirm(selected, pathState);
    }
  };

  handleSelect = (discount)=>{
    this.props.selectDiscount(discount)
  }

  renderChildren() {
    const {
      loading,
      discounts,
      isOpen,
      selected
    } = this.props;

    if (!isOpen)
      return null

    // let customerHeader = this.props.customerHeader ? this.props.customerHeader() : null;
    return (
      <ModalContainer >
        <ModalHeader title="Select Discount" />
        <ModalContent>
          {loading?<Loading/>:(
            <div className="select-discount-modal">
              <FilterInput />
              <div className="discount-options">
              {discounts.map(discount=>(
                <Discount key={discount.id} discount={discount} onSelect={this.handleSelect} active={discount.id===selected}/>
              ))}
              </div>
            </div>
          )}
        </ModalContent>
        <ModalBottom>
          <button className="btn btn-secondary" onClick={ this.handleOnCancel }>Cancel</button>
          <button className="btn btn-primary" onClick={ this.handleOnConfirm }>Confirm</button>
        </ModalBottom>
      </ModalContainer>
    );
  }
}

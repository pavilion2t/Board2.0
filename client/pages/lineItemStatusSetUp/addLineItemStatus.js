import React, { PropTypes } from 'react';

import { Modal, ModalContainer, ModalHeader, ModalContent, ModalBottom } from '~/components/modal';
import InputBox from '~/components/input-box';

export default class AddLineItemStatus extends Modal {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isCreating: PropTypes.bool.isRequired,
    input: PropTypes.object.isRequired,
    closeAddLineItemStatus: PropTypes.func.isRequired,
    changeLineItemStatusInput: PropTypes.func.isRequired,
    saveLineItemStatus: PropTypes.func.isRequired,
  };

  renderChildren(){
    const { input, isCreating, closeAddLineItemStatus, changeLineItemStatusInput, saveLineItemStatus } = this.props;

    let title = isCreating ? 'New Line Item Status': 'Update Line Item Status';

    return (
      <ModalContainer >
        <ModalHeader title={ title } />
        <ModalContent>
          <InputBox type="string"
                    value={ input.value }
                    success={ input.success }
                    failure={ input.failure }
                    onChange={ (e) => changeLineItemStatusInput(e.target.value) }/>
        </ModalContent>
        <ModalBottom>
          <button className="_secondary"
                  onClick={ closeAddLineItemStatus }>Cancel</button>
          <button className="_primary"
                  onClick={ saveLineItemStatus }>Save</button>
        </ModalBottom>
      </ModalContainer>
    );
  }
}

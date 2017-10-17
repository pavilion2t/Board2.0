import React, { Component, PropTypes } from 'react';

import { Modal, ModalContainer, ModalHeader, ModalContent, ModalBottom } from '~/components/modal';
import InputAdd from '~/components/input-add';

class StatusItem extends Component {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  render() {
    const { label, checked, onClick } = this.props;
    return (
      <p>
        <input type="checkbox"
               onChange={ () => onClick(!checked) }
               checked={ checked }/>
        { label }
      </p>
    );
  }
}

export default class SelectStatus extends Modal {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    all: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    input: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    store_id: PropTypes.string.isRequired,
    closeStatusSelection: PropTypes.func.isRequired,
    changeStatusInput: PropTypes.func.isRequired,
    toggleStatusSelection: PropTypes.func.isRequired,
    createStatus: PropTypes.func.isRequired,
    submitStatusSelection: PropTypes.func.isRequired
  };

  handleAdd = () => {
    const { input, createStatus, store_id } = this.props;
    let status = input.value;
    let color = '#FFFFFF';
    createStatus({ status, color, store_id });
  };

  renderChildren(){
    const {
      all,
      selected,
      input,
      closeStatusSelection,
      changeStatusInput,
      toggleStatusSelection,
      submitStatusSelection
    } = this.props;

    let selectedIds = selected.map(s => s.line_item_status_id);

    return (
      <ModalContainer >
        <ModalHeader title="Select Status"/>
        <ModalContent>
          { (all && all.length > 0) && all.map((item, i) => {
            const { line_item_status_name, line_item_status_id } = item;
            return (
              <StatusItem key={ i }
                          onClick={ (value) => toggleStatusSelection({ item, checked:value }) }
                          checked={ selectedIds.indexOf(line_item_status_id) > -1 }
                          label={ line_item_status_name } />
            );
          }) }
          <InputAdd  value={ input.value }
                     onAdd={ this.handleAdd }
                     onChange={ changeStatusInput }
                     failure={ input.failure }/>
        </ModalContent>
        <ModalBottom>
          <button className="_secondary"
                  onClick={ closeStatusSelection }>Cancel</button>
          <button className="_primary"
                  onClick={ submitStatusSelection }>Save</button>
        </ModalBottom>
      </ModalContainer>
    );
  }
}

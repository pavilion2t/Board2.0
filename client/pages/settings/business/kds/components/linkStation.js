import React, { PropTypes } from 'react';

import { Modal, ModalContainer, ModalHeader, ModalContent, ModalBottom } from '~/components/modal';
import InputBox from '~/components/input-box';

export default class LinkStationModal extends Modal {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      stationKey: ''
    };
  }

  handleSubmit() {
    const { onSubmit } = this.props;
    onSubmit(this.state.stationKey);
  }

  handleChange(event) {
    this.setState({ stationKey: event.target.value });
  }

  renderChildren(){
    const { onRequestClose, failure } = this.props;
    const { stationKey } = this.state;

    return (
      <ModalContainer>
        <ModalHeader title="Link Up New KDS" onRequestClose={ onRequestClose }/>
        <ModalContent>
          <InputBox title="Enter the station key shown on the station device screen"
                    type="text"
                    value={ stationKey }
                    failure={ failure }
                    placeholder=""
                    containerClass="_long"
                    onChange={ this.handleChange }/>
        </ModalContent>
        <ModalBottom>
          <button className="btn btn-primary btn-sm"
                  onClick={ this.handleSubmit }>Add</button>
        </ModalBottom>
      </ModalContainer>
    );
  }
}

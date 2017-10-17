import React, { PropTypes } from 'react';

import { Modal, ModalContainer, ModalHeader, ModalContent, ModalBottom } from '~/components/modal';
import InputBox from '~/components/input-box';

export default class LinkDisplayModal extends Modal {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    success: PropTypes.bool.isRequired,
    failure: PropTypes.bool.isRequired
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
    const { onRequestClose, success, failure } = this.props;
    const { stationKey } = this.state;

    return (
      <ModalContainer>
        <ModalHeader title="LINK UP BINDO DISPLAY" onRequestClose={ onRequestClose }/>
        <ModalContent>
          <InputBox title="Enter the Bindo Display key shown on the Bindo Display screen"
                    type="text"
                    value={ stationKey }
                    failure={ failure }
                    success={ success }
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

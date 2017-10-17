import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
  },
  overlay: {
    zIndex: 9999
  }
};


class InputDialog extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  handleSave = (e) => {
    let input = findDOMNode(this.refs.input);

    this.props.onSave(input.value);
  }

  handleCancel = (e) => {
    this.props.onCancel();
  }

  render() {
    return (
      <Modal isOpen={ this.props.isOpen }
        style={ customStyles }>
        <h1>{ this.props.title }</h1>
        <div>
          <input type="text" ref="input"/>
          <button onClick={ this.handleSave }>Save</button>
          <button onClick={ this.handleCancel }>Cancel</button>
        </div>
      </Modal>
    );
  }
}

export default InputDialog;

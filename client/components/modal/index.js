import React, { Component, PropTypes } from 'react';
import { default as BaseModal } from 'react-modal';

import './modal.scss';

const defaultStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    padding               : '0px',
    border                : '0px',
    transform             : 'translate(-50%, -50%)'

  },
  overlay: {
    zIndex: 1000,
    background: 'rgba(0,0,0,.2)',
    cursor: 'default'
  }
};

export class ModalHeader extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onRequestClose: PropTypes.func,
    children: PropTypes.node,
  };

  render() {
    const { title, onRequestClose } = this.props;

    return (
      <div className="modal__header">
        { this.props.children }
        <h5 className="modal__title">{ title }</h5>
        { onRequestClose && <button type="button" className="close" onClick={ onRequestClose }><span >&times;</span></button> }
      </div>
    );
  }
}

export class ModalContent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    const { children } = this.props;

    return (
      <div className="modal__content">
        { children }
      </div>
    );
  }
}

export class ModalBottom extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    const { children } = this.props;

    return (
      <div className="modal__bottom">
        { children }
      </div>
    );
  }
}

export class Modal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    style: PropTypes.object
  };

  renderChildren() {
    return null;
  }

  render(){
    const { isOpen, onRequestClose, onAfterOpen } = this.props;
    let style = this.props.style || {};
    let contentStyle = Object.assign({}, defaultStyles.content, style.content || {});
    let overlayStyle = Object.assign({}, defaultStyles.overlay, style.overlay || {});
    let computedStyle = { content: contentStyle, overlay: overlayStyle };

    return (
      <BaseModal isOpen={ isOpen }
                 onAfterOpen={ () => onAfterOpen ? onAfterOpen() : null }
                 onRequestClose={ () => onRequestClose ? onRequestClose() : null }
                 style={ computedStyle }>
        { this.renderChildren() }
      </BaseModal>
    );
  }
}

export class ModalContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    const { children } = this.props;

    return (
      <div className="_modal">
        { children }
      </div>
    );
  }
}

import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';

class ModalToggle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    open() {
        let { isOpen, ...other } = this.state;
        isOpen = true;
        this.setState({ isOpen, ...other });
    }

    close() {
        let { isOpen, ...other } = this.state;
        isOpen = false;
        this.setState({ isOpen, ...other });
        this.props.onClose && this.props.onClose();
    }

    confirm() {
        let ret = this.props.onConfirm();
        let { isOpen, ...other } = this.state;
        isOpen = ret;
        this.setState({ isOpen, ...other });
    }

    render() {
        const open = this.open.bind(this);
        const close = this.close.bind(this);
        const confirm = this.confirm.bind(this);
        const {
            togglerLabel, togglerClassName = 'btn btn-sm btn-primary', togglerStyle,
            header, children, footer
        } = this.props;
        const { isOpen } = this.state;
        let hasToggler = !!(togglerLabel || togglerClassName || togglerStyle);

        return (
            <span>
                {
                    !hasToggler ? null :
                      (
                        typeof togglerLabel !== 'string' ?
                          <span onClick={ open }>{ togglerLabel }</span> :
                          <span className={ togglerClassName } style={ togglerStyle } onClick={ open }>{ togglerLabel }</span>
                      )
                }
                <Modal className="ReactModal__Content--fixed" isOpen={ isOpen } onRequestClose={ close }>
                    <div className="modal-content">
                        <div className="modal-header">{ header }</div>
                        <div className="modal-body">{ children }</div>
                        <div className="modal-footer">
                            {
                                footer ? footer : (
                                    <span>
                                        <span className="btn btn-sm btn-secondary" onClick={ close }>Cancel</span>
                                        <span className="btn btn-sm btn-primary" onClick={ confirm }>Done</span>
                                    </span>
                                )
                            }
                        </div>
                    </div>
                </Modal>
            </span>
        );
    }
}

ModalToggle.propTypes = {
    header: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    togglerLabel: PropTypes.node,
    togglerClassName: PropTypes.string,
    togglerStyle: PropTypes.object,
};

export default ModalToggle;

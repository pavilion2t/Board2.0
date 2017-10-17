import React, { PropTypes, Component } from 'react';

import { removeVoucher } from '../../actions/voucherActions';
import Modal from 'react-modal';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


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

const mapStateToProps = (state) => {
  const { entities: { vouchers } } = state;

  return {
    vouchers: vouchers
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = { removeVoucher };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};



class DeleteItem extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.shape({
      store_id: PropTypes.string.isRequired,
      discount_id: PropTypes.string.isRequired
    }).isRequired,
    actions: PropTypes.object
  };


  state = {
    openDialog: true
  };


  handleSave = () => {
    const { params } = this.props;
    this.setState({ openDialog: false});
    const { removeVoucher } = this.props.actions;
    removeVoucher(params.store_id, params.discount_id);

    this.context.router.goBack();
  };

  handleCancel = () => {
    this.setState({ openDialog: false});
    this.context.router.goBack();
  };

  render() {
    return (
      <Modal isOpen={ this.state.openDialog }
        style={ customStyles }>
        <h2>確定刪除?</h2>
        <div>
          <button onClick={ this.handleSave.bind(this) }>Save</button>
          <button onClick={ this.handleCancel.bind(this) }>Cancel</button>
        </div>
      </Modal>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(DeleteItem);


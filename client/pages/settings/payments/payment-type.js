import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import map from 'lodash/map';

import { getOtherPaymentInstrument, updateOtherPaymentInstrument } from '~/actions';
import PaymentEdit from './payment-type-edit';
import PaymentView from './payment-type-view';


function mapStateToProps(state, ownProps) {
  let pathname = ownProps.location.pathname;
  let pathState = state.path[pathname] || {};
  let pageState = {};

  try {
    pageState.payment_instruments = map(pathState.payment_instruments, paymentId => state.entities.payment_instruments[paymentId]);
  } catch (e) {
    console.warn('payment_instruments not ready');
    pageState.payment_instruments = null;
  }


  return pageState;
}
function mapDispatchToProps(dispatch) {
  const actions = { getOtherPaymentInstrument, updateOtherPaymentInstrument };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class PaymentType extends Component {
  static propTypes = {
    actions: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    payment_instruments: PropTypes.array,
  }
  static contextTypes = {
    currentStore: React.PropTypes.object.isRequired
  }
  state = {
    editMode: false,
  }

  componentDidMount() {
    const { params, location, actions } = this.props;
    actions.getOtherPaymentInstrument(params.store_id, location.pathname);
  }
  enterEditMode = () => {
    this.setState({editMode: true});
  }
  exitEditMode = () => {
    this.setState({editMode: false});
  }
  submitForm = () => {
    this.refs.paymentForm.submit();
  }
  updatePayment = (data) => {
    const { params, location, actions } = this.props;
    actions.updateOtherPaymentInstrument(params.store_id, data, location.pathname).then(res => {
      this.exitEditMode();
    });
  }


  updateSettings = (data) => {
    const { updateStoreModule } = this.props.actions;
    const { store_id } = this.props.params;

    updateStoreModule(store_id, {store_id: store_id, module: data});
  }

  render() {
    const { payment_instruments } = this.props;

    let formInitialValues = { payment_instruments: payment_instruments};

    return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Payment Type</h1>
            {
              this.state.editMode ? (
                <div>
                  <button className="btn btn-secondary btn-sm" onClick={ this.exitEditMode }>Cancel</button> &nbsp;
                  <button className="btn btn-primary btn-sm" onClick={ this.submitForm }>Save</button>
                </div>

              ) : (
                <div>
                  <button className="btn btn-primary btn-sm" onClick={ this.enterEditMode }>Edit</button>
                </div>

              )
            }
          </header>
          <div className="main-content-section">
            {
              this.state.editMode ? (
                <PaymentEdit initialValues={ formInitialValues } ref="paymentForm" onSubmit={ this.updatePayment } />

              ) : (
                <PaymentView data={ payment_instruments } />
              )
            }
          </div>
        </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PaymentType);

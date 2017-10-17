import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../actions/index';

import { get } from 'lodash';
import { GridBody } from '~/components/grid';
import {
  statusComponent,
  timeComponent,
  decimalComponent
} from '~/components/griddle-components';
import Loading from '~/components/loading/loading';


const mapStateToProps = (state) => {
  let { order, history: data, isLoadingHistory: isLoading } = state.invoice;
  return { order, data, isLoading };
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

@connect(mapStateToProps, mapDispatchToProps)
@statusComponent
@timeComponent
@decimalComponent
export default class InvoiceLog extends Component {
  static contextTypes = {
    currentStore: PropTypes.object.isRequired
  };

  static propTypes = {
    order: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.columns = [
      { columnName: 'createdAt', displayName: 'DATE', customComponent: this.timeComponent },
      {
        columnName: 'cashier',
        displayName: 'USER',
        customComponent: (props) => <span>{ get(props, 'data.displayName') }</span>
      },
      { columnName: 'correspondenceState', displayName: 'PAYMENT STATUS', customComponent: this.statusComponent() },
      { columnName: 'owingAmount', displayName: 'AMOUNT OWED', customComponent: this.decimalComponent }
    ];
  }

  componentDidMount() {
    this.props.actions.getInvoiceHistory();
  }

  renderContent() {
    const { total, paidTotal, balance } = this.props.order;
    let displayTotal = total ? total.toFixed(2) : '';
    let displayPaidTotal = paidTotal ? paidTotal.toFixed(2) : '';

    return (
      <div className="wrapper">
        <div className="row">
          <div className="col-sm-4 col-md-2">
            <div className="input-box">
              <p className="input-box__title">Invoice Total</p>
              <span className="input-box__input">{ displayTotal }</span>
            </div>
          </div>
          <div className="col-sm-4 col-md-2">
            <div className="input-box">
              <p className="input-box__title">Paid</p>
              <span className="input-box__input">{ displayPaidTotal }</span>
            </div>
          </div>
          <div className="col-sm-4 col-md-2">
            <div className="input-box">
              <p className="input-box__title">Owing</p>
              <span className="input-box__input">{ balance }</span>
            </div>
          </div>
        </div>
        <div className="grid">
          <GridBody data={ this.props.data }
                    columns={ this.columns }/>
        </div>
      </div>);
  }

  render() {
    return this.props.isLoading ? (<Loading>Loading ...</Loading>) : this.renderContent();
  }
}

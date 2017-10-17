import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formatCurrency } from '~/helpers/formatHelper';
import { permissionAccessor } from '~/helpers/permissionHelper';
import * as modalActions from '../../../actions/formActions/paymentRefund';
import * as invoiceActions from '../../../actions/invoiceActions';

import { GridBody } from '~/components/grid';
import {
  timeComponent,
  transactionTypeComponent,
  transactionDetailsComponent,
} from '~/components/griddle-components';
import PaymentRefundModal from './paymentRefundModal';
import MainContentSection from '~/pages/layout/main-content/main-content-section';

const mapStateToProps = (state, props) => {
  const appState = state;
  const { invoice: pathState = {}} = state;
  const { base: { loading }, entities } = state;
  const { forms = {}} = state;
  const { paymentRefund = {} } = forms;
  return Object.assign({}, props, { appState, pathState, entities, loading, paymentRefund });
};

const mapDispatchToProps = (dispatch) => {
  const actions = { ...modalActions, ...invoiceActions };
  return { actions: bindActionCreators(actions, dispatch) };
};

@connect(mapStateToProps, mapDispatchToProps)
@timeComponent
@transactionTypeComponent
@transactionDetailsComponent
export default class InvoicePayment extends Component {

  static propTypes = {
    actions: PropTypes.object,
    pathState: PropTypes.object,
    paymentRefund: PropTypes.object,
    saleTransactions: PropTypes.array,
    refundTransactions: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.columns = [
      { columnName: 'createdAt', displayName: 'Date', customComponent: this.timeComponent },
      { columnName: 'cashierName', displayName: 'Cashier' },
      { columnName: 'payment', displayName: 'Type', customComponent: this.transactionTypeComponent },
      { columnName: 'details', displayName: 'Details', customComponent: this.transactionDetailsComponent },
      { columnName: 'note', displayName: 'Note' },
      { columnName: 'amount', displayName: 'Amount', cssClassName: 'align-right', customComponent: (row) => {
          const { data, rowData } = row;
          const { currency, amountLefted } = rowData;
          const refunded = data.minus(amountLefted);
          const format = { currency };
          return (
            <div>
              <div>{ formatCurrency(data, format) }</div>
              {
                refunded.gt(0) ?
                  <div style={ { color: '#8e8e8e' } }>Refunded { formatCurrency(refunded, format) }</div>
                  : null
              }
            </div>
          );
        }
      }
    ];
  }

  closePaymentRefundModal = () => {
    const { actions = {}, paymentRefund = {} } = this.props;
    const { type } = paymentRefund;
    const msg = type === PaymentRefundModal.TYPE.PAYMENT ? 'Do you confirm to cancel payment?' : 'Do you confirm to cancel refund?';
    const result = confirm(msg);
    if (result) {
      actions.closePaymentRefundModal();
    }
  };

  successlyClosePaymentRefundModal = (order) => {
    const { actions = {} } = this.props;
    actions.closePaymentRefundModal();
    actions.refreshInvoice();
  };

  render() {
    const { pathState = {}, paymentRefund = {} } = this.props;
    const { order = {}, currentStore = {} } = pathState;
    const { saleTransactions = [], refundTransactions = []} = order;
    const rows = [].concat(saleTransactions, refundTransactions)
                   .sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    const invoiceEdit = permissionAccessor('invoice:edit', currentStore);
    const gridActions = [
      {
        name: 'Void',
        hide: (item) => !invoiceEdit || item.amount.lte(0) || !item.allowVoidPayment || !item.amount.eq(item.amountLefted),
        onClick: (item) => {
          const { id, storeId } = item;
          const { pathState = {}, actions } = this.props;
          const { orderNumber } = pathState;
          const confirmed = actions.confirmVoidTransaction(storeId, orderNumber, id);
          if (confirmed){
            actions.voidTransaction(storeId, orderNumber, id);
          }
        }
      },
      {
        name: 'Refund',
        hide: (item) => !invoiceEdit || item.amount.lte(0) || item.amountLefted.lte(0),
        onClick: (item) => {
          const { id, storeId } = item;
          const { pathState = {}, actions } = this.props;
          const { order = {} } = pathState;
          actions.openPaymentRefundModal(PaymentRefundModal.TYPE.REFUND, storeId, order, id);
        }
      }
    ];

    return (
      <MainContentSection>
        <GridBody data={ rows }
                  border="h"
                  noOutline
                  actions={ gridActions }
                  columns={ this.columns }/>
        <PaymentRefundModal
          style={ { width: 800, maxWidth: '80vw' } }
          isOpen={ paymentRefund.isOpen }
          onRequestClose={ this.closePaymentRefundModal }
          onSuccessClose={ this.successlyClosePaymentRefundModal }
          />
      </MainContentSection>
    );
  }

}

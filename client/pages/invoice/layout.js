import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Big from 'big.js';
import * as invoiceActions from '../../actions/invoiceActions';
import * as paymentRefundModalActions from '../../actions/formActions/paymentRefund';

import routeHelper from '~/helpers/routeHelper';
import { moduleEnabled } from '~/helpers/storeHelper';

import MainContent from '../layout/main-content/main-content';
import MainContentHeader from '../layout/main-content/main-content-header';
import MainContentHeaderButtons from '../layout/main-content/main-content-header-buttons';
import MainContentTabs from '../layout/main-content/main-content-tabs';
import Breadcrumb from '../layout/breadcrumb/breadcrumb';

import { INVOICE_TYPE, QUOTE_TYPE, NEW, VIEW, EDIT, OVERVIEW, PAYMENT, DELIVERY_NOTE, LOG } from './constant';

import InvoiceOverview from './components/overview';
import InvoicePayment from './components/payment';
import InvoiceDeliveryNote from './components/deliveryNote';
import InvoiceLog from './components/log';
import PaymentRefundModal from './components/paymentRefundModal';

class InvoiceLayout extends Component {
  static childContextTypes = {
    currentStore: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      currentStore: this.context.currentStore
    };
  }

  componentDidMount() {
    const { type, mode, tab, orderNumber } = this.props;
    const { initInvoiceState } = this.props.actions;
    const { currentStore = {}, multiStore } = this.context;
    initInvoiceState(type, mode, tab, orderNumber, currentStore, multiStore);
  }

  saveEdit = () => {
    const props = this.props;
    const { pathState = {}, actions } = props;
    actions.saveInvoice(pathState);
  }

  cancelEdit = () => {
    const { storeId, pathState = {}, actions } = this.props;
    const { type, mode, currentTab, orderNumber, currentStore, multiStore } = pathState;
    if (mode === NEW) {
      actions.goToInvoiceSearch(storeId);
    } else {
      actions.initInvoiceState(type, VIEW, currentTab, orderNumber, currentStore, multiStore);
    }
  }

  refund = () => {
    const { pathState = {}, actions, storeId } = this.props;
    const { order = {} } = pathState;
    actions.openPaymentRefundModal(PaymentRefundModal.TYPE.REFUND, storeId, order);
  }

  payment = () => {
    const { pathState = {}, actions, storeId } = this.props;
    const { order = {} } = pathState;
    actions.openPaymentRefundModal(PaymentRefundModal.TYPE.PAYMENT, storeId, order);
  }

  sendEmail = () => {
    const { storeId, pathState = {}, actions } = this.props;
    const { orderNumber, order = {} } = pathState;
    const { customerEmail } = order;
    actions.sendInvoice(storeId, customerEmail, orderNumber);
  }

  exportPdf = () => {
    const { pathState = {}, actions, storeId } = this.props;
    const { order = {} } = pathState;
    const { number } = order;
    actions.exportInvoicePdf(storeId, number);
  }

  cancelOrder = () => {
    const { pathState = {} } = this.props;
    const { cancelInvoice } = this.props.actions;
    cancelInvoice(pathState);
  }

  voidInvoice = () => {
    const { pathState } = this.props;
    const { voidInvoice } = this.props.actions;
    voidInvoice(pathState);
  }

  edit = () => {
    let { pathState: { currentTab }, actions } = this.props;
    actions.startEditInvoice(currentTab);
  }

  convertQuoteToInvoice = () => {
    const { storeId, orderNumber } = this.props;
    const { convertQuoteToInvoice } = this.props.actions;
    convertQuoteToInvoice(storeId, orderNumber);
  }

  createDn = () => {
    const { storeId, orderNumber } = this.props;
    routeHelper.goDeliveryNote(storeId, 'new/for/invoice',orderNumber);
  };

  render() {
    const props = this.props;
    const { pathState = {}, actions, loading, storeId } = props;

    const {
      type,
      mode,
      currentTab,
      orderNumber,
      order = {},
      currentStore = {},
      deliveryOrders = [],
    } = pathState;
    const { state, inventoryState, quoteInvoiceState } = order;
    const { lineItems = [], saleTransactions = [], refundTransactions = [] } = order;
    const isViewMode = mode === VIEW;
    const isEditMode = mode === EDIT;
    const isNewMode = mode === NEW;
    const isInvoice = type === INVOICE_TYPE;
    const isQuote = type === QUOTE_TYPE;
    const isOverviewTab = currentTab === OVERVIEW;
    const isPaymentTab = currentTab === PAYMENT;
    const isDnTab = currentTab === DELIVERY_NOTE;
    const isVoided = state === 'voided';
    const isCancelled = state === 'cancelled';
    const isPaid = quoteInvoiceState === 'paid';
    const isUnpaid = quoteInvoiceState === 'unpaid';
    const isUnfulfilled = inventoryState === 'unfulfilled';
    const isActive = quoteInvoiceState === 'active' /* && moment().isBefore(order.effectiveCreatedAt)*/;
    const hasDn = deliveryOrders.length > 0;
    const hasTransaction = saleTransactions.length > 0;
    const hasRefund = refundTransactions.length > 0;
    const hasLineItem = lineItems.length > 0;
    const allNewItemHasQty = lineItems.every((item) => item.id || Big(item.quantity || 0).gt(0));
    const noFulfillRefundItem = lineItems.every((item) => Big(item.qtyFulfilled).eq(0) && Big(item.qtyRefunded).eq(0));
    const orderCanConvertToInvoice = !(isPaid || isCancelled || isVoided);
    const orderCanEdit = !(isPaid || isActive || isCancelled || isVoided);
    const orderCanCancel = !(isPaid || isActive || isCancelled || isVoided) && isUnfulfilled && isUnpaid;
    const orderCanPay = !(isPaid || isCancelled || isVoided || hasRefund);
    const orderCanRefund = !(isUnpaid || isCancelled || isVoided);
    const orderCanVoid = !(isCancelled || isVoided || hasTransaction || hasDn) && noFulfillRefundItem && false;
    const orderCanCreateDn = !(isCancelled || isVoided);
    const orderCanSaveEdit = hasLineItem && allNewItemHasQty;
    const pageTitle = mode === NEW ? `New ${type}` : `${type} #${orderNumber}`;

    const pageButtons = [
      {
        show: isViewMode && isOverviewTab,
        disabled: loading,
        onClick: this.sendEmail,
        content: 'Send Email Receipt',
      },
      {
        show: isViewMode && isOverviewTab,
        disabled: loading,
        onClick: this.exportPdf,
        content: 'Export to PDF',
      },
      {
        show: isViewMode && isOverviewTab && isQuote && orderCanConvertToInvoice,
        disabled: loading,
        onClick: this.convertQuoteToInvoice,
        btnType: 'primary',
        content: 'Convert to Invoice',
        permission: 'invoice:edit',
      },
      {
        show: isViewMode && isOverviewTab && orderCanCancel,
        disabled: loading,
        onClick: this.cancelOrder,
        btnType: 'primary',
        content: 'Cancel Invoice',
        permission: 'invoice:cancel',
      },
      {
        show: isViewMode && isOverviewTab && isInvoice && orderCanVoid,
        disabled: loading,
        onClick: this.voidInvoice,
        btnType: 'primary',
        content: 'Void Invoice',
        permission: 'invoice:void_invoice',
      },
      {
        show: isViewMode && isOverviewTab && orderCanEdit,
        disabled: loading,
        onClick: this.edit,
        btnType: 'primary',
        content: 'Edit',
        permission: 'invoice:edit_button',
      },
      {
        show: isViewMode && isPaymentTab && isInvoice && orderCanRefund,
        disabled: loading,
        onClick: this.refund,
        btnType: 'primary',
        content: 'Issue Refund',
        permission: 'invoice:refund',
      },
      {
        show: isViewMode && isPaymentTab && isInvoice && orderCanPay,
        disabled: loading,
        onClick: this.payment,
        btnType: 'primary',
        content: 'Make Payment',
        permission: 'invoice:edit',
      },
      {
        show: isViewMode && isDnTab && isInvoice && orderCanCreateDn,
        disabled: loading,
        onClick: this.createDn,
        btnType: 'primary',
        content: 'New Delivery Note',
        permission: 'invoice:edit',
      },
      {
        show: isEditMode || isNewMode,
        disabled: loading,
        onClick: this.cancelEdit,
        content: 'Cancel',
      },
      {
        show: isEditMode || isNewMode,
        btnType: 'primary',
        disabled: loading || !orderCanSaveEdit,
        onClick: this.saveEdit,
        content: 'Save',
      },
    ];

    let pageTabs = [
      {
        label: 'Overview',
        value: OVERVIEW,
      },
      {
        label: 'Settlements',
        value: PAYMENT,
        show: isInvoice && !isNewMode,
      },
      {
        label: 'Delivery Notes',
        value: DELIVERY_NOTE,
        show: isInvoice && !isNewMode && moduleEnabled('warehouse_management_enabled', currentStore),
      },
      {
        label: 'Log',
        value: LOG,
        show: !isNewMode,
      },
    ];

    let main = null;
    if (currentTab === OVERVIEW) {
      main = <InvoiceOverview />;
    } else if (currentTab === PAYMENT) {
      main = <InvoicePayment />;
    } else if (currentTab === DELIVERY_NOTE) {
      main = <InvoiceDeliveryNote />;
    } else if (currentTab === LOG) {
      main = <InvoiceLog />;
    }

    return (
      <MainContent>
        <MainContentHeader title={ pageTitle }>
          <MainContentHeaderButtons config={ pageButtons } />
        </MainContentHeader>
        <Breadcrumb links={
          [
            { label: 'Sales Management' },
            { label: `${type}s`, onClick: () => actions.goToInvoiceSearch(storeId) },
            { label: mode === NEW ? 'New' : orderNumber || '' },
          ]
        } />
        <MainContentTabs tabs={ pageTabs } currentTab={ currentTab } onChange={ newTab => actions.changeInvoiceTab(newTab) } />
        { main }
      </MainContent>
    );
  }
}

InvoiceLayout.contextTypes = {
  currentStore: React.PropTypes.object.isRequired,
  currentStores: React.PropTypes.array.isRequired,
  multiStore: React.PropTypes.bool.isRequired,
};

InvoiceLayout.propTypes = {
  type: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  storeId: PropTypes.string.isRequired,
  orderNumber: PropTypes.string,
  actions: PropTypes.object.isRequired,
  pathState: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => {
  let appState = state;
  let { invoice: pathState = {}} = state;
  let { base: { loading }, entities } = state;
  let ret = Object.assign({}, props, { appState, pathState, entities, loading });
  return ret;
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...invoiceActions, ...paymentRefundModalActions }, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceLayout);

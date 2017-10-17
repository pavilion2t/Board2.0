//*
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { INVENTORY_VARIANCE, ROUTE } from '~/constants';
const { MODE, TAB, STATUS } = INVENTORY_VARIANCE;

import * as ivActions from '~/actions/inventoryVarianceActions';

import {
  MainContent,
  MainContentHeader,
  MainContentHeaderButtons,
  MainContentTabs,
} from '~/pages/layout/main-content';
import Breadcrumb from '~/pages/layout/breadcrumb/breadcrumb';
import Overview from './components/overview';

function mapStateToProp(state) {
  const { base = {}, inventoryVariance: pathState = {} } = state;
  const { loading } = base;
  return { loading, pathState };
}

function mapDispatchToProp(dispatch) {
  const actions = {
    ...ivActions,
  };
  return { actions: bindActionCreators(actions, dispatch) };
}

@connect(mapStateToProp, mapDispatchToProp)
export default class ItemTemplate extends Component {

  static contextTypes = {
    currentStore: PropTypes.object,
  };

  static propTypes = {
    actions:   PropTypes.object.isRequired,
    type:      PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    mode:      PropTypes.string.isRequired,
    tab:       PropTypes.string.isRequired,
    storeId:   PropTypes.string.isRequired,
    id:        PropTypes.string,
    loading:   PropTypes.bool,
    pathState: PropTypes.object,
  };

  componentDidMount() {
    const { mode, tab, type, id, actions, pathState = {} } = this.props;
    if (mode !== MODE.NEW || !get(pathState, 'currentStore.id')) {
      actions.initInventoryVariance(this.context.currentStore, id, mode, tab, type);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  edit = (...args) => {
    this.props.actions.startEdit();
  };

  save = () => {
    this.props.actions.saveItem();
  };

  cancelEdit = () => {
    this.props.actions.cancelEdit();
  };

  changeTab = (tab) => {

  };

  void = () => {
    this.props.actions.changeItemStatus('void');
  };

  submit = () => {
    this.props.actions.changeItemStatus('submit');
  };

  cancel = () => {
    this.props.actions.changeItemStatus('cancel');
  };

  reject = () => {
    this.props.actions.changeItemStatus('reject');
  };

  approve = () => {
    this.props.actions.changeItemStatus('approve');
  };

  render() {
    const { loading, pathState = {} } = this.props;
    const { mode, tab, iv = {} } = pathState;
    const { status, id: itemId } = iv;
    const isView = mode === MODE.VIEW;
    const isEdit = mode === MODE.EDIT;
    const isNew = mode === MODE.NEW;
    const storeId = get(pathState, 'currentStore.id');
    const title = isNew ? `New Inventory Variance` : `Inventory Variance #${iv.number||''}`;

    const tabsConfig = [
      { label: 'Overview', value: TAB.OVERVIEW },
    ];

    let mainContent = null;
    if (tab === TAB.OVERVIEW) {
      mainContent = <Overview />;
    }

    const btnConfig = [
      {
        content: 'Print',
        permission: '',
        show: isView,
        disabled: true,
        btnType: 'secondary',
        onClick: this.print,
      },
      {
        content: 'Void',
        permission: '',
        show: isView && (status === STATUS.OPENED || status === STATUS.PENDING_FOR_APPROVAL),
        disabled: !itemId,
        btnType: 'primary',
        onClick: this.void,
      },
      {
        content: 'Submit for Approval',
        permission: '',
        show: isView && status === STATUS.OPENED,
        disabled: !itemId,
        btnType: 'primary',
        onClick: this.submit,
      },
      {
        content: 'Cancel Submission',
        permission: '',
        show: isView && status === STATUS.PENDING_FOR_APPROVAL,
        disabled: !itemId,
        btnType: 'primary',
        onClick: this.cancel,
      },
      {
        content: 'Reject',
        permission: '',
        show: isView && status === STATUS.PENDING_FOR_APPROVAL,
        disabled: !itemId,
        btnType: 'primary',
        onClick: this.reject,
      },
      {
        content: 'Approve',
        permission: '',
        show: isView && status === STATUS.PENDING_FOR_APPROVAL,
        disabled: !itemId,
        btnType: 'primary',
        onClick: this.approve,
      },
      {
        content: 'Edit',
        permission: '',
        show: isView && status === STATUS.OPENED,
        disabled: !itemId,
        btnType: 'primary',
        onClick: this.edit,
      },
      {
        content: 'Cancel',
        permission: '',
        show: isEdit || isNew,
        disabled: loading,
        btnType: '',
        onClick: this.cancelEdit,
      },
      {
        content: 'Save',
        permission: '',
        show: isEdit || isNew,
        disabled: loading,
        btnType: 'primary',
        onClick: this.save,
      },
    ];

    return (
      <MainContent>
        <MainContentHeader title={ title }>
          <MainContentHeaderButtons config={ btnConfig } />
        </MainContentHeader>
        <Breadcrumb links={
          [
            { label: 'Stock Take Management' },
            { label: 'Inventory Variance', link: `/v2/${storeId}/${ROUTE.INVENTORY_VARIANCE}` },
            { label: mode === MODE.NEW ? 'New Inventory Variance' : iv.name || `#${iv.number||''}`, active: true },
          ]
        } />
        <MainContentTabs tabs={ tabsConfig } currentTab={ tab } onChange={ this.changeTab } />
        { mainContent }
      </MainContent>
    );
  }
}

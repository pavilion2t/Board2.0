import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as invoiceActions from '~/actions/invoiceActions';

import routeHelper from '~/helpers/routeHelper';

import Loading from '~/components/loading/loading';
import { GridBody } from '~/components/grid';
import {
  timeComponent,
  dateComponent,
  statusComponent,
  storeComponent,
  linkComponent,
} from '~/components/griddle-components';
import MainContentSection from '~/pages/layout/main-content/main-content-section';

const mapStateToProps = (state, props) => {
  let { invoice: pathState = {}, stores = [] } = state;
  let { base: { loading } } = state;
  return Object.assign({}, props, { pathState, loading, stores });
};

const mapDispatchToProps = (dispatch) => {
  const actions = { ...invoiceActions };
  return { actions: bindActionCreators(actions, dispatch) };
};

@connect(mapStateToProps, mapDispatchToProps)
@timeComponent
@dateComponent
@statusComponent
@storeComponent
@linkComponent
export default class InvoiceDeliveryNote extends Component {

  static propTypes = {
    actions: PropTypes.object,
    pathState: PropTypes.object,
    loading: PropTypes.bool,
    stores: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);
    this.columns = [
      { columnName: 'storeId', displayName: 'Stock Store', customComponent: this.storeComponent },
      { columnName: 'number', displayName: 'Number', customComponent: (row) => {
        const { data, rowData: { id, storeId } } = row;
        const path = routeHelper.deliveryNote(storeId, id);
        return <Link to={ path }>{ data }</Link>;
      } },
      { columnName: 'customerName', displayName: 'Ship To' },
      { columnName: 'state', displayName: 'Delivery Status', customComponent: this.statusComponent('deliveryOrder') },
      { columnName: 'shipDate', displayName: 'Delivery Date', customComponent: this.dateComponent },
      { columnName: 'createdAt', displayName: 'Date', customComponent: this.timeComponent },
      { columnName: 'createdBy', displayName: 'Created By' },
    ];
  }

  render() {
    const { pathState = {}, loading } = this.props;
    const { deliveryOrders = [] } = pathState;

    return (
      loading ? <Loading>Loading...</Loading> :
        <MainContentSection>
          <GridBody data={ deliveryOrders }
                    border="h"
                    noOutline
                    columns={ this.columns }/>
        </MainContentSection>
    );
  }

}

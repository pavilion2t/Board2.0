import './inventory.scss';

import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Griddle from 'griddle-react';

import Loading from '../../components/loading/loading';

class InventoryShowHistory extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentDidMount() {
    let { params, actions} = this.props;
    actions.getQuantityHistory(params.store_id, params.listing_id);
  }

  render(){
    let { appState, params } = this.props;
    let listings = appState.entities.listings || {};
    let listing = listings[parseInt(params.listing_id)];

    const columns = [
      'datetime',
      'delta',
      'quantity_after',
      'qty_stockroom_after',
      'qty_in_transit_from_supplier_after',
      'qty_in_transit_from_transfer_after',
      'qty_reserved_for_invoice_after',
      'qty_reserved_for_transfer_after',
    ];

    /* eslint react/prop-types: 0 */
    const DeltaColumn = function (props) {
      let {
        quantity_after,
        quantity_before,
        qty_stockroom_after,
        qty_stockroom_before } = props.rowData;

      let delta = parseFloat(quantity_after) - parseFloat(quantity_before) +
                  parseFloat(qty_stockroom_after) - parseFloat(qty_stockroom_before);

      return <b>{ delta }</b>;
    };

    const DatetimeColumn = function (props) {
      let {
        created_at,
        order_number, user_display_name } = props.rowData;

      let subtext = order_number ? order_number :
                    user_display_name ? ('Adjusted by: ' + user_display_name) : '';
      return (
        <div>
          <div className="nowrap">{ moment(created_at).format('M/D/YYYY, h:mm:ss A') }</div>
          <span className="text-muted small">{ subtext }</span>
        </div>
      );
    };

    const columnMetadata = [{
        "columnName": "datetime",
        "displayName": "Sales/Purchase Order",
        "customComponent": DatetimeColumn,

      },{
        "columnName": "delta",
        "displayName": "Qty Delta",
        "customComponent": DeltaColumn,

      },{
        "columnName": "quantity_after",
        "displayName": "Latest Qty(On Shelf)",
      },{
        "columnName": "qty_stockroom_after",
        "displayName": "Latest Qty Stockroom",
      },{
        "columnName": "qty_in_transit_from_supplier_after",
        "displayName": "In Transit from Supplier",
      },{
        "columnName": "qty_in_transit_from_transfer_after",
        "displayName": "In Transit from Transfer",
      },{
        "columnName": "qty_reserved_for_invoice_after",
        "displayName": "Reserved for Invoice"
      },{
        "columnName": "qty_reserved_for_transfer_after",
        "displayName": "Reserved for Transfer"
      }];


    if (!listing) {
      return <Loading>Loading Inventory</Loading>;

    } else if (!listing.quantity_histories) {
      return <Loading>Loading Log</Loading>;

    } else {
      return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Inventory - { listing.name }</h1>
          </header>
          <div className="main-content-section">
            <Griddle
              useGriddleStyles={ false }
              tableClassName="table inventory-log-table"
              columns={ columns }
              columnMetadata={ columnMetadata }
              resultsPerPage={ 50 }
              results={ listing.quantity_histories }
            />
          </div>
        </div>
      );
    }
  }
}


export default InventoryShowHistory;

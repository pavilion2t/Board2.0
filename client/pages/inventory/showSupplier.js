import './inventory.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Loading from '~/components/loading/loading';
import Can from '~/components/can/can';
import * as supplierHelper from '../../helpers/supplierHelper';

class InventoryShow extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentDidMount() {
    let { params, actions} = this.props;
    actions.getSuppliers(params.store_id, 1, 200);
  }

  render(){
    let { appState, params } = this.props;
    let { suppliers } = appState.entities;
    let listing = appState.entities.listings[params.listing_id];
    let listingSuppliers = listing.suppliers;
    let editPath = `/v2/${params.store_id}/inventory/${params.listing_id}/supplier/edit-supplier`;

    if (!listing) {
      return <Loading>Loading Listing</Loading>;

    }

    if (!suppliers) {
      return <Loading>Loading Suppliers</Loading>;

    } else {
      return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Inventory</h1>
            <div>
              <Can action="inventory:edit">
                <Link to={ editPath } className="btn btn-primary btn-sm">Edit Supplier</Link>
              </Can>
            </div>
          </header>
          <div className="main-content-section">
          {
            listingSuppliers.length < 1 ? (
              <p>No supplier</p>
            ) : (
              <p>{ listingSuppliers.length } suppliers</p>
            )
          }
          {
            listingSuppliers.map(supplier => (
              <div className="card card-block" key={ supplier.id }>
                { supplier.default ? <p><span className="label label-success">Default supplier</span></p> : null }
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mapdata">
                      <div className="mapdata-label">Supplier Name</div>
                      <div className="mapdata-value">{ supplierHelper.getName(suppliers, supplier.supplier_id) }</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mapdata">
                      <div className="mapdata-label">Supplier Product ID</div>
                      <div className="mapdata-value">{ supplier.supplier_product_id }</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mapdata">
                      <div className="mapdata-label">Reorder Trigger Point</div>
                      <div className="mapdata-value">{ supplier.reorder_point  }</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mapdata">
                      <div className="mapdata-label">Cost</div>
                      <div className="mapdata-value">{ supplier.cost }</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mapdata">
                      <div className="mapdata-label">Reorder Amount</div>
                      <div className="mapdata-value">{ supplier.reorder_level }</div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mapdata">
                      <div className="mapdata-label">Margin</div>
                      <div className="mapdata-value">{ supplierHelper.getMargin(supplier.cost, listing.price) + '%' }</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          </div>
        </div>
      );
    }
  }
}


export default InventoryShow;

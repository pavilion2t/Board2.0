import './inventory.scss';

import React, { Component, PropTypes } from 'react';

import Loading from '~/components/loading/loading';
import SupplierFormCollection from './components/supplierFormCollection';

class InventoryEditSupplier extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentDidMount() {
    let { params, actions} = this.props;
    actions.getSuppliers(params.store_id, 1, 200);
  }

  handleSubmit = (data) => {
    const {
      params: { store_id, listing_id },
      appState: { entities: { listings }}
    } = this.props;
    let listing = listings[listing_id];

    const showPath = `/v2/${store_id}/inventory/${listing_id}/supplier`;

    let suppliers = data.supplierForms.map((supplierForm, index) => {
      let originSupplier = listing.suppliers[index] || {};
      return {
        id: originSupplier.id,
        listing_id: listing.id,
        supplier_id: supplierForm.id,
        cost: supplierForm.cost,
        default: supplierForm.isDefault,
        reorder_point: supplierForm.point,
        reorder_level: supplierForm.amount,
        supplier_product_id: supplierForm.productId,
        created_at: originSupplier.created_at,
        updated_at: originSupplier.updated_at
      };
    });

    this.props.actions.updateListing(store_id, listing_id, { suppliers: suppliers })
      .then(data => {
        this.context.router.push(showPath);
      });
  };

  handleCancel = (e) =>{
    e.preventDefault();

    const { params } = this.props;
    const showPath = `/v2/${params.store_id}/inventory/${params.listing_id}/supplier`;
    this.context.router.push(showPath);
  };

  render(){
    const { appState, params } = this.props;
    const { listings, suppliers } = appState.entities;
    const listing = listings[params.listing_id];

    if (!listing) {
      return <Loading>Loading Listing</Loading>;

    }

    if (!suppliers) {
      return <Loading>Loading Suppliers</Loading>;

    } else {
      return (
        <div className="main-content">
          <SupplierFormCollection listing={ listing }
            suppliers={ suppliers }
            onSubmit={ this.handleSubmit }
            onCancel={ this.handleCancel } />
        </div>
      );
    }
  }
}


export default InventoryEditSupplier;

import './inventory.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Modal from 'react-modal';
import map from 'lodash/map';
import find from 'lodash/find';

import Loading from '../../components/loading/loading';
import Can from '~/components/can/can';
import { sortAndTreeDepartment } from '../../helpers/departmentHelper';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    border                : 'none',
    padding               : 0,
    width                 : '500px',

  },
  overlay: {
    zIndex: 1111
  }
};

class InventoryShowOverview extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    listing: PropTypes.object.isRequired,
    departments: PropTypes.object.isRequired,
  };

  state = {
    showQuantityDetail: false,
  };

  componentDidMount() {
    let { params, actions, listing } = this.props;

    actions.getDepartments(params.store_id);
    actions.getProductGraphics(listing.id, listing.product_id);
  }

  setDefault(productId, graphicId) {
    let { params, actions} = this.props;
    let listingId = parseInt(params.listing_id);

    actions.setDefaultProductGraphics(listingId, productId, graphicId).then(() => {
      actions.getProductGraphics(listingId, productId);
    });
  }

  toggleQuantityDetail = () => {
    this.setState({ showQuantityDetail: !this.state.showQuantityDetail });
  }


  render(){
    let { params, listing, departments } = this.props;
    let productGraphics = listing.product_graphics || [];
    let editPath = `/v2/${params.store_id}/inventory/${params.listing_id}/overview/edit`;


    function departmentName(id) {
      try {
        let _departments = map(departments, (value) => value);
        let _department = find(sortAndTreeDepartment(_departments), department => department.id == id);
        return _department.stackdisplay;

      } catch (e) {
        return '';
      }
    }

    if (!listing && !departments) {
      return <Loading>Loading Inventory</Loading>;

    } else {
      return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Inventory - { listing.name }</h1>
            <div>
              <Can action="inventory:edit"><Link to={ editPath } className="btn btn-primary btn-sm">Edit</Link></Can>
            </div>
          </header>
          <div className="main-content-section">
            <div className="row">
              <div className="col-sm-12">
                <div className="mapdata">
                  <div className="mapdata-label">Title</div>
                  <div className="mapdata-value">{ listing.name }</div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="mapdata">
                  <div className="mapdata-label">description</div>
                  <div className="mapdata-value">{ listing.description }</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">UPC/EAN</div>
                  <div className="mapdata-value">{ listing.gtid }</div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="mapdata">
                  <div className="mapdata-label">QTY on shelf</div>
                  <div className="mapdata-value">{ listing.quantity }</div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="mapdata">
                  <div className="mapdata-label">&nbsp;</div>
                  <div className="mapdata-value">
                    <a className="a" onClick={ this.toggleQuantityDetail }>quantity details...</a>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">PLU/SKU</div>
                  <div className="mapdata-value">{ listing.listing_barcode  }</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">Price</div>
                  <div className="mapdata-value">{ listing.price }</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">Brand</div>
                  <div className="mapdata-value">{ listing.brand_name }</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">Department</div>
                  <div className="mapdata-value">{ departmentName(listing.department_id) }</div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-content-section">
            <p><input type="checkbox" checked={ listing.in_store_only } disabled></input> In Store Only</p>
            <p><input type="checkbox" checked={ listing.discontinued } disabled></input> Discontinued</p>
            <p><input type="checkbox" checked={ listing.exempt_loyalty } disabled></input> Exempt item from loyalty program</p>
            <p><input type="checkbox" checked={ listing.exempt_discount } disabled></input> Exclude from all discount</p>
            <p><input type="checkbox" checked={ listing.storefront_allow_negative_quantity } disabled></input> Store front allow negative quantity</p>

          </div>
          <div className="main-content-section">
            <div className="row">

            {
              productGraphics.length < 1 ? (
                <p className="col-sm-12">No Related Image.</p>

              ) : null
            }
            {
              productGraphics.map(graphic => (
                <div className="col-sm-2 align-center" key={ graphic.id }>
                  {
                    graphic.default ? (
                      <p><span className="label label-success">Default</span></p>
                    ) : (
                      <p className="text-mute small a" onClick={ this.setDefault.bind(this, graphic.product_id, graphic.id) }>set as default</p>

                    )
                  }
                  <img src={ graphic.small_image_url } />

                </div>
              ))
            }
            </div>
          </div>
          <Modal
            isOpen={ this.state.showQuantityDetail }
            style={ customStyles }
            onRequestClose={ this.toggleQuantityDetail } >

            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={ this.toggleQuantityDetail }>
                  <span aria-hidden="true" >&times;</span>
                </button>
                <h4 className="modal-title">Inventory Quantity Preview</h4>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>On Shelf (default)</td><td>{ listing.quantity }</td></tr>
                  <tr><td>Stock Room</td><td>{ listing.qty_stockroom }</td></tr>
                  <tr><td>In Transit from Supplier</td><td>{ listing.qty_in_transit_from_supplier }</td></tr>
                  <tr><td>In Transit from Transfer</td><td>{ listing.qty_in_transit_from_transfer }</td></tr>
                  <tr><td>Reserved for Invoice</td><td>{ listing.qty_reserved_for_invoice }</td></tr>
                  <tr><td>Reserved for Transfer</td><td>{ listing.qty_reserved_for_transfer }</td></tr>
                </tbody>
              </table>
            </div>
          </Modal>
        </div>
      );
    }
  }

}

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as inventoryActions from '../../actions/inventoryActions';
import * as departmentActions from '../../actions/departmentActions';

function mapStateToProps(state, ownProps) {

  let listing;

  try {
    listing = state.entities.listings[parseInt(ownProps.params.listing_id)];

  } catch (e) {
    listing = {};
    console.error('lising not found');
  }

  return {
    listing: listing,
    departments: state.entities.departments || {},
    params: ownProps.params,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign(inventoryActions, departmentActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryShowOverview);

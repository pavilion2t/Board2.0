/* eslint react/no-multi-comp: 0 */
import './inventory.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { reduxForm } from 'redux-form';
import pickBy from 'lodash/pickBy';
import map from 'lodash/map';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import validate from 'validate.js';

import Loading from '../../components/loading/loading';
import { sortAndTreeDepartment } from '../../helpers/departmentHelper';
import ListingOverviewFormComponent from './components/overviewForm';

class InventoryEditOverview extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    let { params, actions, appState} = this.props;
    let listings = appState.entities.listings || {};
    let listing = listings[parseInt(params.listing_id)];

    actions.getDepartments(params.store_id);
    actions.getProductGraphics(listing.id, listing.product_id);
  }
  updateOverview(data) {
    // Known IE problem: http://caniuse.com/#feat=form-attribute
    // TODO: bind onClick on button and use data in store to update listing

    let { actions, params, appState } = this.props;
    let backPath = `/${params.store_id}/inventory/${params.listing_id}/overview`;

    let listings = appState.entities.listings || {};
    let listing = listings[parseInt(params.listing_id)];
    let productGraphics = data.product_graphics;
    let uploadImages = data.upload_images;
    let diff = pickBy(omit(data, 'product_graphics', 'upload_images'), (value, key) => {
      return listing[key] != value;
    });

    let deleteProductGraphicIds = reduce(productGraphics, (acc, graphic) => {
      if (graphic.delete) {
        acc.push(graphic.id);
      }
      return acc;
    }, []);

    let uploadFiles = map(uploadImages, image => image.file);

    actions.deleteProductGraphics(listing.id, listing.product_id, deleteProductGraphicIds);
    actions.uploadProductGraphics(listing.id, listing.product_id, uploadFiles);

    actions.updateListing(params.store_id, params.listing_id, diff)
    .then(res => {
      this.context.router.push(backPath);
    }, (error) => {
        alert(error.message);
    });
  }

  deleteItem = () => {
    let { actions, params, appState } = this.props;
    let listings = appState.entities.listings || {};
    let listing = listings[parseInt(params.listing_id)];

    if (confirm('Are you sure? Items can be undeleted.')) {
      actions.deleteListing(listing.store_id, listing.id).then(() => {
        this.context.router.push(`/${params.store_id}/inventory`);
      }, (error) => {
        alert(error.message);
      });
    }
  }

  render(){
    let { appState, params } = this.props;
    let listings = appState.entities.listings || {};
    let departments = appState.entities.departments || {};
    let listing = listings[parseInt(params.listing_id)];
    let productGraphics = listing.product_graphics || [];
    let backPath = `/${params.store_id}/inventory/${params.listing_id}/overview`;

    if (departments) {
      departments = map(departments, (value) => value);
      departments = sortAndTreeDepartment(departments);
    }

    if (!(listing && listing.product_graphics && departments)) {
      return <Loading>Loading Inventory</Loading>;

    } else {

      return (
        <div className="main-content">
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Inventory - { listing.name }</h1>
            <div>
              <button className="btn btn-link btn-sm text-danger" onClick={ this.deleteItem }>Delete this item</button> &nbsp;&nbsp;&nbsp;
              <Link to={ backPath } className="btn btn-secondary btn-sm">Cancel</Link> &nbsp;
              <button className="btn btn-primary btn-sm" form="listing-form" type="submit">Save</button>
            </div>
          </header>
          <div className="main-content-section">
            <ListingOverviewForm
              isCustomMode={ false }
              isInventoryManager={ this.props.appState.user.inventory_manager }
              onSubmit={ this.updateOverview.bind(this) }
              initialValues={ listing }
              departments={ departments }
              productGraphics={ productGraphics }
           />
          </div>

        </div>
      );
    }
  }
}

const constraints = {
  price: {
    presence: true,
    numericality: true,
  },
};

function validator(values) {
  return validate(values, constraints) || {};
}


let ListingOverviewForm = reduxForm({
  form: 'listingOverview',
  validate: validator,
  fields: [
    'name',
    'description',
    'gtid',
    'quantity',
    'qty_stockroom',
    'listing_barcode',
    'price',
    'brand_name',
    'category_name',
    'department_id',
    'in_store_only',
    'discontinued',
    'exempt_loyalty',
    'exempt_discount',
    'storefront_allow_negative_quantity',
    'product_graphics[]',
    'product_graphics[].delete',
    'upload_images',
    ]
})(ListingOverviewFormComponent);

export default InventoryEditOverview;

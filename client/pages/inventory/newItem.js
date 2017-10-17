import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import omit from 'lodash/omit';

import Modal from 'react-modal';
import { reduxForm } from 'redux-form';
import map from 'lodash/map';
import { sortAndTreeDepartment } from '../../helpers/departmentHelper';
import validate from 'validate.js';

import whichGTIN from 'which-gtin';
import ListingOverviewFormComponent from './components/overviewForm';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'

  },
  overlay: {
    zIndex: 1111
  }
};

function ProductAlreadyExist({isShow}) {
  return isShow ? (
    <div className="alert alert-danger">Already a prodcut in inventory</div>
  ) : <div></div>;
}

class NewItem extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  state = {
    modalIsOpen: true,
    isProdcutExsit: false,
    listing: {},
    isCustomMode: true
  };

  componentDidMount() {
    let { params, actions } = this.props;
    actions.getDepartments(params.store_id);
  }

  handleNext(){
    let { params, actions } = this.props;
    let upc = this.refs.input.value + '';

    if (whichGTIN(upc, true).valid || whichGTIN(upc).valid){

      let filtersObject = [{
        column: 'upc',
        condition: 'equal',
        conditionValue: upc
      }];

      //if length more length 1 display alredy in inventory
      actions.getListingsByUPC(params.store_id, undefined, undefined, undefined, filtersObject).then((res) => {
        if (res.data.length > 0){
            this.setState({ isProdcutExsit: true});
        } else {
            actions.getProductByUPC(upc).then((data) => {
              data.gtid = upc;
              this.setState({ modalIsOpen: false, listing: data, isCustomMode: false});
            });
        }
      });
    } else {
      alert('invalid barcode');
    }
  }

  handleCancel(){
    this.context.router.goBack();
  }

  handleCustomItem(){
    this.setState({ modalIsOpen: false });
  }

  createItem(data){
    let { actions, params } = this.props;
    let uploadImages = data.upload_images;
    let newItemData = omit(data, 'product_graphics', 'upload_images');
    //new custom item
    if (this.state.isCustomMode){

      actions.postCustomItem(params.store_id, newItemData).then((newListing)=> {
        let backPath = `/v2/${params.store_id}/inventory/${newListing.id}`;

        let uploadFiles = map(uploadImages, image => image.file);
        actions.uploadProductGraphics(newListing.id, newListing.product_id, uploadFiles);

        this.context.router.push(backPath);
      }, (error) => {
        console.error('error', error);
        alert(error.message);
      });

    } else {
      newItemData = omit(newItemData, 'description', 'category_name', 'brand_name');
      actions.postItem(params.store_id, newItemData).then((newListing)=> {

         let backPath = `/v2/${params.store_id}/inventory/${newListing.id}`;

         this.context.router.push(backPath);
      }, (error) => {
        console.error('error', error);
        alert(error.message);
      });
    }

  }


  render(){
    let { params, appState} = this.props;
    let departments = appState.entities.departments || {};
    let listing = this.state.listing || {};
    if (departments) {
      departments = map(departments, (value) => value);
      departments = sortAndTreeDepartment(departments);
    }

    const ProductAlreadyExist = ({isShow}) => {
        return isShow ? <p>Already a prodcut in inventory</p> : <p></p>;
    };


    let backPath = `/v2/${params.store_id}/inventory`;

    return (
      <div className="main-content">
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Inventory - New Item</h1>
          <div>
            <Link to={ backPath } className="btn btn-secondary btn-sm">Cancel</Link> &nbsp;
            <button className="btn btn-primary btn-sm" form="listing-form" type="submit">Save</button>
          </div>
        </header>
        <div className="main-content-section">
          <ListingOverviewForm onSubmit={ this.createItem.bind(this) } isCustomMode={ this.state.isCustomMode } initialValues={ listing } departments={ departments } />
        </div>

        <Modal isOpen={ this.state.modalIsOpen } style={ customStyles }>
          <h1>New Item</h1>
          <p>Enter UPC/EAN/GTIN code if available.</p>
          <div>
            <ProductAlreadyExist isShow={ this.state.isProdcutExsit }/>
            <p>
              <input className="form-control" type="text" ref="input" placeholder="UPC/EAN/GTIN" />
            </p>
            <p>
              <button className="btn btn-primary btn-block"
                onClick={ this.handleNext.bind(this) }>Next</button>
              <button className="btn btn-secondary btn-block"
                onClick={ this.handleCancel.bind(this) }>Cancel</button>
            </p>
            <hr />
            <p>
              <button className="btn btn-primary btn-block"
                onClick={ this.handleCustomItem.bind(this) }>Add Custom Item</button>
            </p>
          </div>
        </Modal>
      </div>
    );
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

export default NewItem;

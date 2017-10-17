import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Griddle from 'griddle-react';

import { getDepartments } from '../../actions/departmentActions';
import { getAssociateProducts, getVoucher, updateVoucher, removeAssociateProduct } from '../../actions/voucherActions';

import forEach from 'lodash/forEach';
import pick from 'lodash/pick';
import remove from 'lodash/remove';

import map from 'lodash/map';

import Loading from '~/components/loading/loading';
import AddListingButton from '~/components/add-listing/addListing';
import { Link } from 'react-router';
import AssociatedProductDelete from './components/associatedProductDelete';


const mapStateToProps = (state) => {

  const { voucher, entities: { departments, vouchers } } = state;

  let associatedProducts = [];
  let products = voucher.products;
  for (let i in products) {
    let l = products[i];
    let department =  departments === null || typeof departments[l.department_id] === "undefined" ? "" : departments[l.department_id].name;

    associatedProducts.push({
      id: l.product_id,
      name: l.name,
      price: l.price,
      department: department
    });
  }

  return {
    voucher: vouchers,
    associatedProducts: associatedProducts
  };
};


const mapDispatchToProps = (dispatch) => {
  const actions = { getDepartments, getAssociateProducts, getVoucher, updateVoucher, removeAssociateProduct };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};



class VoucherAssociate extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    associatedProducts: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object,
    voucher: PropTypes.object,
    location: PropTypes.object
  };

   componentDidMount() {

    const { store_id, discount_id } = this.props.params;
    const { getDepartments, getVoucher } = this.props.actions;

    getVoucher(store_id, discount_id);
    getDepartments(store_id);
  }

  addProduct = (products) => {
    const { store_id, discount_id } = this.props.params;
    const { getAssociateProducts } = this.props.actions;
    const { voucher } = this.props;

    forEach (products, (item) => {
       voucher[discount_id].discountable_items.push({
        item_type: 0,
        item_id: item.product_id
      });
    });

    let changedVoucher = {
      voucher_discount: pick(voucher[discount_id], ['store_id', 'name', 'notes', 'amount', 'price', 'revenue_recognition', 'discountable_items', 'expiration_setting'])
    };

    let productIds = [];
    forEach(changedVoucher.voucher_discount.discountable_items, (item) => {
      productIds.push(item.item_id);
    });

    getAssociateProducts(store_id, productIds);

  }

  deleteProduct(product_id) {
    let { discount_id } = this.props.params;
    const vouchers = this.props.voucher;
    const { removeAssociateProduct } = this.props.actions;


    let voucher = vouchers[discount_id];
    voucher.discountable_items = remove(voucher.discountable_items, (item) => {
      return item.item_id !== product_id;
    });

    removeAssociateProduct(product_id);

  }

  handleSubmit() {
    let { store_id, discount_id } = this.props.params;
    const vouchers = this.props.voucher;
    let voucher = vouchers[discount_id];
    const associatedProducts = this.props.associatedProducts;
    const { updateVoucher } = this.props.actions;
    voucher.discountable_items = map(associatedProducts, (item) => {
      return {
        item_type: 0,
        item_id: item.id
      };
    });

    let changedVoucher = {
      voucher_discount: pick(voucher, ['store_id', 'name', 'notes', 'amount', 'price', 'revenue_recognition', 'discountable_items', 'expiration_setting'])
    };

    updateVoucher(store_id, discount_id, changedVoucher);
    const showPath = `/v2/${store_id}/vouchers/${discount_id}/associate`;
    this.context.router.push(showPath);


  }

  render() {
    let { associatedProducts } = this.props;
    let { store_id, discount_id } = this.props.params;
    let fetchingData = false;


    // Voucher list settings
    const columnMetadatas = [{
      columnName: "name",
      displayName: "name",
    },{
      columnName: "department",
      displayName: "department"
    },{
      columnName: "price",
      displayName: "price"
    },{
      columnName: " ",
      displayName: "",
      customComponent: AssociatedProductDelete,
      deleteProduct: this.deleteProduct.bind(this)
    }];

    // Columns for grid display
    const columns = columnMetadatas.map(i => i.columnName);


    // Show loading if still fetching
    if (fetchingData) {
      return <Loading>Loading vouchers...</Loading>;
    }

    const showPath = `/v2/${store_id}/vouchers/${discount_id}/associate`;

    return (
      <div className="voucher-associate">
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Vouchers</h1>
          <div>
            <Link className="btn btn-secondary btn-sm" to={ showPath }>Discard</Link> &nbsp;
            <button className="btn btn-primary btn-sm" onClick={ this.handleSubmit.bind(this) }>Save</button>
          </div>
        </header>
        <div>
          <Griddle
            useGriddleStyles={ false }
            tableClassName="table table-bordered data-table"
            results={ associatedProducts }
            columns={ columns }
            columnMetadata={ columnMetadatas }/>

          <div className="_add">
            <AddListingButton onSave={ this.addProduct }>Add Products</AddListingButton>
          </div>
        </div>
      </div>
    );
  }
}






export default connect(mapStateToProps, mapDispatchToProps)(VoucherAssociate);

import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Griddle from 'griddle-react';

import { getDepartments } from '../../actions/departmentActions';
import { getAssociateProducts, getVoucher, updateVoucher, removeAssociateProduct } from '../../actions/voucherActions';

import { Link } from 'react-router';

import Loading from '~/components/loading/loading';

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



class VoucherAssociateShow extends Component {
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

  render() {
    const { store_id, discount_id } = this.props.params;
    let { associatedProducts } = this.props;
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
    }];

    // Columns for grid display
    const columns = columnMetadatas.map(i => i.columnName);

    // Show loading if still fetching
    if (fetchingData) {
      return <Loading>Loading vouchers...</Loading>;
    }

    const editPath = `/v2/${store_id}/vouchers/${discount_id}/associate/edit`;

    return (
      <div className="voucher-associate">
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Vouchers</h1>
          <Link to={ editPath } className="btn btn-primary btn-sm">Edit</Link>
        </header>
        <div>
          <Griddle
            useGriddleStyles={ false }
            tableClassName="table table-bordered data-table"
            results={ associatedProducts }
            columns={ columns }
            columnMetadata={ columnMetadatas }/>
         </div>
      </div>
    );
  }
}






export default connect(mapStateToProps, mapDispatchToProps)(VoucherAssociateShow);

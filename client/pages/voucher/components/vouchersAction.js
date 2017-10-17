import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dropdown from '~/components/drop-down/dropDown';
import { deleteVoucherCoupon, getVoucherCoupons, cancelVoucherCoupons } from '~/actions/voucherActions';


const mapStateToProps = (state, ownProps) => {
  return {
    criteria: state.voucherCoupon.criteria
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let { store_id, discount_id, id } = ownProps.rowData;

  let actions = {
    cancelVoucherCoupon: cancelVoucherCoupons.bind(null, store_id, discount_id, id),
    deleteVoucherCoupon: deleteVoucherCoupon.bind(null, store_id, discount_id, id),
    getVoucherCoupons: getVoucherCoupons.bind(null, store_id, discount_id),
  };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

function vouchersAction(props) {
  let { criteria, actions } = props;

  let remove = () => {
    actions.deleteVoucherCoupon().then(() => {
      actions.getVoucherCoupons(criteria.page, criteria.perPage);
    });
  };

  let cancel = () => {
    actions.cancelVoucherCoupon().then(() => {
      actions.getVoucherCoupons(criteria.page, criteria.perPage);
    });
  };

  return (
    <Dropdown>
      <a className="dropdown-item a" onClick={ cancel }>Cancel</a>
      <a className="dropdown-item a text-danger" onClick={ remove }>Remove</a>
    </Dropdown>
  );
}

vouchersAction.propTypes = {
  rowData: PropTypes.object.isRequired,
  actions: PropTypes.object,
  criteria: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(vouchersAction);

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import Griddle from 'griddle-react';

import { getVoucherCoupons, createVoucherCoupons } from '../../actions/voucherActions';
import Loading from '~/components/loading/loading';
import ActionButton from '~/components/action-button/action-button';
import VouchersAction from './components/vouchersAction';
import NewVoucherForm from './components/newVoucherForm';
import { dateTime } from '~/helpers/formatHelper';

const mapStateToProps = (state, ownProps) => {
  let { discount_id, store_id } = ownProps.params;
  let { vouchers } = state.entities;
  let coupons, timezone;

  try {
    timezone = state.stores.find(store => store.id == store_id).timezone;

  } catch (e) {
    timezone = 'Asia/Hong_Kong';
    console.warn('missing store timezone info, use Asia/Hong_Kong');
  }

  try {
    coupons = vouchers[parseInt(discount_id)].coupons || [];
  } catch (e) {
    coupons = [];
  }

  function cookCoupons(coupons) {
    coupons.forEach(coupon => {
      coupon.created_at_text = dateTime(coupon.created_at, timezone);
      coupon.expired_at_text = dateTime(coupon.expired_at, timezone);
    });

    return coupons;
  }
  return {
    coupons: cookCoupons(coupons),
    criteria: state.voucherCoupon.criteria
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let { store_id, discount_id } = ownProps.params;

  let actions = {
    getVoucherCoupons: getVoucherCoupons.bind(null, store_id, discount_id),
    createVoucherCoupons: createVoucherCoupons.bind(null, store_id, discount_id),
  };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

// Voucher list settings
const columnMetadatas = [{
  columnName: "id",
  displayName: "Bindo voucher id",
},{
  columnName: "code",
  displayName: "store voucher id"
},{
  columnName: "expired_at_text",
  displayName: "expired at"
},{
  columnName: "created_at_text",
  displayName: "created at"
},{
  columnName: "status",
  displayName: "status"
},{
  columnName: " ",
  displayName: "",
  customComponent: VouchersAction,
}];

// Columns for grid display
const columns = columnMetadatas.map(i => i.columnName);


class VoucherVouchers extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    coupons: PropTypes.array.isRequired,
    actions: PropTypes.object,
    criteria: PropTypes.object,
  };

  state = {
    newVoucher: false,
  };

  componentDidMount() {
    this.props.actions.getVoucherCoupons();
  }

  newVoucher = () => {
    this.setState({
      newVoucher: true,
    });
  }
  closeNewVoucher = () => {
    this.setState({
      newVoucher: false,
    });
  }
  createVoucher = (data) => {
    this.props.actions.createVoucherCoupons(data);

    this.closeNewVoucher();
  }

  setPage = (index) => {
    let { criteria } = this.props;

    const page = index >= criteria.totalPages? criteria.totalPages : index < 1 ? 1 : index + 1;

    this.props.actions.getVoucherCoupons(page, criteria.perPage, undefined);
  }

  render() {
    let { coupons, criteria } = this.props;
    let fetchingData = false;

    // Show loading if still fetching
    if (fetchingData) {
      return <Loading>Loading vouchers...</Loading>;
    }

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
    let noop = function (){};

    return (
      <div className="voucher-vouchers">
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Vouchers</h1>
        </header>
        <div>
          <Griddle
            useGriddleStyles={ false }
            tableClassName="table table-bordered data-table"
            results={ coupons }
            resultsPerPage={ 50 }
            columns={ columns }
            columnMetadata={ columnMetadatas }

            useExternal
            externalSetPage={ this.setPage }
            externalMaxPage={ criteria.totalPages }
            externalChangeSort={ noop }
            externalSetFilter={ noop }
            externalSetPageSize={ noop }
            externalCurrentPage={ criteria.page - 1 }

          />
          <div className="_add">
            <ActionButton className="btn btn-primary" type="add" onClick={ this.newVoucher }>New Voucher</ActionButton>
          </div>
        </div>

        <Modal isOpen={ this.state.newVoucher } style={ customStyles } onRequestClose={ this.closeNewVoucher }>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Generate New Voucher Coupons</h4>
            </div>
            <div className="modal-body">
              <NewVoucherForm onSubmit={ this.createVoucher } />
            </div>
            <div className="modal-footer">
              <span className="btn btn-secondary" onClick={ this.closeNewVoucher }>Cancel</span> &nbsp;
              <button className="btn btn-primary" form="NewVoucherForm">Generate</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export { mapStateToProps };
export default connect(mapStateToProps, mapDispatchToProps)(VoucherVouchers);

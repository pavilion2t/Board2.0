import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getVoucher, updateVoucher } from '../../actions/voucherActions';
import Loading from '../../components/loading/loading';
import VoucherOverviewForm, { perDaySecons, EXPIRATION_TYPE } from './components/overviewForm';
import { formatUpdateVoucher } from './helpers/formater';


const mapStateToProps = (state, ownProps) => {
  let { entities: { vouchers } } = state;

  let voucher = vouchers && vouchers[ownProps.params.discount_id];
  if (voucher) {
    let expiration_duration, expiration_date;
    if (voucher.expiration_setting.type === EXPIRATION_TYPE.DURATION) {
      expiration_duration = Math.floor(Number(voucher.expiration_setting.value) / Number(perDaySecons));
    } else {
      expiration_date = voucher.expiration_setting.value;
    }
    let date_ranges = voucher.date_ranges || [];
    date_ranges.forEach(range => {
      range.start_from = range.start_from.substr(0, 10);
      range.end_at = range.end_at.substr(0, 10);
    });

    voucher = {
      id: voucher.id,
      name: voucher.name,
      notes: voucher.notes,
      price: String(voucher.price),
      amount: String(voucher.amount),
      expiration_type: voucher.expiration_setting.type,
      expiration_date: expiration_date,
      expiration_duration: expiration_duration,
      revenue_recognition: voucher.revenue_recognition,
      date_ranges: date_ranges,
    };
  }

  return {
    voucher: voucher
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = { getVoucher, updateVoucher };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

class VoucherOverviewEdit extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.shape({
      store_id: PropTypes.string.isRequired,
      discount_id: PropTypes.string.isRequired
    }).isRequired,
    voucher: PropTypes.object,
    actions: PropTypes.object,
  };

  componentDidMount() {
    const { store_id, discount_id } = this.props.params;
    const { getVoucher } = this.props.actions;

    getVoucher(store_id, discount_id);
  }

  onSubmit = (data) => {
    const { store_id, discount_id } = this.props.params;
    const { updateVoucher } = this.props.actions;
    const showPath = `/v2/${store_id}/vouchers/${discount_id}/overview`;

    //redux-form v5.3 not support array vilidation message, validate it here
    let error  = undefined;
    for (let i=0;i<data.date_ranges.length;i++){
      data.date_ranges.forEach((range, i) => {
        let { start_from, end_at } = range;
        if (!start_from.length) {
          error = `Blackout date range #${ i+1 }: Start date should not be blank.`;
        } else if (!end_at.length) {
          error  = `Blackout date range #${ i+1 }: End date should not be blank.`;
        } else if (new Date(start_from) - new Date(end_at) > 0) {
          error = `Blackout date range #${ i+1 }: Invalid date range.`;
        }
        if (error) return;
      });
    }
    if (error) {
      alert(error);
      return;
    }

    let voucher = formatUpdateVoucher(data);

    updateVoucher(store_id, discount_id, {voucher_discount: voucher})
      .then(data => {
        this.context.router.push(showPath);
      });
  };

  handleSubmit = () => {
    this.refs.VoucherOverviewForm.submit();
  };

  render() {
    const { voucher } = this.props;
    const { store_id, discount_id } = this.props.params;
    const showPath = `/v2/${store_id}/vouchers/${discount_id}/overview`;

    if (!voucher) {
      return <Loading>Loading Voucher</Loading>;
    }
    else {
      return (
        <div>
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Vouchers</h1>
            <div>
              <Link className="btn btn-secondary btn-sm" to={ showPath }>Discard</Link> &nbsp;
              <button className="btn btn-primary btn-sm" onClick={ this.handleSubmit }>Save</button>
            </div>
          </header>
          <VoucherOverviewForm ref="VoucherOverviewForm"
            onSubmit={ this.onSubmit }
            initialValues={ voucher }
            voucherId={ voucher.id }/>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoucherOverviewEdit);

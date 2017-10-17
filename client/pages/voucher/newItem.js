import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createVoucher } from '../../actions/voucherActions';
import VoucherOverviewForm, { EXPIRATION_TYPE, REVENUE } from './components/overviewForm';
import { formatUpdateVoucher } from './helpers/formater';


class VoucherOverviewNew extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  onSubmit = (data) => {
    const { store_id } = this.props.params;
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

    const { createVoucher } = this.props.actions;

    createVoucher(store_id, {voucher_discount: voucher})
      .then(data => {
        let discount_id = Object.keys(data.entities.vouchers)[0];
        const showPath = `/v2/${store_id}/vouchers/${discount_id}/overview`;
        this.context.router.push(showPath);
      });
  };

  handleSubmit = () => {
    this.refs.VoucherOverviewForm.submit();
  };

  render() {
    const { store_id } = this.props.params;
    let backPath = `/v2/${store_id}/vouchers`;

    const init = {
      initialValues: {
        expiration_type: EXPIRATION_TYPE.NEVER,
        revenue_recognition: REVENUE.SALES
      }
    };

    return (
      <div className="main-content">
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Vouchers</h1>
          <div>
            <Link to={ backPath } className="btn btn-secondary btn-sm">Cancel</Link> &nbsp;
            <button className="btn btn-primary btn-sm" onClick={ this.handleSubmit }>Save</button>
          </div>
        </header>
        <VoucherOverviewForm ref="VoucherOverviewForm"
          { ...init }
          onSubmit={ this.onSubmit }/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = { createVoucher };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VoucherOverviewNew);

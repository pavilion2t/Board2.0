import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getVoucher } from '../../actions/voucherActions';
import Loading from '../../components/loading/loading';
import { formatVoucher } from './helpers/formater';
import Can from '~/components/can/can';
import { date } from '~/helpers/formatHelper';

const mapStateToProps = (state, ownProps) => {
  const { entities: { vouchers } } = state;
  const { discount_id } = ownProps.params;

  let voucher = vouchers && vouchers[discount_id];
  if (voucher) {
    voucher = formatVoucher(voucher);
  }

  return {
    voucher: voucher,
    params: ownProps.params
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = { getVoucher };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};


class VoucherOverviewShow extends Component {
  static propTypes = {
    params: PropTypes.shape({
      store_id: PropTypes.string.isRequired,
      discount_id: PropTypes.string.isRequired
    }).isRequired,
    voucher: PropTypes.object,
    actions: PropTypes.shape({
      getVoucher: PropTypes.func.isRequired
    }).isRequired,
    importerOpener: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { store_id, discount_id } = this.props.params;
    const { getVoucher } = this.props.actions;

    getVoucher(store_id, discount_id);
  }

  render() {
    const { importerOpener, params } = this.props;
    const { store_id, discount_id } = params;
    const editPath = `/v2/${store_id}/vouchers/${discount_id}/overview/edit`;

    const voucher = this.props.voucher || {
        expiration_setting: {
          value: 0,
          type: ""
        },
        date_ranges: []
      };

    if (!voucher) {
      return <Loading>Loading Voucher</Loading>;
    }
    else {

      return (
        <div>
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Vouchers</h1>
            <div>
              <button className="btn btn-secondary btn-sm" onClick={ importerOpener }>Import</button>
              <Can action="voucher:edit"><Link to={ editPath } className="btn btn-primary btn-sm">Edit</Link></Can>
            </div>
          </header>
          <div className="main-content-section">
            <div className="row">
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">TITLE</div>
                  <div className="mapdata-value">{ voucher.name }</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">VOUCHER TYPE ID</div>
                  <div className="mapdata-value">{ voucher.id }</div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="mapdata">
                  <div className="mapdata-label">DESCRIPTION</div>
                  <div className="mapdata-value">{ voucher.notes }</div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-content-section">
            <div className="row">
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">FACE VALUE</div>
                  <div className="mapdata-value">{ voucher.amount }</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">PRICE</div>
                  <div className="mapdata-value">{ voucher.price }</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">REVENUE RECOGNITION</div>
                  <div className="mapdata-value">{ voucher.revenue_recognition_text }</div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mapdata">
                  <div className="mapdata-label">EXPIRATION SETTING</div>
                  <div className="mapdata-value">{ voucher.expiration_setting_text }</div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-content-section">
            <h5>Blackout Date</h5>
            { voucher.hasOwnProperty('date_ranges') && voucher.date_ranges.map((range, i) =>
              <div className="row" key={ i }>
                <div className="col-md-1">
                  <div className="mapdata-label">{ " " }</div>
                  <div className="mapdata-value">#{ i+1 }</div>
                </div>
                <div className="col-md-5">
                  <div className="mapdata-label">Start Date</div>
                  <div className="mapdata-value">{ date(range.start_from) }</div>
                </div>
                <div className="col-md-6">
                  <div className="mapdata-label">End Date</div>
                  <div className="mapdata-value">{ date(range.end_at) }</div>
                </div>
              </div>
            ) }
          </div>
        </div>
      );
    }
  }
}




export { mapStateToProps };
export default connect(mapStateToProps, mapDispatchToProps)(VoucherOverviewShow);

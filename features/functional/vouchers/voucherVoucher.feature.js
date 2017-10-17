import chai from 'chai';
import mockery from 'mockery';
import nock from 'nock';

import configureStore from '~/store/configureStore';
import config from '../../../client/configs/config';
import { mapStateToProps } from '~/pages/voucher/vouchers.js';

chai.should();

const initialState = {
  stores: [
    {
      "id": 999,
      "title": "Bindo Demosssss",
      "country_code": "US",
      "calling_code": "1",
      "phone": null,
      "homepage": null,
      "email": null,
      "deleted": false,
      "slug": "k5f",
      "address1": null,
      "address2": null,
      "city": null,
      "state": null,
      "zipcode": null,
      "compact_title": null,
      "pos_active": true,
      "iframe_active": false,
      "logo_url": null,
      "tax_rate": null,
      "timezone": "America/New_York",
      "is_screensaver_on": false,
      "ipad_screensaver_url": "",
      "reply_to_store": true,
      "store_credit_enabled": false,
      "policy": null,
      "highlight": null,
      "delivery": false,
      "delivery_miles": "0.0",
      "delivery_min_amount": "0.0",
      "delivery_fee": "0.0",
      "delivery_desc": null,
      "pickup_desc": null,
      "chain": true,
      "parent_id": null,
      "sync_inventory": false,
      "currency": "USD",
      "delivery_areas": [],
      "opening_hours":                                                                                                                                                                                                                                                null,
      "time_segments": null,
      "soft_descriptor": null,
      "current_exchange_rates": [],
      "associate_type": "EMPLOYEE"
    }
  ]
};

const store = configureStore(initialState);

module.exports = function () {
  this.Before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mockery.registerMock('../helpers/authDataHelper', {
      save:  () => {},
      clear: () => {},
      get:   () => {}
    });

    mockery.registerMock('js-cookie', {
      get: () => {},
      set: () => {}
    });
  });

  this.Given(/^voucher coupon data$/, function (json) {
    this.coupons = JSON.parse(json);

    let res = { "coupons": this.coupons };
    let header = {
      link: '{"total_pages":19,"per_page":10,"total_entries":185,"current_page":1}'
    };

    nock(config.gateway)
      .get('/v2/stores/999/discounts/1/coupons?')
      .reply(200, res, header);
  });

  this.When(/^I open a voucher's voucher tab$/, function (callback) {
    let voucherActions = require('~/actions/voucherActions');
    store.dispatch(voucherActions.getVoucherCoupons(999, 1));

    let handleChange = () => {
      let state = store.getState();
      if (state.voucherCoupon.fetchingData === false) {
        this.state = state;
        callback();
      }
    };

    this.unsubscribe = store.subscribe(handleChange);
  });

  this.Then(/^voucher tab should display$/, function (json) {
    let ownProps = { params: { store_id: 999, discount_id: 1 } };
    let componentProps = mapStateToProps(this.state, ownProps);
    let result = componentProps.coupons;

    let expected = JSON.parse(json);

    result.should.deep.equal(expected);
    this.unsubscribe();

  });

};

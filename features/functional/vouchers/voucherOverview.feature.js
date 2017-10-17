import chai from 'chai';
import mockery from 'mockery';
import nock from 'nock';

import configureStore from '~/store/configureStore';
import config from '../../../client/configs/config';
import { mapStateToProps } from '~/pages/voucher/overviewShow.js';

chai.should();

const store = configureStore();

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


  this.Given(/^voucher item data$/, function (json) {
    this.voucher_discount = JSON.parse(json);

    let res = { "voucher_discount": this.voucher_discount };
    nock(config.gateway)
      .get('/v2/stores/999/voucher_discounts/1')
      .reply(200, res);
  });

  this.When(/^I open the voucher overview page$/, function (callback) {
    let voucherActions = require('~/actions/voucherActions');
    store.dispatch(voucherActions.getVoucher(999, 1));

    let handleChange = () => {
      let state = store.getState();
      if (state.voucher.fetchingData === false) {
        this.state = state;
        callback();
      }
    };

    this.unsubscribe = store.subscribe(handleChange);
  });

  this.Given(/^I update voucher data with$/, function (json) {
    this.updateData = JSON.parse(json);
    let updatedVoucher = Object.assign({}, this.voucher_discount, this.updateData);
    let res = { "voucher_discount": updatedVoucher };

    nock(config.gateway)
      .put('/v2/stores/999/voucher_discounts/1')
      .reply(200, res);

  });

  this.When(/^I save voucher$/, function (callback) {
    let voucherActions = require('~/actions/voucherActions');
    store.dispatch(voucherActions.updateVoucher(999, 1, this.updateData));

    let handleChange = () => {
      let state = store.getState();
      if (state.voucher.fetchingData === false) {
        this.state = state;
        callback();
      }
    };

    this.unsubscribe = store.subscribe(handleChange);
  });

  this.Then(/^voucher overview should display$/, function (json) {
    let ownProps = { params: { discount_id: 1 } };
    let componentProps = mapStateToProps(this.state, ownProps);
    let result = componentProps.voucher;
    let expected = JSON.parse(json);

    result.should.deep.equal(expected);
    this.unsubscribe();
  });
};

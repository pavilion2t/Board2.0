import chai from 'chai';
import mockery from 'mockery';
import nock from 'nock';

import configureStore from '~/store/configureStore';
import config from '../../../client/configs/config';
import FilterHelper from '~/helpers/filterHelper';

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
      save: (user) => {},
      clear: () => {},
      get: () => {}
    });

    mockery.registerMock('js-cookie', {
      get: (key) => {},
      set: (key, value) => {}
    });
  });

  this.Given(/^existing voucher data:$/, function (table) {
    let voucher_discounts = table.hashes();
    let res = {
      data: {"voucher_discounts": voucher_discounts}
    };
    nock(config.gateway)
      .get('/v2/stores/1/voucher_discounts')
      .query(true)
      .reply(200, res);
  });


  this.When(/^I open the voucher list page$/, function (callback) {
    let voucherActions = require('~/actions/voucherActions');
    store.dispatch(voucherActions.getVouchers(1, 1, 25));

    let handleChange = () => {
      let state = store.getState();
      this.expectResult = 1;
      if (state.voucher.fetchingData === false) {
        this.state = state;
        callback();
      }
    };

    this.unsubscribe = store.subscribe(handleChange);
  });

  this.Then(/^voucher list page should display data:$/, function (table) {
    let result = this.state.voucher.currentVouchers.map(id => this.state.entities.vouchers[id]);
    let expected = table.hashes();

    result.should.deep.equal(expected);
    this.unsubscribe();
  });


  this.When(/^I open the voucher list page with query "([^"]*)"$/, function (filters, callback) {
    let voucherActions = require('~/actions/voucherActions');

    const filtersObject = FilterHelper.stringToFilters(filters);
    store.dispatch(voucherActions.getVouchers(1, 1, 25, undefined, filtersObject));

    let handleChange = () => {
      let state = store.getState();
      this.expectResult = 1;
      if (state.voucher.fetchingData === false) {
        this.state = state;
        callback();
      }
    };

    this.unsubscribe = store.subscribe(handleChange);
  });

  this.Then(/^criteria filter should be$/, function (string) {
    let result = this.state.voucher.criteria.filters;
    let expected = JSON.parse(string);

    result.should.deep.equal(expected);
    this.unsubscribe();
  });
};

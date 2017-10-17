import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mockery from 'mockery';
import { HANDLE_PROMISE } from '../../../client/store/middlewares/handlePromiseMiddleware';
import isArray from 'lodash/isArray';
import config from '../../../client/configs/config';

chai.use(chaiAsPromised);
let should = chai.should();

module.exports = function () {
  this.Before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mockery.registerMock('../services/voucherService', {
      getList: (store, page, count, orederBy, filter) => new Promise((resolve, reject) => {
        resolve({
          message: 'success'
        });
      }),
      getItem: (storeId, discountId) => new Promise((resolve, reject) => {
        resolve({
          message: 'success'
        });
      })
    });
  });

  this.After(() => {
    mockery.disable();
  });

  this.Given(/^the storeId: "([^"]*)", page: "([^"]*)", count: "([^"]*)", orderBy: "([^"]*)", filters:$/, function (storeId, page, count, orderBy, filterString) {
    this.storeId = storeId;
    this.page = page;
    this.count = count;
    this.orderBy = orderBy;
    this.filters = JSON.parse(filterString);
  });

  this.Given(/^user setup the new filters$/, function (filterString) {
    this.filters = JSON.parse(filterString);
  });

  this.Given(/^the storeId: "([^"]*)" and the discount id: '(\d+)'$/, function (storeId, discountId) {
    this.storeId = storeId;
    this.discountId = discountId;
  });

  this.When(/^invoke voucher's getVoucher action$/, function () {
    const actions = require('../../../client/actions/voucherActions');
    this.result = actions.getVouchers(this.storeId, this.page, this.count, this.orderBy, this.filters);
  });

  this.When(/^invoke voucher's getVouchers action$/, function () {
    const actions = require('../../../client/actions/voucherActions');
    this.result = actions.getVoucher(this.storeId, this.discountId);
  });

  this.When(/^invoke voucher's updateVoucherFilters action$/, function () {
    const actions = require('../../../client/actions/voucherActions');
    this.result = actions.updateVoucherFilters(this.filters);
  });

  this.Then(/^the result should be handle promise object$/, function (callback) {
    const { promise, actions} = this.result[HANDLE_PROMISE];

    promise.should.eventually.deep.equal({
      message: 'success'
    }).notify(callback);
    if (isArray(actions)) {
      actions.should.be.deep.equal([ { type: 'SET_VOUCHERS' }, { type: 'SET_ASSOCIATED_PRODUCTS' } ]);
    } else {
      actions.type.should.be.equal('SET_VOUCHERS');
    }

  });

  this.Then(/^the store should receive action's data$/, function (actionString) {
    const expectAction = JSON.parse(actionString);

    this.result.should.deep.equal(expectAction);
  });
};

import chai from 'chai';

import * as supplierHelper from '../../../client/helpers/supplierHelper';

let should = chai.should();

module.exports = function() {
  this.Given(/^listing's price "(.*)" and supplier's cost "(.*)"$/, function (price, cost) {
    this.price = parseFloat(price);
    this.cost = parseFloat(cost);
  });

  this.When(/^calculate inventory's margin$/, function () {
    this.margin = supplierHelper.getMargin(this.cost, this.price);
  });

  this.Then(/^the margin of inventory is "(.*)"$/, function (margin) {
    this.margin.should.be.equal(margin);
  });

  this.Then(/^the margin of inventory is empty string$/, function () {
    this.margin.should.be.empty;
  });
};

import chai from 'chai';

import * as storeHelper from '../../../client/helpers/storeHelper';

var should = chai.should();

module.exports = function() {
  this.Given(/^the falt store array data$/, function(table) {
    this.storeArray = table.hashes();
  });

  this.Given(/^the module status list$/, function(moduleStatusString) {
    this.moduleStatus = JSON.parse(moduleStatusString);
  });

  this.When(/^build store tree$/, function() {
    this.result = storeHelper.buildStoreTree(this.storeArray);
  });

  this.When(/^check is module "([^"]*)" enabled$/, function(moduleName) {
    this.result = storeHelper.moduleEnabled(moduleName, this.moduleStatus);
  });

  this.Then(/^the store tree should look like$/, function(storeTreeString) {
    let storeTree = JSON.parse(storeTreeString);

    this.result.should.be.deep.equal(storeTree);
  });

  this.Then(/^module should be enabled$/, function() {
    this.result.should.be.true;
  });

  this.Then(/^module should not be enabled$/, function() {
    this.result.should.be.false;
  });
};

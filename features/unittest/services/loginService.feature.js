import chai from 'chai';
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock';

import config from '../../../client/configs/config';
import loginService from '../../../client/services/loginService';

chai.use(chaiAsPromised);
var should = chai.should();

module.exports = function() {
  this.Before(() => {
    nock.cleanAll();
  });

  this.Given(/^login api url is "([^"]*)"$/, function(url) {
    this.url = url;
  });

  this.Given(/^the username and password are$/, function(table) {
    this.user = table.rowsHash();
  });

  this.Given(/^the api should return user's infomation$/, function(table) {
    this.userData = table.rowsHash();

    nock(config.bindo)
      .post(this.url, this.user)
      .reply(200, this.userData);
  });

  this.Given(/^the api should return login error message$/, function(table) {
    let error = table.rowsHash();

    nock(config.bindo)
      .post(this.url, this.user)
      .reply(401, error);
  });

  this.When(/^Login Service process login with Username: "([^"]*)" and Password: "([^"]*)"$/, function(username, password) {
    this.result = loginService.login(username, password);
  });

  this.Then(/^Login should be success$/, function(callback) {
    this.result.should.eventually.be.deep.equal(this.userData).notify(callback);
  });

  this.Then(/^Login should be failed and the error message is "([^"]*)"$/, function(errorMessage) {
    let expectError = { message: errorMessage };
    this.result.should.eventually.be.deep.equal(expectError);
  });
}

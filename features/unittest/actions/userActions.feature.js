import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mockery from 'mockery';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import config from '../../../client/configs/config';

chai.use(chaiAsPromised);
chai.should();

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

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
      get: () => { access_token: '123456'}
    });

    mockery.registerMock('js-cookie', {
      get: (key) => {},
      set: (key, value) => {}
    });
  });

  this.After(() => {
    mockery.disable();
  });

  this.Given(/^if login with username: "([^"]*)" and password: "([^"]*)"$/, function (username, password) {
    this.mockName = username;
    this.mockPassword = password;
  });

  this.Then(/^login Service will return$/, function (table) {
    mockery.registerMock('../services/loginService', {
      login: (username, password) => new Promise((resolve, reject) => {
        if (username === this.mockName && password === this.mockPassword) {
          resolve({ user: table.rowsHash() });
        } else {
          throw new Error("Login Failed");
        }
      })
    });
  });

  this.Given(/^the username: "([^"]*)" and the password "([^"]*)"$/, function (username, password) {
    this.username = username;
    this.password = password;
  });

  this.Given(/^expect store will receive these actions$/, function (expectedActionsString) {
    this.expectedActions = JSON.parse(expectedActionsString);
  });

  this.When(/^invoke login action$/, function () {
    // require at here for mock
    let userAction = require('../../../client/actions/userActions');
    this.result = userAction.login(this.username, this.password);
  });

  this.Then(/^store should receive correct login action data$/, function (callback) {
    const store = mockStore({}, this.expectedActions, callback);
    store.dispatch(this.result);
  });
};

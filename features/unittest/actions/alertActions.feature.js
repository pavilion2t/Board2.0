import chai from 'chai';

import { alert, truncateAlert, removeAlert } from '../../../client/actions/alertActions';

chai.should();

module.exports = function () {
  this.Given(/^Use alert\(\)$/, function () {
    this.action = alert;
  });
  this.Given(/^Use removeAlert\(\)$/, function () {
    this.action = removeAlert;
  });
  this.Given(/^Use truncateAlert\(\)$/, function () {
    this.action = truncateAlert;
  });

  this.When(/^style is "([^"]*)" and message is "([^"]*)"$/, function (style, message) {
    this.result = this.action(style, message);
  });

  this.When(/^message is "([^"]*)"$/, function (message) {
    // Write code here that turns the phrase above into concrete actions
    this.result = this.action(message);
  });

  this.When(/^any condition$/, function () {
    // Write code here that turns the phrase above into concrete actions
    this.result = this.action();
  });
};

import chai from 'chai';

let should = chai.should();

module.exports = function () {
  this.Given(/^the reducer is "([^"]*)"$/, function (reducerName) {
    this.reducer = require(`../../../../client/store/reducers/${reducerName}`).default;
  });

  this.Given(/^(current|default) state is undefined$/, function (args1) {
    this.state = undefined;
  });

  this.Given(/^current state is$/, function (stateString) {
    this.state = JSON.parse(stateString);
  });

  this.When(/^after the reducer handled received action$/, function (actionString) {
    this.action = JSON.parse(actionString);
    this.actualState = this.reducer(this.state, this.action);
  });

  this.Then(/^the state should be$/, function (resultString) {
    let result = JSON.parse(resultString.toString());

    this.actualState.should.be.deep.equal(result);
  });

  this.Then(/^the state should not be same object$/, function () {
    this.actualState.should.not.equal(this.state);
  });
};

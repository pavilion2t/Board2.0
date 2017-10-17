import chai from 'chai';

import { switchStore } from '../../../client/actions/storeActions';

chai.should();

module.exports = function () {
  this.When(/^execute switchStore\(\) action$/, function () {
    this.result = switchStore();

  });
};

import chai from 'chai';

chai.should();

module.exports = function () {
  this.Then(/^store should receive action$/, function (table) {
    let expectResult = table.rowsHash();
    this.result.should.deep.equal(expectResult);
  });
};

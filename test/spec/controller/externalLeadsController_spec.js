
(function () {
    'use strict';
    describe('CustomerController', function () {
      beforeEach(function() {
        this.customerController = this.controller('ExternalLeadsController', {$scope: this.scope}); 
        this.customer = {id:123};
      });
      it('should set $scope.resp_wrap to \'data\'', function() { expect(this.scope.resp_wrap).toEqual('data'); });
      it("should set $scope.item_wrap to null", function() { expect(this.scope.item_wrap).toBeNull(); });
      it('should set $scope.api_path', function() { expect(this.scope.api_path).toEqual(this.scope.api + '/api/v2/api-or-ext-lead-search?country=US')});
      it('should set $scope.view to modules/common/views/grid_view.html', function() { expect(this.scope.view).toEqual('modules/common/views/grid_view.html') });
    });
})();

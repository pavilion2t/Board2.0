export function LineItemStatusFactory ($rootScope, $http, CommonFactory, DashboardFactory) {
  'ngInject';

  var getStatus = function() {
    return $http.get(_apiPath())
  };

  var createStatus = function(status) {
    return $http.post(_apiPath(), {
      line_item_status: { status: status}
    });
  };

  var updateStatus = function(id) {
    return $http.put(_apiPath() + '/' + id);
  };

  var deleteStatus = function(id) {
    return $http.delete(_apiPath() + '/' + id);
  };

  var _apiPath = function() { return $rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/line_item_statuses'; }

  return {
    getStatus: getStatus,
    createStatus: createStatus,
    updateStatus: updateStatus,
    deleteStatus: deleteStatus,
  };

}

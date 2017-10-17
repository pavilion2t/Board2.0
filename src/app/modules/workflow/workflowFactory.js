export function WorkflowFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  var endpoint = function () {
    return $rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/workflows/';
  };

  var getList = function () {
    return $http.get(endpoint());
  };

  return {
    getList: getList
  };
}

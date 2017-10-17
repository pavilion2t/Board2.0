export function PermissionsFactory($rootScope, $http, $q, CommonFactory, DashboardFactory) {
  'ngInject';

  var get = function(id) {
    return $http.get(_apiPath(id));
  };

  var getStore = function(storeId) {
    storeId = storeId || DashboardFactory.getStoreId();
    return $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/module');
  };

  var update = function(id, data) {
    return $http.put(_apiPath(id), data);
  };

  var _apiPath = function(storeId) {
    storeId = storeId || DashboardFactory.getStoreId();
    return $rootScope.api + '/api/v2/stores/' + storeId + '/store_permissions';
  }

  return {
    get: get,
    getStore: getStore,
    update: update
  };

}

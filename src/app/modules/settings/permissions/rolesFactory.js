export function rolesFactory($rootScope, $http, $q, CommonFactory, DashboardFactory) {
  'ngInject';

  var get = function() {
    return $http.get(_apiPath());
  };

  var create = function(data) {
    return $http.post(_apiPath(), {store_role: data});
  };

  var update = function(id, data) {
    return $http.put(_apiPath() + '/' + id, data);
  };

  var remove = function(id) {
    return $http.delete(_apiPath() + '/' + id);
  };

  var _apiPath = function(storeId) {
    storeId = storeId || DashboardFactory.getStoreId();
    return $rootScope.api + '/api/v2/stores/' + storeId + '/store_roles';
  }

  return {
    get: get,
    create: create,
    update: update,
    remove: remove
  };

}

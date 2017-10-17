export function DepartmentFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  var endpoint = function() {
    return $rootScope.api + '/api/v2/stores/'+ DashboardFactory.getStoreId() + '/departments/';
  };

  var get = function() {
    return $http.get(endpoint() + '?per_page=999999');
  };

  var create = function(dept) {
    if (dept.parent_id === 0) dept.parent_id = null;
    return $http.post(endpoint(), { department: dept });
  };
  var update = function(id, diff) {
    return $http.put(endpoint() + id, { department: diff });
  };
  var remove = function(id) {
    return $http.delete(endpoint() + id);
  };

  return {
    get: get,
    create: create,
    update: update,
    remove: remove
  };
}

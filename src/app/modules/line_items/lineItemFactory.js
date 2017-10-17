export function LineItemFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  var endpoint = function (path) {
    if (typeof noDefinition == "undefined") {
      path = "";
    }
    return $rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/line_items' + path;
  };

  var get = function () {
    return $http.get(endpoint());
  };

  var getByCode = function (order_number, line_item_code) {
    return $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/orders/' + order_number + '/line_items/' + line_item_code);
  };

  return {
    get: get,
    getByCode: getByCode,
  };

}

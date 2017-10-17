export function AddCustomerFactory($rootScope, $http, DashboardFactory, CommonFactory, messageFactory) {
  'ngInject';

  var getCustomer = function(keyword, store_id, page) {
    store_id = store_id || DashboardFactory.getStoreId();
    page = page || 1;
    return $http.get($rootScope.api + '/api/v2/stores/' +  store_id + '/customers?keyword=' + keyword + '&page=' + page + '&per_page=25');
  };

  return {
    getCustomer: getCustomer
  };

}

export function PolicyFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  var getStore = function() {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId())
  };

  var updateStore = function(values){
    return $http.put($rootScope.api + '/api/v2/stores/'+ DashboardFactory.getStoreId(), {store_attributes:values});
  };


  return {
    getStore: getStore,
    updateStore: updateStore
  };
}

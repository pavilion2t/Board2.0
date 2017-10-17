export function RoundingBehaviorFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  var getStore = function() {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/module')
  };

  var updateStore = function(values){
    return $http.put($rootScope.api + '/api/v2/stores/'+ DashboardFactory.getStoreId() + '/module', {module:values});
  };


  return {
    getStore: getStore,
    updateStore: updateStore
  };

}

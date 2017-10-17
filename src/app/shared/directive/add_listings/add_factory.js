export function AddListingFactory($rootScope, $http, DashboardFactory, CommonFactory, messageFactory) {
  'ngInject';

  var getInventory = function(keyword, type, page, store_id) {
    store_id = store_id || DashboardFactory.getStoreId();
    console.log('store_id', store_id);
    var chain = '';
    if ( DashboardFactory.getCurrentStore().chain ){
      chain = 'chain=1&unique_prod=true&';
    }

    return $http.get($rootScope.api + '/api/v2/stores/' +  store_id + '/listings?'+chain+'filters[]='+type+keyword+'&order_by=name&page='+page+'&per_page=25');
  };

  return {
    getInventory: getInventory
  };

}

export function ItemMasterFactory($rootScope, $http, DashboardFactory, CommonFactory, messageFactory) {
  'ngInject';

  var getInventory = function (id) {
    return $http.get($rootScope.api + '/api/v2/chains/' + DashboardFactory.getStoreId() + '/products/' + id);
  };

  var getInventorys = function () {
    return $http.get($rootScope.api + '/api/v2/chains/' + DashboardFactory.getStoreId() + '/products');
  };

  var updateInventory = function (id, price) {

    return $http.put($rootScope.api + '/api/v2/chains/' + DashboardFactory.getStoreId() + '/products/' + id, { product: { price: price } });
  };

  const getQuantityHistory = function (productId) {
    const storeId = DashboardFactory.getStoreId();
    const path = `${$rootScope.api}/api/v2/listings/search`;
    const param = {
      search: {
        filter: {
          store_id: storeId,
          product_id: productId,
        }
      }
    };
    return $http.post(path, param).then(res => {
      const listingId = _.get(res, 'data.listings[0].id');
      const path2 = `${$rootScope.analytics}/v3/stores/${DashboardFactory.getStoreId()}/listings/${listingId}/quantity_histories`;
      return $http.get(path2);
    });
  };

  return {
    getInventory: getInventory,
    getInventorys: getInventorys,
    updateInventory: updateInventory,
    getQuantityHistory,
  };

}

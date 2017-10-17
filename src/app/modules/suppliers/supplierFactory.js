export function SupplierFactory(DashboardFactory, CommonFactory, $cacheFactory, $rootScope, $http) {
  'ngInject';

  var endPoint = function () {
    return $rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/suppliers/';
  };

  var httpCache = $cacheFactory.get('$http');

  var getSupplier = function (id) {
    return $http.get(endPoint() + id);
  };
  var createSupplier = function (supplier) {
    httpCache.remove(endPoint());
    return $http.post(endPoint(), { supplier: supplier });
  };
  var updateSupplier = function (id, newSupplier, oldSupplier) {
    httpCache.remove(endPoint());

    var diff = CommonFactory.getDiff(newSupplier, oldSupplier);
    delete diff.listings;
    delete diff.listing_items;
    return $http.put(endPoint() + id, { supplier: diff });
  };
  var getPurchaseOrderHistory = function (id) {
    return $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders?page=1&per_page=20&filters[]=supplier_id__equal__' + id);
  };

  var deleteSupplier = function (id) {
    return $http.delete(endPoint() + id);
  };

  return {
    getSupplier: getSupplier,
    createSupplier: createSupplier,
    updateSupplier: updateSupplier,
    getPurchaseOrderHistory: getPurchaseOrderHistory,
    deleteSupplier: deleteSupplier
  };

}

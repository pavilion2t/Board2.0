export function GoodsFactory($rootScope, $http, DashboardFactory, CommonFactory, messageFactory) {
  'ngInject';

  var returnMode = 'Normal';
  var getGoods = function( id ) {
    return $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/receive_orders/' + id );
  };
  var deleteGoods = function( id ) {
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/receive_orders/' + id + '/cancel' );
  };
  var updateGoods = function( id, order ) {
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/receive_orders/' + id, order );
  };
  var fulfillGoods = function( id, order ) {
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/receive_orders/' + id + '/receive', order );
  };
  var createGoods = function( order ) {
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/receive_orders', order );
  };
  return {
    returnMode: returnMode,
    getGoods: getGoods,
    deleteGoods: deleteGoods,
    updateGoods: updateGoods,
    createGoods: createGoods,
    fulfillGoods: fulfillGoods
  }

}

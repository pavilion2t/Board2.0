export function CustomerFactory($rootScope, $http, CommonFactory, DashboardFactory) {
  'ngInject';
  var searchCustomers = function (name) {
    return $http.get($rootScope.goApi + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/customers?per_page=999999&filters[]=name__contain__' + name);
  };
  var getCustomer = function (id) {
    return $http.get($rootScope.goApi + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/customers/' + id);
  };
  var createCustomer = function (customer) {
    var fd = new FormData();
    for (var key in customer) {
      fd.append('customer[' + key + ']', customer[key]);
    }
    return $http.post($rootScope.goApi + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/customers', fd, {
      // dunno why we need this, but it works somehow
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }
    });
  };
  var updateCustomer = function (id, newCustomer, oldCustomer) {
    var diff = CommonFactory.getDiff(newCustomer, oldCustomer);
    if (!Object.keys(diff).length) {
      return $http.put($rootScope.goApi + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/customers/' + id, { customer: {} });
    } else {
      var fd = new FormData();
      for (var key in diff) {
        fd.append('customer[' + key + ']', diff[key]);
      }
      return $http.put($rootScope.goApi + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/customers/' + id, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      });
    }
  };
  var deleteCustomer = function (id) {
    return $http.delete($rootScope.goApi + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/customers/' + id);
  };
  // cache: true?
  var getRecentOrders = function (id) {
    // /v3/stores/321/customers/81506/orders?date_from=2014-12-01&date_to=2014-12-31
    return $http.get($rootScope.analytics + '/v3/stores/' + DashboardFactory.getStoreId() + '/customers/' + id + '/orders');
  };
  var getPurchasedItems = function (id) {
    // /v3/stores/321/customers/81506/purchase_statistics?date_from=2014-12-01&date_to=2014-12-31
    return $http.get($rootScope.analytics + '/v3/stores/' + DashboardFactory.getStoreId() + '/customers/' + id + '/purchased_items');
  };

  var adjustLoyalty = function (id, data) {
    return $http.post($rootScope.gateway + '/v1/stores/' + DashboardFactory.getStoreId() + '/customers/' + id + '/stamps', data);
  };

  var getLoyaltyStampHistory = function (id) {
    return $http.get($rootScope.analytics + '/v3/stores/' + DashboardFactory.getStoreId() + '/stamp_histories?customer_id=' + id);
  };

  var adjustCredit = function (id, credit) {
    credit.note = credit.note || '';
    var data = {
      store_credit_history: credit
    };
    return $http.post($rootScope.gateway + '/v1/stores/' + DashboardFactory.getStoreId() + '/customers/' + id + '/store_credit_histories', data);
  };

  var getStoreCreditHistory = function (id) {
    // /v3/stores/321/customers/81506/store_credit_histories?date_from=2014-12-01&date_to=2014-12-31
    return $http.get($rootScope.analytics + '/v3/stores/' + DashboardFactory.getStoreId() + '/customers/' + id + '/store_credit_histories');
  };

  var getDiscount = function (id) {
    return $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/discounts?page=1&per_page=99999');
  };

  var getMembershipLevels = function (storeId) {
    storeId = storeId | DashboardFactory.getStoreId();
    return $http.get($rootScope.api + '/api/v2/stores/' + storeId + '/membership_levels?page=1&per_page=99999');
  };

  return {
    searchCustomers: searchCustomers,
    getCustomer: getCustomer,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer,
    deleteCustomer: deleteCustomer,
    getRecentOrders: getRecentOrders,
    getPurchasedItems: getPurchasedItems,
    adjustLoyalty: adjustLoyalty,
    getLoyaltyStampHistory: getLoyaltyStampHistory,
    adjustCredit: adjustCredit,
    getStoreCreditHistory: getStoreCreditHistory,
    getDiscount: getDiscount,
    getMembershipLevels: getMembershipLevels
  };

}

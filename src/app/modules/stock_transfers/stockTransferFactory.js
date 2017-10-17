export function StockTransferFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  var getStockTransfer = function (id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/stock_transfers/' + id);
  };
  var createStockTransfer = function (transfer) {
    var st = _.cloneDeep(transfer);
    if (st.type === 'departing') {
      st.departing_store_id = DashboardFactory.getStoreId();
    } else if (st.type === 'receiving') {
      st.receiving_store_id = DashboardFactory.getStoreId();
    }
    st.stock_transfer_items = _.map(st.stock_transfer_items, function (item) {
      return { listing_id: item.listing_id, quantity: item.quantity };
    });
    delete st.type;
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/stock_transfers', { stock_transfer: st });
  };
  var updateStockTransfer = function (id, transfer) {
    return $http.put($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/stock_transfers/' + id, { stock_transfer: transfer });
  };
  var submitStockTransfer = function (id) {
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/stock_transfers/' + id + '/submit');
  };
  var approveStockTransfer = function (id) {
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/stock_transfers/' + id + '/approve');
  };
  var cancelStockTransfer = function (id) {
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/stock_transfers/' + id + '/cancel');
  };
  var updateStockTransferItem = function (id, itemId, diff) {
    return $http.put($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/stock_transfers/' + id + '/stock_transfer_items/' + itemId, { stock_transfer_item: diff });
  };

  return {
    getStockTransfer: getStockTransfer,
    createStockTransfer: createStockTransfer,
    updateStockTransfer: updateStockTransfer,
    submitStockTransfer: submitStockTransfer,
    approveStockTransfer: approveStockTransfer,
    cancelStockTransfer: cancelStockTransfer,
    updateStockTransferItem: updateStockTransferItem,
  };
}

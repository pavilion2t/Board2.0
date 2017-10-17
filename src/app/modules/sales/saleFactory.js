export function SaleFactory($rootScope, $http, DashboardFactory) {

  var getSale = function(number) {
    return $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/orders/' + number);
  };
  var issueFullRefund = function(number, order) {
    var transactions = _.map(order.sale_transactions, function(t) {
      return {
        transaction_id: t.id,
        amount: Number(t.amount_lefted)
      };
    });
    var items = _.map(order.listing_line_items, function(item) {
      return {
        line_item_id: item.id,
        amount: Number(item.amount_lefted) * (1 + Number(item.tax_rate))
      };
    });
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/orders/' + number + '/refunds', {
      refund: {
        user_id: order.user_id,
        store_id: DashboardFactory.getStoreId(),
        number: number,
        // transactions_to_be_refunded: transactions,
        refund_entries: items,
        refund_reason: 'No'
      }
    });
  };

  var setItemStatus = function(order_number, line_item_code, statusId) {
    var path = $rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/orders/' + order_number + '/line_items/' + line_item_code;
    return $http.put(path, {line_item_status_id: statusId }) || '';
  };
  var getItemStatus = function(order_number, line_item_code) {
    var path = $rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/orders/' + order_number + '/line_items/' + line_item_code + '/statuses';
    return $http.get(path);
  };

  return {
    getSale: getSale,
    setItemStatus: setItemStatus,
    issueFullRefund: issueFullRefund,
    getItemStatus: getItemStatus
  };

}

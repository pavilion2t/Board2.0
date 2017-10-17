export class PurchaseOrderFulfillController {
  constructor(gettextCatalog, PurchaseOrderFormatter, $scope) {
    'ngInject';

    $scope.editColumns = [
      { field: 'name', name: 'Name', ratio: '60%', formatter: PurchaseOrderFormatter.nameFormatter, bindHtml: true },
      { field: 'quantity', name: 'Ordered', ratio: '15%', type: 'number' },
      { field: 'total_received', name: 'Fulfilled', editable: true, ratio: '15%', type: 'number' },
      { field: null, name: 'In Transit', ratio: '15%', type: 'number', formatter: PurchaseOrderFormatter.qtyInTransitFormatter },
    ];

    $scope.purchase_items = _.map($scope.$parent.order.purchase_items, function (item) {
      item.total_received = item.qty_received;
      return item;
    });

    $scope.returnFulfill = function (purchase_items) {
      if (_checkReceived(purchase_items)) {
        var fulfillData = _.map(purchase_items, function (item) {
          return { id: item.id, quantity: item.total_received - item.qty_received };
        });

        $scope.closeThisDialog(fulfillData);
      }
    };

    var _checkReceived = function (purchase_items) {
      var isOver = !!_.find(purchase_items, function (item) {
        return item.total_received > item.quantity;
      });
      if (isOver) {
        return confirm(gettextCatalog.getString("You've received more than you ordered. Add the extra items and continue?"));
      } else {
        return true;
      }
    };

  }
}

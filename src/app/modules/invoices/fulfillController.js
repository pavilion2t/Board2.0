export class InvoiceFulfillController {
  constructor(PurchaseOrderFormatter, $scope) {
    'ngInject';

    console.log('PurchaseOrderFulfillController', $scope);


    $scope.editColumns = [
      {field: 'label', name: 'Name', ratio: '70%', formatter: PurchaseOrderFormatter.nameFormatter, bindHtml: true},
      {field: 'quantity', name: 'Ordered', ratio: '15%',  type: 'number'},
      {field: 'qty_fulfilled', name: 'Fulfilled', editable: true, ratio: '15%', type: 'number'},
    ];

    $scope.lineItems = _.map($scope.$parent.lineItems, function(item) {
      return {
        id: item.id,
        label: item.label,
        quantity: item.quantity,
        qty_fulfilled_cache: item.qty_fulfilled,
        qty_fulfilled: item.qty_fulfilled,
      };
    });

    $scope.setAllFulfill = function(lineItems) {
      _.each($scope.lineItems, function(item) {
        item.qty_fulfilled = item.quantity;
      });
    };

    $scope.returnFulfill = function(lineItems){
      var fulfillData = _.map(lineItems, function(item) {
        return {
          id: item.id,
          quantity: item.qty_fulfilled - item.qty_fulfilled_cache,
        };
      });

      $scope.closeThisDialog(fulfillData);
    };

  }
}

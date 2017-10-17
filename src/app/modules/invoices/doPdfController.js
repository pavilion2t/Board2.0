export class DoPdfController{
  constructor($filter, $scope, $rootScope, $state, $stateParams, DashboardFactory, InvoiceFactory, CustomerFactory, ExportFactory, FormatterFactory, $q, PdfInvoiceFactory) {
    'ngInject';

    var invoiceType = $state.is('app.dashboard.quotes') ? 'quotes' : 'invoices';

    $scope.currentStores = $rootScope.currentStores;

    var invoiceType = $state.is('app.dashboard.quotes') ? 'quotes' : 'invoices';
    InvoiceFactory.getInvoice($stateParams.number, invoiceType)
      .success(function(data) {
        if(invoiceType === 'quotes') {
          $scope.invoice = data.quote;
        } else {
          $scope.invoice = data.invoice;
        }
        refreshDeliveryOrders();
      })
      .error(function(err) {
        console.error(err);
      });
    var refreshDeliveryOrders = function(){
      InvoiceFactory.getDeliveryOrdersByInvoice($scope.invoice.id)
        .success(function(data) {
          console.log(data);
          $scope.delivery_orders = data.delivery_orders;
          _.each($scope.delivery_orders,function(order){
            order._show = false;
            order.state = order.state?order.state:'created';
            order.selected = true;
          });

        });
    };

    $scope.user_input = {  };
    $scope.user_input.bill_to = '';

    $scope.selectAll = function(){
      for ( var i = 0; i < $scope.delivery_orders.length; i ++  ){
        $scope.delivery_orders[i].selected = true;
      }
    };

    $scope.selectNone = function(){
      for ( var i = 0; i < $scope.delivery_orders.length; i ++  ){
        $scope.delivery_orders[i].selected = false;
      }
    };

    $scope.backToInvoice = function(){
      $state.go('app.dashboard.invoices.view', $stateParams);
    };


    $scope.exportPdf = function( format ){
      PdfInvoiceFactory.exportDo ( format, $scope.currentStores[0], $scope.invoice, $scope.delivery_orders, $scope.user_input );
    };


  }
}

export class InvoiceQuotePdfController {
  constructor($filter, $scope, $rootScope, $state, $stateParams, DashboardFactory, InvoiceFactory, CustomerFactory, ExportFactory, FormatterFactory, $q, PdfInvoiceFactory) {
    'ngInject';

    var invoiceType = $state.is('app.dashboard.quotes') ? 'quotes' : 'invoices';

    var initializeListings = function (listing) {
      $scope.lineItems = []
        .concat(listing.charge_line_items)
        .concat(listing.gift_card_line_items)
        .concat(listing.listing_line_items)
        .concat(listing.reward_line_items)
        .concat(listing.store_credit_line_items);
      if (listing.delivery_line_item) $scope.lineItems.push(listing.delivery_line_item);
    };

    $scope.currentStores = $rootScope.currentStores;
    InvoiceFactory.getInvoice($stateParams.number, invoiceType).success(function (data) {

      if (invoiceType === 'quotes') {
        $scope.invoice = data.quote;
      }
      else {
        $scope.invoice = data.invoice;
        initializeListings($scope.invoice);
      }
    })
      .error(function (err) {
        console.error(err);
      });

    $scope.user_input = { payment_terms: '' };

    $scope.backToInvoice = function () {
      $state.go('app.dashboard.invoices.view', $stateParams);
    };

    $scope.exportPdf = function (format) {
      var promises = _.map($scope.lineItems, function (item) {
        return DashboardFactory.searchListingByID(item.purchasable_id);
      });

      $q.all(promises).then(function (item) {
        _.map($scope.lineItems, function (p, index) {
          p.upc = item[index].listing.upc;
          p.listing_barcode = item[index].listing.listing_barcode;
        });
        PdfInvoiceFactory.exportInvoice(format, $scope.currentStores[0], $scope.invoice, $scope.lineItems, $scope.user_input);
      });


    };


  }
}

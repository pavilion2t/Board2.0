export class LineItemsController {
  constructor(LineItemStatusFactory, $scope, $rootScope, $state, DashboardFactory, FormatterFactory, gettextCatalog) {
    'ngInject';

    var statusObj = {};
    var associatesObj = {};

    $scope.title = 'lineItems';

    // ROUTE
    var store_id = DashboardFactory.getStoreId();
    $scope.route = $rootScope.gateway + '/v2/stores/' + store_id + '/line_items';

    // GRID
    var labelFormatter = function(row, column, value, columnDef, dataContext) {
      if( dataContext.line_item_code_active === false) {
        return value + ' (status inactive)'
      } else {
        return '<a href="' + store_id + '/line-items/' + dataContext.line_item_code + '?order=' + dataContext.order_number + '">' + value + '</a>';
      }
    };
    var orderNumberFormatter = function(row, column, value, columnDef, dataContext) {
      return '<a href="' + store_id + '/sales/' + value + '">' + value + '</a>';
    };
    var statusFormatter = function(row, column, value, columnDef, dataContext) {
      try {
        return value.line_item_status.status;
      } catch(e) {
        return "";
      }
    };
    var timeFormatter = function(row, column, value, columnDef, dataContext) {
      try {
        return FormatterFactory.dateFormatter(row, column, value.created_at, columnDef, dataContext);
      } catch(e) {
        return "";
      }
    };

    var employeeFormatter = function(row, column, value, columnDef, dataContext) {
      try {
        return value.user.display_name;
      } catch(e) {
        return "";
      }
    };

    $scope.columns = [
      {field: 'label', name: gettextCatalog.getString('Line Item'), ratio: '20%', formatter: labelFormatter, pdfFormatter:'raw'},
      {field: 'barcode', name: gettextCatalog.getString('Barcode'), ratio: '20%', formatter: FormatterFactory.basicFormatter},
      {field: 'order_number', name: gettextCatalog.getString('Order Id'), ratio: '15%', formatter: orderNumberFormatter, pdfFormatter:'raw'},
      {field: 'reference_number', name: gettextCatalog.getString('Invoice Ref No.'), ratio: '15%'},
      {field: 'current_status', name: gettextCatalog.getString('Current Status'), ratio: '15%', formatter: statusFormatter},
      {field: 'current_status', name: gettextCatalog.getString('Time'), ratio: '15%', formatter: timeFormatter},
      {field: 'current_status', name: gettextCatalog.getString('Employee'), ratio: '15%', formatter: employeeFormatter},
    ];
    $scope.actions = [
      ['View', function(item) {
        $state.go('app.dashboard.line-items.view', { store_id: store_id, code: item.line_item_code, order: item.order_number});
      }]
    ];

    // FILTERS
    $scope.filterColumns = [
      {field: 'label', name: gettextCatalog.getString('label'), types: ['equal', 'contain']},
      {field: 'upc', name: gettextCatalog.getString('Barcode'), types: ['equal', 'contain']},
      {field: 'orders.reference_number', name: gettextCatalog.getString('reference number'), types: ['equal', 'contain']},
      {field: 'orders.number', name: gettextCatalog.getString('Order Number'), types: ['equal', 'contain']},
      {
        field: 'line_item_status_histories.line_item_status_id',
        name: gettextCatalog.getString('Current status'),
        types: ['options'],
        options: statusObj
      },
      {
        field: 'line_item_status_histories.user_id',
        name: gettextCatalog.getString('Employee'),
        types: ['options'],
        options: associatesObj,
      },
    ];

    // HACKS
    $scope.objectWrap = 'line_item';
    $scope.isHidingNewButton = true;

    LineItemStatusFactory.getStatus().success(function(res) {

      var cache = _.reduce(res.data.line_item_statuses, function(result, val, index) {
        result[val.status] = val.id;
        return result;
      }, statusObj);

      statusObj = cache;
    });

    DashboardFactory.getAssociates().then(function(res) {
      associatesObj = res;
    });

  }
}
export class LineItemViewController {
  constructor($stateParams, $scope, LineItemFactory, SaleFactory) {
    'ngInject';

    var lineItemCode = $stateParams.code;
    var orderNumber = $stateParams.order;

    $scope.orderNumber = orderNumber;

    LineItemFactory.getByCode(orderNumber, lineItemCode).success(function(res) {
      $scope.lineItem = res.line_item;
    });

    SaleFactory.getItemStatus(orderNumber, lineItemCode).success(function(res) {
      $scope.statusHistory = res.histories;
    });


  }
}

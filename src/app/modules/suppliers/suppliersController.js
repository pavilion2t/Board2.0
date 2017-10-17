export class SuppliersController {
  constructor(messageFactory, $scope, $rootScope, $state, DashboardFactory, gettextCatalog, SupplierFactory, $stateParams) {
    'ngInject';

    $scope.title = 'Supplier';

    $scope.editPermission = DashboardFactory.getCurrentEditPermission('supplier');


    var store_id = DashboardFactory.getStoreId();
    $scope.route = $rootScope.api + '/api/v2/stores/' + store_id + '/suppliers';

    // GRID
    var nameFormatter = function(row, cell, value, columnDef, dataContext) {
      return '<a href="' + store_id + '/suppliers/' + dataContext.id + '">' + value + '</a>';
    };
    $scope.columns = [
      {field: 'name', name: gettextCatalog.getString('Supplier Name'), ratio: '20%', formatter: nameFormatter, pdfFormatter: 'raw'},
      {field: 'phone', name: gettextCatalog.getString('Phone'), ratio: '15%'},
      {field: 'email', name: gettextCatalog.getString('Email'), ratio: '30%'},
      {field: 'address', name: gettextCatalog.getString('Address'), ratio: '20%'},
      {field: 'contact', name: gettextCatalog.getString('Contact'), ratio: '15%'},
    ];
    $scope.filterColumns = [
      {field: 'name', name: gettextCatalog.getString('Supplier Name'), types: ['contain'], defaultFilter: true},
      {field: 'phone', name: gettextCatalog.getString('Phone'), types: ['contain']},
      {field: 'email', name: gettextCatalog.getString('Email'), types: ['contain']},
      {field: 'address', name: gettextCatalog.getString('Address'), types: ['contain']},
      {field: 'contact', name: gettextCatalog.getString('Contact'), types: ['contain']},
    ];
    $scope.actions = [
      ['View', function(item) {
        $state.go('app.dashboard.suppliers.view', { store_id: store_id, supplier_id: item.id });
      }],
      ['Delete', function(item) {
        if(!confirm('Do you really want to delete this item?')) return false;
        //$scope.loadingGrid = true;
        SupplierFactory.deleteSupplier(item.id)
          .success(function(data) {
            console.log(data);
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function(err) {
            console.error(err.message);
            $scope.loadingGrid = false;
            var msg = err.message === 'Cannot find this resource.' ? 'Please contact master store if you want to remove this record' : err.message;
            messageFactory.add(msg, 'error');

          });
      },
        function() {
          return DashboardFactory.getCurrentStore().associate_type === 'MANAGER';
        }]
    ];
    $scope.objectWrap = 'supplier';
  }
}

export class SupplierViewController{
  constructor($filter, $scope, $rootScope, $state, $stateParams, DashboardFactory , FormatterFactory, SupplierFactory, currencymap) {


    $scope.editPermission = DashboardFactory.getCurrentEditPermission('supplier');


    DashboardFactory.getExchangeRate().then(function(data){
      $scope.currency = _.map(data.data.exchange_rates, function(item){
        return {
          name: currencymap[item.currency_to].name,
          symbol: currencymap[item.currency_to].symbol_native,
          currency_to: item.currency_to,
          rate: parseFloat(item.rate)
        };
      });

      var defaultCurrency = DashboardFactory.getCurrentStore().currency;

      $scope.currency.unshift({
        name: currencymap[defaultCurrency].name,
        symbol: currencymap[defaultCurrency].symbol_native,
        currency_to: defaultCurrency,
        rate: 1.0
      })
    });

    var dollarFormatter = function(value) {
      return $filter('myCurrency')(value);
    };

    var dateFormatter = function(value, item) {
      return FormatterFactory.dateFormatter(0, 0, value) ;
    };

    $scope.section = 'overview';
    $scope.editProductColumns = [
      {field: 'name', name: 'Item', ratio: '40%'},
      {field: 'cost', name: 'Cost', ratio: '12%', formatter: dollarFormatter},
      // ordered
      {field: 'quantity', name: 'In Stock', ratio: '12%'},
      {field: 'price', name: 'Price', ratio: '12%', formatter: dollarFormatter},
      {field: 'reorder_point', name: 'Reorder PT', ratio: '12%'},
      {field: 'reorder_level', name: 'Reorder QTY', ratio: '12%'},
    ];
    $scope.editPoHistoryColumns = [
      {field: 'created_at', name: 'Date', ratio: '30%', formatter: dateFormatter },
      {field: 'number', name: 'P.O. Number', ratio: '30%'},
      // fix later
      {field: 'total_quantity', name: 'Quantity', ratio: '20%'},
      {field: 'total_amount', name: 'Amount', ratio: '20%', formatter: dollarFormatter},
    ];

    var _supplierCache = {};
    var _ordersCache = [];

    $scope.enableEditMode = function() {
      $scope.editMode = true;
      angular.copy($scope.supplier, _supplierCache);
      angular.copy($scope.orders, _ordersCache);
    };

    $scope.bottomActions = [
      ['Cancel', function() {
        if(confirm('Discard all changes?')) {
          $scope.supplier = angular.copy(_supplierCache, $scope.supplier);
          $scope.orders = angular.copy(_ordersCache, $scope.orders);
          $scope.editMode = false;
        }
      }, false],
      ['Save', function() {
        SupplierFactory.updateSupplier($stateParams.supplier_id, $scope.supplier, $scope.oldSupplier)
          .success(function(data) {
            console.log(data);
            $state.go('app.dashboard.suppliers.index', { store_id: DashboardFactory.getStoreId() }, { reload: true });
          })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });
      }, true],
    ];

    // load supplier
    SupplierFactory.getSupplier($stateParams.supplier_id)
      .success(function(data) {
        $scope.supplier = data.supplier;
        $scope.oldSupplier = _.cloneDeep($scope.supplier);
        // hacky - create supplier product list
        _.each($scope.supplier.listings, function(item) {
          var listingId = item.listing_id;
          for(var i = 0; i < $scope.supplier.listing_items.length; i++) {
            if(listingId === $scope.supplier.listing_items[i].id) {
              $scope.supplier.listing_items[i].reorder_level = item.reorder_level;
              $scope.supplier.listing_items[i].reorder_point = item.reorder_point;
              break;
            }
          }
        });
      })
      .error(function(err) {
        console.error(err);
      });

    SupplierFactory.getPurchaseOrderHistory($stateParams.supplier_id)
      .success(function(data) {
        $scope.orders = _.map(data, function(item, i) {
          return item.purchase_order;
        });
      })
      .error(function(err) {
        console.error(err);
      });

  }
}

export class SupplierNewController {
  constructor($scope, $rootScope, $state, DashboardFactory, SupplierFactory, currencymap) {
    'ngInject';

    console.log('SupplierNewController');
    $scope.editMode = true;
    $scope.supplier = {};

    DashboardFactory.getExchangeRate().then(function(data){

      $scope.currency = _.map(data.data.exchange_rates, function(item){
        return {
          name: currencymap[item.currency_to].name,
          symbol: currencymap[item.currency_to].symbol_native,
          currency_to: item.currency_to,
          rate: parseFloat(item.rate)
        };
      });

      var defaultCurrency = DashboardFactory.getCurrentStore().currency;

      $scope.currency.unshift({
        name: currencymap[defaultCurrency].name,
        symbol: currencymap[defaultCurrency].symbol_native,
        currency_to: defaultCurrency,
        rate: 1.0
      })
    });


    $scope.bottomActions = [
      ['Cancel', function() {
        $state.go('app.dashboard.suppliers.index', { store_id: DashboardFactory.getStoreId() });
      }, false],
      ['Save', function() {

        SupplierFactory.createSupplier($scope.supplier)
          .success(function(data) {

            $state.go('app.dashboard.suppliers.index', { store_id: DashboardFactory.getStoreId() }, { reload: true });
          })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });
      }, true],
    ];

  }
}

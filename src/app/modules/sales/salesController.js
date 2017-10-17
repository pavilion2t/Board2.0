export class SalesController {
  constructor($scope, $rootScope, $state, DashboardFactory, FormatterFactory, gettextCatalog) {
    'ngInject';
    $scope.title = 'Sales';

    // ROUTE
    var store_id = DashboardFactory.getStoreId();
    $scope.route = $rootScope.gateway + '/v2/stores/' + store_id + '/order_correspondences?sales_page=true';

    // GRID
    var orderNumberFormatter = function(row, column, value, columnDef, dataContext) {
      return '<a href="' + store_id + '/sales/' + value + '">' + value + '</a>';
    };

    var orderNumberFormatterLite = function(row, column, value, columnDef, dataContext) {
      return value;
    };

    var statusFn = function(value, dataContext){
      var status_class = value;
      value = _.startCase(value);
      return {value:value, status_class:status_class};
    }

    var statusFormatter = function(row, column, value, columnDef, dataContext) {
      var status = statusFn (value, dataContext);
      var statusHTML = '<span><i class="status-icon ' + status.status_class + '"></i>' + status.value + '</span>';
      return statusHTML;
    };

    var statusFormatterLite = function(row, column, value, columnDef, dataContext) {
      var status = statusFn (value, dataContext);
      return status.value;
    };
    $scope.columns = [
      {field: 'number', name: gettextCatalog.getString('Order Number'), ratio: '30%', formatter: orderNumberFormatter, pdfFormatter: orderNumberFormatterLite},
      {field: 'created_at', name: gettextCatalog.getString('Order Date'), ratio: '20%', formatter: FormatterFactory.dateFormatter},
      {field: 'customer_name', name: gettextCatalog.getString('Buyer'), ratio: '20%', formatter: FormatterFactory.basicFormatter},
      {field: 'quote_invoice_state', name: gettextCatalog.getString('State'), ratio: '15%', formatter: statusFormatter, pdfFormatter: statusFormatterLite},
      {field: 'initial_total', name: gettextCatalog.getString('Total'), ratio: '15%', formatter: FormatterFactory.dollarFormatter}
    ];
    $scope.actions = [
      ['View', function(item) {
        $state.go('app.dashboard.sales.view', { store_id: store_id, number: item.number });
      }]
    ];

    // FILTERS
    $scope.filterColumns = [
      {field: 'number', name: gettextCatalog.getString('Order Number'), types: ['contain', 'equal']},
      {field: 'completed_at', name: gettextCatalog.getString('Order Date'), types: ['between'], isDate: true},
      // {field: 'customer', name: 'Customer Name', types: ['contain']},
      // {field: 'quantity', name: 'Quantity', types: ['equal', 'between']},
      {field: 'initial_total', name: gettextCatalog.getString('Total'), types: ['equal', 'between']}
    ];
    $scope.filterType = 'gateway'

    // HACKS
    $scope.isHidingNewButton = true;
  }
}

export class SaleViewController {
  constructor($scope, $rootScope, $http, $timeout, $state, $stateParams, DashboardFactory, SaleFactory, LineItemStatusFactory, ngDialog) {
    'ngInject';

    // TODO: DRY this
    DashboardFactory.getStoreSetting().success(function(res) {
      try {
        $scope.line_item_code_enabled = res.module.line_item_code_enabled;
      } catch(e) {
        console.error('broken store setting data');
      }
    });

    LineItemStatusFactory.getStatus().success(function(res) {
      try {
        $scope.statusList = res.data.line_item_statuses;
      } catch(e) {
        console.error('broken status list data');
      }
    });

    $scope.bottomActions = [
      ['Back', function() {
        $state.go('app.dashboard.sales.index', { store_id: DashboardFactory.getStoreId() });
      }, false]
    ];

    $scope.getStatusName = function(statusId) {
      statusId = statusId || 0;
      var status = _.find($scope.statusList, {id: statusId});
      return status ? status.status : '---';
    };

    $scope.showStatusHistory = function(line_item_code){
      SaleFactory.getItemStatus($stateParams.number, line_item_code).success(function(data){

        $scope.statusHistory = data.histories;

        ngDialog.open({
          template: 'app/modules/sales/status_history.html',
          scope: $scope,
          className: 'ngdialog-theme-default ngdialog-theme-white'
        });

      });

    };

    SaleFactory.getSale($stateParams.number)
      .success(function(data) {
        $scope.order = data.order;
        // hack
        $scope.store = _.clone($rootScope.currentStores[0]);
        // calibrate styling
        if ( $scope.order.state ) {
          $scope.order.state = $scope.order.state[0].toUpperCase() + $scope.order.state.slice(1);
        }
        if ( $scope.order.completed_at ) {
          $scope.order.completed_at = $scope.order.completed_at.toLocaleString();
        }

        var line_items = [];

        if($scope.order.listing_line_items.length) {
          _.each($scope.order.listing_line_items,function(item){
            item.type = 'listing';
          })
          line_items = line_items.concat($scope.order.listing_line_items);
        }
        if($scope.order.charge_line_items.length){
          _.each($scope.order.charge_line_items,function(item){
            item.type = 'charge';
          })
          line_items = line_items.concat($scope.order.charge_line_items);
        }
        if($scope.order.reward_line_items.length) {
          _.each($scope.order.reward_line_items,function(item){
            item.type = 'reward';
          })
          line_items = line_items.concat($scope.order.reward_line_items);
        }
        if($scope.order.gift_card_line_items.length) {
          _.each($scope.order.gift_card_line_items,function(item){
            item.type = 'gift card';
          })
          line_items = line_items.concat($scope.order.gift_card_line_items);
        }
        if($scope.order.store_credit_line_items.length) {
          _.each($scope.order.store_credit_line_items,function(item){
            item.type = 'store credit';
          })
          line_items = line_items.concat($scope.order.store_credit_line_items);
        }
        if($scope.order.adjustment_line_items.length) {
          _.each($scope.order.adjustment_line_items,function(item){
            item.type = 'adjustment';
          })
          line_items = line_items.concat($scope.order.adjustment_line_items);
        }


        $scope.order.line_items = line_items;
        $scope.tax_options = {};
        $scope.tax_options_amount = 0;
        _.each($scope.order.line_items,function(item){
          if ( item.tax_option_id && !$scope.tax_options[item.tax_option_id] ){
            $scope.current_tax_options =
            {
              'tax_option_id': item.tax_option_id,
              'tax_rate': item.tax_rate,
              'tax_name': item.tax_name

            };
            $scope.tax_options[item.tax_option_id] = $scope.current_tax_options;
            $scope.tax_options_amount ++;
          }
        });




        $scope.totalQuantity = _.reduce($scope.order.listing_line_items, function(memo, i) {
          return memo + i.quantity;
        }, 0);
      })
      .error(function(err) {
        console.error(err);
      });

  }
}



export function itemStatus(SaleFactory){
  'ngInject';
  return {
    scope: true,
    restrict: 'A',
    link: function($scope, iElm) {
      $scope.showStatus = false;
      $scope.setItemStatus = function(order, item, statusId) {
        SaleFactory
          .setItemStatus(order.number, item.line_item_code, statusId)
          .success(function(res){
            item.line_item_status_id = statusId;
            $scope.showStatus = false;
          });
      };
    }
  };
}

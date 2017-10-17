export class StockTransferController {
  constructor(store_transfer, $http, $scope, $rootScope, $state, $stateParams, DashboardFactory, StockTransferFactory, gettextCatalog) {
    'ngInject';

    $scope.isAllowStoreTransfer = store_transfer && store_transfer.length > 0
    $scope.editPermission = true;

    // ROUTE
    var store_id = DashboardFactory.getStoreId();
    $scope.route = $rootScope.api + '/api/v2/stores/' + store_id + '/stock_transfers';

    // GRID
    var numberFormatter = function(row, column, value, columnDef, dataContext) {
      return '<a href="' + store_id + '/stock-transfers/'+dataContext.id+'">'+value+'</a>';
    };

    var directionFormatter = function(row, column, value, columnDef, dataContext) {
      if(dataContext.departing_store_id === store_id) {
        return 'Outbound';
      } else if(dataContext.receiving_store_id === store_id) {
        return 'Inbound';
      }
    };
    var statusFormatter = function(row, column, value, columnDef, dataContext) {
      var text = _.map(value.split('_'), function(word) {
        return word[0].toUpperCase() + word.slice(1);
      });
      if(value === 'pending') { value = 'created'; }
      return '<span><i class="status-icon ' + value + '"></i>' + text.join(' ') + '</span>';
    };
    var qtyRequestedFormatter = function(row, column, value, columnDef, dataContext) {
      return _.reduce(dataContext.stock_transfer_items, function(memo, item) {
        return memo + item.qty_requested;
      }, 0);
    };
    var qtyDepartedFormatter = function(row, column, value, columnDef, dataContext) {
      return _.reduce(dataContext.stock_transfer_items, function(memo, item) {
        return memo + item.qty_departed;
      }, 0);
    };
    var qtyReceivedFormatter = function(row, column, value, columnDef, dataContext) {
      return _.reduce(dataContext.stock_transfer_items, function(memo, item) {
        return memo + item.qty_received;
      }, 0);
    };
    $scope.columns = [
      {field: 'number', name: gettextCatalog.getString('Number'), ratio: '15%', formatter: numberFormatter},
      {field: 'direction', name: gettextCatalog.getString('In/Out'), ratio: '15%', formatter: directionFormatter},
      {field: 'departing_store_title', name: gettextCatalog.getString('Departing Store'), ratio: '15%'},
      {field: 'receiving_store_title', name: gettextCatalog.getString('Receiving Store'), ratio: '15%'},
      {field: 'qty_requested', name: gettextCatalog.getString('QTY Requested'), ratio: '10%', formatter: qtyRequestedFormatter},
      {field: 'qty_departed', name: gettextCatalog.getString('QTY Departed'), ratio: '10%', formatter: qtyDepartedFormatter},
      {field: 'qty_received', name: gettextCatalog.getString('QTY Received'), ratio: '10%', formatter: qtyReceivedFormatter},
      {field: 'state', name: gettextCatalog.getString('State'), ratio: '10%', formatter: statusFormatter},
    ];
    $scope.actions = [
      ['View', function(item) {
        return $state.go('app.dashboard.stock-transfers.view', { store_id: store_id, id: item.id });
      }],
      ['Cancel', function(item) {
        StockTransferFactory.cancelStockTransfer(item.id)
          .success(function(data) {
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message;
          });
      }, function(item) {
        return item.state !== 'canceled';
      }]
    ];
    $scope.createNewIncomingStockTransfer = function() {
      $state.go('app.dashboard.stock-transfers.new', { type: 'receiving' });
    };
    $scope.createNewOutgoingStockTransfer = function() {
      $state.go('app.dashboard.stock-transfers.new', { type: 'departing' });
    };


    $scope.filterColumns = [
      {field: 'number', name: gettextCatalog.getString('Number'), types: ['contain', 'equal']},
      {field: 'state', name: gettextCatalog.getString('State'), types: ['options'], options: {'Created': 'pending', 'Submitted': 'submitted', 'Fulfilled': 'fulfilled', 'Cancelled': 'canceled'}},
      {field: 'remarks', name: 'Remarks', types: ['contain']},
    ];
  }
}

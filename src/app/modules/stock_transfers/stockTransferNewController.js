export class StockTransferNewController {
  constructor(store_transfer, InventoryFactory, $scope, $rootScope, $http, $q, $state, $stateParams, DashboardFactory, StockTransferFactory, FormatterFactory) {
    'ngInject';

    var store_id = DashboardFactory.getStoreId();
    $scope.editPermission = true;
    $scope.store_id = store_id;

    $scope.stores =  _.filter($rootScope.rawStores, function (store){
      return _.includes(store_transfer, store.id);
    });


    $scope.transferType = $stateParams.type;
    $scope.stockTransfer = { type: $scope.transferType, stock_transfer_items: [] };

    var afterFormatter = function (value, item) {
      if ($scope.stockTransfer.type === 'departing') {
        return item.inventory_quantity - item.quantity;
      } else if ($scope.stockTransfer.type === 'receiving') {
        return item.inventory_quantity + item.quantity;
      } else {
        return '-';
      }
    };
    $scope.editColumns = [
      {field: null, name: 'Item', ratio: '40%', formatter: FormatterFactory.listingInfoFormatter, bindHtml: true},
      {field: 'inventory_quantity', name: 'Current QTY', ratio: '20%', type: 'number'},
      // ordered quantity
      {field: 'quantity', name: 'QTY To Transfer', ratio: '20%', editable: true, type: 'number'},
      {field: null, name: 'QTY After Transfer', ratio: '20%', formatter: afterFormatter},
    ];
    $scope.editRowHeight = 80;

    $scope.bottomActions = [
      ['Cancel', function () {
        $state.go('app.dashboard.stock-transfers.index', { store_id: store_id });
      }, false],
      ['Save', function () {
        StockTransferFactory.createStockTransfer($scope.stockTransfer)
          .success(function (data) {
            console.log(data);
            $state.go('app.dashboard.stock-transfers.index', { store_id: store_id });
          })
          .error(function (err, status) {
            if (status === 401) {
              $scope.errorMessage = 'Store Transfers only works for Chain. Please contact 1800-692-4636 for more information.';
            } else {
              $scope.errorMessage = err.message || 'Error when saving';
            }
          });
      }, true],
    ];

    // ADDING LISTINGS
    $scope.newListingsToAdd = {};

    $scope.canAddListing = function () {
      return ($scope.stockTransfer.type === "departing" && $scope.stockTransfer.receiving_store_id) || ($scope.stockTransfer.type === "receiving" && $scope.stockTransfer.departing_store_id);
    };

    $scope.addItems = function (res) {
      if (res.value == "$closeButton" || res.value == "$document") {
        return;
      }

      var selectedLisings = res.value;

      var listingsToAdd = _.map(selectedLisings, function (listing) {
        return {
          name: listing.name,
          upc: listing.upc,
          product_id: listing.product_id,
          quantity: listing.qtyRequested,
          listing_id: listing.id,
          inventory_quantity: 0,
        };
      }) || [];

      if (listingsToAdd.length > 0){
        let newItems = $scope.stockTransfer.stock_transfer_items.slice(0);
        listingsToAdd.forEach(item => {
          const target = _.find(newItems, { listing_id: item.listing_id });
          if (target){
            target.quantity += item.quantity;
          } else {
            newItems.push(item);
          }
        });
        $scope.stockTransfer.stock_transfer_items = newItems;
      }

      // Update current item quantity
      _.each($scope.stockTransfer.stock_transfer_items, function (item) {
        InventoryFactory.getInventoryWithMemebers(item.listing_id, store_id).success(function (data) {
          var memberListings = _.map(data, function (item) {return item.listing;});

          var sameListing = _.find(memberListings, {store_id: store_id});

          item.inventory_quantity = sameListing.quantity;
        });
      });
    };

    $scope.isEnablingSaveButton = function () {
      return _.reduce($scope.newListingsToAdd, function (memo, value) {
        return value ? memo + 1 : memo;
      }, 0);
    };

  }
}

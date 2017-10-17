export class ItemMasterController {
  constructor($scope, $rootScope, $state, $stateParams, DashboardFactory, FormatterFactory, ItemMasterFactory, gettextCatalog) {
    'ngInject';

    $scope.title = 'Inventory';
    $scope.section = 'overview';

    var inventoryFormatter = function (row, cell, value, columnDef, dataContext) {
      var imgHTML = '<img placeholder-src="inventory" class="item__image item-master-item" src="' + dataContext.image_url + '">';
      var nameHTML = '<p><a href="' + store_id + '/item-master/' + dataContext.id + '">' + dataContext.name + '</a></p>';
      var codeHTML = dataContext.upc ? '<p>Code: ' + dataContext.upc + '</p>' : '<p>Code: N/A</p>';
      var inventoryHTML = '<div class="_inventory-item _compile">' + imgHTML + nameHTML + codeHTML + '</div>';
      return inventoryHTML;
    };

    var quantityFormatter = function (row, cell, value, columnDef, dataContext) {
      if (dataContext.track_quantity) {
        return value < 1 ? '<span style="color: red">' + value + '</span>' : value;
      } else {
        return 'Unlimited';
      }
    };
    var quantityFormatterLite = function (row, cell, value, columnDef, dataContext) {
      if (dataContext.track_quantity) {
        return value;
      } else {
        return 'Unlimited';
      }
    };

    var store_id = DashboardFactory.getStoreId();
    $scope.route = $rootScope.api + '/api/v2/chains/' + store_id + '/products';
    $scope.columns = [
      { field: "name", name: gettextCatalog.getString("Product Name"), ratio: '60%', formatter: inventoryFormatter, pdfFormatter: 'raw' },
      { field: "category_name", name: gettextCatalog.getString("Category"), ratio: '10%' },
      { field: "qty_on_shelf", name: gettextCatalog.getString("QTY on shelf"), ratio: '10%', formatter: quantityFormatter, pdfFormatter: quantityFormatterLite },
      { field: "price", name: gettextCatalog.getString("Price"), ratio: '10%', formatter: FormatterFactory.dollarFormatter },
      { field: "product_id", name: gettextCatalog.getString("Product ID"), ratio: '10%' },
    ];
    $scope.filterColumns = [
      { field: "name", name: gettextCatalog.getString("Product Name"), defaultFilter: true, types: ['contain'] },
      { field: "upc", name: gettextCatalog.getString("UPC"), types: ['contain', 'equal'] },
      { field: "product_id", name: gettextCatalog.getString("Product ID"), types: ['equal'] },


      { field: "quantity", name: gettextCatalog.getString("Quantity"), types: ['equal', 'between'] },
      { field: "qty_on_shelf", name: gettextCatalog.getString("QTY on shelf"), types: ['equal', 'between'] },
      { field: "price", name: gettextCatalog.getString("Price"), types: ['equal', 'between'] },
      { field: "updated_at", name: gettextCatalog.getString("Updated At"), types: ['between'], isDate: true },
    ];


    $scope.actions = [
      ['View', function (item) {
        $state.go('app.dashboard.item-master.view', { listing_id: item.id });
      }],
    ];


    // HACKS
    $scope.objectWrap = 'product';
    //$scope.isShowingFilters = true;
    //$scope.rowHeight = 75;


  }
}

export class ItemMasterViewController {
  constructor($scope, ItemMasterFactory, $q, $stateParams, $state, DashboardFactory, $filter, gettextCatalog) {
    'ngInject';

    $scope.section = 'overview';
    $scope.enableEditMode = function () {
      $scope.editMode = true;
      angular.copy($scope.listing, _listingCache);
    };

    $scope.editPermission = DashboardFactory.getCurrentEditPermission('inventory');

    DashboardFactory.getChainModule().then(res => {
      $scope.showLog = !!res.data.chain_module.qty_and_cost_down_enabled;
    });

    var _listingCache = {};
    $scope.bottomActions = [
      ['Cancel', function () {
        if (confirm('Discard all changes?')) {
          angular.copy(_listingCache, $scope.listing);
          $scope.editMode = false;
        }
      }, false],
      ['Save', function () {
        if (!$scope.myForm.$valid) {
          alert('Some values are invalid. Please check again.');
          return;
        }

        var newListing = $scope.listing;
        newListing.tax_option_ids = taxOptionsToIds($scope.taxOptions);

        var promises = [
          ItemMasterFactory.updateInventory($stateParams.listing_id, $scope.listing.price)
        ];
        $q.all(promises)
          .then(function () {
              $state.go($state.current.name, $stateParams, { reload: true });
            },
            function (err) {
              $scope.errorMessage = err.message || 'Error when saving';
            });
      }, true]
    ];

    $q.all([
        ItemMasterFactory.getInventory($stateParams.listing_id),
        ItemMasterFactory.getQuantityHistory($stateParams.listing_id),
      ])
      .then(function ([listingRes, logRes]) {
        $scope.unlimited = 'unlimted';
        $scope.listing = listingRes.data.product;

        $scope.quantityHistory = logRes.data;
      });

    var qtyDeltaFormatter = function (value, item) {
      var quantity_after = new BigNumber(item.quantity_after);
      var num = Number(quantity_after.minus(item.quantity_before));
      var str = '';
      str = num + '';
      if (num > 0) str = '+' + num;
      return '<div class="_align-center">' + str + '</div>';
    };

    const chainQtyAfterFormatter = (value, item) => {
      return new BigNumber(item.quantity_after || 0).add(item.qty_in_transit_from_transfer_after || 0).toString();
    };

    var timeFormater = function (value, item) {
      var html = '<div class="_align-center">' + $filter('momentDate')(value) + '<br>' + $filter('momentTime')(value) + '</div>';
      return html;
    };

    var sourceFormatter = function (value, item) {
      let orderNum = item.order_number || '';
      var html = '<div class="_align-center">' + item.source_type + '<br>' + orderNum + '</div>';
      return html;
    };

    $scope.editSalesColumns = [
      { field: 'origin_store_name', name: gettextCatalog.getString('Origin Store'), ratio: '10%' },
      { field: null, name: gettextCatalog.getString('Effective Date'), ratio: '5%' },
      { field: 'created_at', name: gettextCatalog.getString('Action Date'), ratio: '5%', bindHtml: true, formatter: timeFormater },
      { field: 'user_display_name', name: gettextCatalog.getString('User'), ratio: '5%' },
      { field: null, name: gettextCatalog.getString('Source'), ratio: '5%', bindHtml: true, formatter: sourceFormatter },
      { field: 'action_type', name: gettextCatalog.getString('Action'), ratio: '5%' },
      { field: null, name: gettextCatalog.getString('QTY Delta'), ratio: '5%', formatter: qtyDeltaFormatter, bindHtml: true, pattern: /^\S\s$/ },
      { field: 'cost_on_order', name: gettextCatalog.getString('Cost on Order'), ratio: '5%' },
      { field: 'cost_after', name: gettextCatalog.getString('Cost After'), ratio: '5%' },
      { field: null, name: gettextCatalog.getString('Chain Qty After'), ratio: '5%', formatter: chainQtyAfterFormatter },
    ];

  }
}

function taxOptionsToIds(taxOptions) {
  return _.compact(_.map(taxOptions, (option) => {
    if (option.checked) {
      return option.id;
    }
  }));
}

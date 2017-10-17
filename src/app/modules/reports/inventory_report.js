export class InventoryReportController {
	constructor($scope, reportsFactory, uiGridConstants, ExportFactory, columnDefsFactory, $timeout, $rootScope) {
		'ngInject';

		var columnDefs = [
		                  columnDefsFactory.standardGroupField("store_title"),
		                  columnDefsFactory.standardField("gtid"),
		                  columnDefsFactory.standardField("bpid"),
		                  columnDefsFactory.standardField("listing_barcode","2nd Barcode"),
                      columnDefsFactory.standardField("listing_reference_codes","Listing Reference Codes"),
		                  columnDefsFactory.standardGroupField("product_name","Product name"),
		                  columnDefsFactory.standardNoUnlimitedAggregateField("quantity"),
		                  columnDefsFactory.currencyAggregateField("cost"),
		                  columnDefsFactory.currencyAggregateField("price"),
		                  columnDefsFactory.currencyAggregateField("stock_value"),
		                  columnDefsFactory.currencyAggregateField("market_value"),
		                  columnDefsFactory.standardField("tax_name"),
		                  columnDefsFactory.numberField("tax_rate"),
		                  columnDefsFactory.numberField("reorder_qty","Reorder trigger point"),
		                  columnDefsFactory.numberField("reorder_amount"),
		                  columnDefsFactory.standardGroupField("dept.name","Dept"),
		                  columnDefsFactory.standardGroupField("subdept.name","Sub-Dept"),
		                  columnDefsFactory.standardGroupField("brand.name","Brand"),
		                  columnDefsFactory.standardGroupField("category.name","Category"),
		                  columnDefsFactory.standardGroupField("supplier.name","Supplier")

		                  ];


		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs);
		$scope.gridOptions = {
				columnDefs: columnDefs,
				enableGrouping: true,
				showColumnFooter: true
		};

		//$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'inventory_report');
		var _gridDataCache = null;

		var updateGridMessage = function() {
			$scope.gridMessage = "";
		};

		var updateData = function() {
			$scope.gridMessage = "loading data...";



			reportsFactory.analyticsApi('inventory_report').success(function(res) {

				$scope.dataCallback(res);
				updateGridMessage();
				_gridDataCache = res;

				$scope.gridOptions.data = res;
				//$scope.filterReport($scope.filter);
			});
		};
		$timeout( function()  {
			updateData();
		}, 10);

		// Notes:
			// - If track_quantity = false, quantity must be "Unlimited".
		// - If parent_department exists, show it as "Dept", and show department as "Sub-Dept".
		//   Otherwise show department as "Dept", and leave "Sub-Dept" N/A.
		// - If supplier is null, supplier_product_id, reorder_qty and reorder_amount must be N/A.
		// - Sales Tax Rate is constructed by concatenating tax_name and tax_rate.
		$scope.dataCallback = function(res) {
			return _.map(res, function(item) {
				if(!item.track_quantity) {
					item.quantity = Infinity;
				}
				if(item.supplier === null) {
					item.reorder_qty = 'N/A';
					item.reorder_amount = 'N/A';
				}
				if(item.parent_department.name) {
					item.dept = item.parent_department;
					item.subdept = item.department;
				} else {
					item.dept = item.department;
				}
				return item;
			});
		}

		$scope.filter = {};
		$scope.filter.searchColumn = 'dept';
		$scope.filter.searchType = 'similar';
		$scope.filterReport = function(filter) {
			if(filter.search) {
				$scope.gridOptions.data = _.filter(_gridDataCache, function(item) {
					var name = '';


					if ( item[$scope.filter.searchColumn] && item[$scope.filter.searchColumn].name ){
						name = item[$scope.filter.searchColumn].name.toLowerCase().trim();
					}


					if ( $scope.filter.searchType === 'similar' ){
						return name.search(filter.search.toLowerCase()) > -1;
					}
					else if ( $scope.filter.searchType === 'startsWith' ){
						return name.indexOf(filter.search.toLowerCase()) === 0;
					}
					else if ( $scope.filter.searchType === 'exact' ){
						return name === filter.search.toLowerCase();
					}
				});

			} else {
				$scope.gridOptions.data = _.clone(_gridDataCache);
			}
		};
		$rootScope.title = 'Inventory';

		// TODO
		$scope.showCurrency = reportsFactory.showCurrency;
		$scope.download = function(mode) {
			var header = reportsFactory.header($scope.dateFrom, $scope.dateTo);
			var fileName;
			fileName = 'inventory_report';
			var tables = [];
			tables.push({entries: $scope.gridOptions.data, columns:$scope.gridOptions.columnDefs, tableName:'Inventory Report' });
			ExportFactory.exportTables(mode, tables, header, {layout:'l', showCurrency: $scope.showCurrency.value},  null );
		};

	}
};

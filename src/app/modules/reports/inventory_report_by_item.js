export class InventoryReportByItemController {
	constructor($scope, reportsFactory, uiGridConstants, ExportFactory, columnDefsFactory, $timeout, $rootScope, InventoryReportByItemFactory) {
		'ngInject';

		$scope.dateFrom = moment().subtract(7, 'day').format('YYYY-MM-DD');
		$scope.dateTo = moment().format('YYYY-MM-DD');
		$scope.items = [];
		$scope.addItems = function(data){
			$scope.items = $scope.items.concat(data.value);
		};

		$scope.editColumns = [
		                      {field: 'name', name: 'Name', ratio: '50%'},
		                      {field: 'price', name: 'Unit Cost', ratio: '25%', pattern:/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/},
		                      {field: 'product_id', name: 'Product ID', ratio: '25%', pattern:/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/},

		                      ];

		var updateData = function(){

			var product_id = _.map($scope.items,function(item){
				return item.product_id;
			});

			InventoryReportByItemFactory.getReport($scope.dateFrom, $scope.dateTo, product_id).then(function(data){
				$scope.gridOptions1.data = data.data.data.festive_report_data;
				$scope.gridOptions2.data = data.data.data.festive_report_summary
			});
		};

		$scope.update = updateData;

		var columnDefs1 = [

		                   columnDefsFactory.standardGroupField("product_name"),
		                   columnDefsFactory.standardGroupField("product_id"),
		                   columnDefsFactory.standardField("date"),
		                   columnDefsFactory.numberAggregateField("redeemed_coupon_qty"),
		                   columnDefsFactory.numberAggregateField("stock_qty"),
		                   columnDefsFactory.numberAggregateField("voucher_qty"),
		                   columnDefsFactory.numberAggregateField("total_qty"),
		                   columnDefsFactory.currencyAggregateField("net_total")
		                   ];




		var columnDefs2 = [
		                   columnDefsFactory.standardGroupField("store_title"),
		                   columnDefsFactory.standardGroupField("store_id"),
		                   columnDefsFactory.standardField("date"),
		                   columnDefsFactory.currencyAggregateField("amount")

		                   ];


		$scope.gridOptions1 = {
				columnDefs: columnDefsFactory.translateColumnDefsDisplayName(columnDefs1),
				data: [],
				showColumnFooter: true,
				enableGrouping: true,
				enableHorizontalScrollbar: true,
		};
		$scope.gridMessage1 = "No Inventory Data";


		$scope.gridOptions2 = {
				columnDefs: columnDefsFactory.translateColumnDefsDisplayName(columnDefs2),
				data: [],
				showColumnFooter: true,
				enableGrouping: true,
				enableHorizontalScrollbar: true,
		};
		$scope.gridMessage2 = "No Summary Data";
		$scope.showCurrency = reportsFactory.showCurrency;
		$scope.download = function(mode) {
			var header = reportsFactory.header($scope.dateFrom, $scope.dateTo);
			var fileName;
			fileName = 'inventory_report';
			var tables = [];
			tables.push({entries: $scope.gridOptions1.data, columns:$scope.gridOptions1.columnDefs, tableName:'Inventory Report' });
			tables.push({entries: $scope.gridOptions2.data, columns:$scope.gridOptions2.columnDefs, tableName:'Summary Report' });
			ExportFactory.exportTables(mode, tables, header, {layout:'l', showCurrency: $scope.showCurrency.value},  null );
		};
	}
};

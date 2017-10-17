export class VoucherReportController {
	constructor(reportsFactory, $scope, $timeout, columnDefsFactory, ExportFactory, $rootScope) {
		'ngInject';

		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'voucher_report');

		/*
  $scope.dataCallback =  function(res) {
    return res.data.entries;
  }*/

		var columnDefs = [
		                  columnDefsFactory.standardField("store_title"),
		                  columnDefsFactory.standardField("voucher_bcid"),
		                  columnDefsFactory.standardField("voucher_name"),
		                  columnDefsFactory.datetimeField("voucher_created_at"),
		                  columnDefsFactory.standardField("voucher_number"),
		                  columnDefsFactory.currencyField("face_value"),
		                  columnDefsFactory.currencyField("true_value"),
		                  columnDefsFactory.datetimeField("expired_at"),
		                  columnDefsFactory.datetimeField("sold_at"),
		                  columnDefsFactory.standardField("sold_by"),

		                  columnDefsFactory.standardField("sold_at_order_number"),
		                  columnDefsFactory.standardField("sold_at_order_reference_number"),
		                  columnDefsFactory.standardField("customer_name"),
		                  columnDefsFactory.datetimeField("redeemed_at"),
		                  columnDefsFactory.standardField("redeemed_at_order_number"),
		                  columnDefsFactory.standardField("redeemed_at_reference_number"),
		                  columnDefsFactory.standardField("sold_at_store"),
		                  columnDefsFactory.standardField("redeemed_at_store"),
		                  columnDefsFactory.standardField("status")


		                  ];
		$scope.page = 1;
		$scope.per_page = 1000000;
		$scope.gridOptions = {
				columnDefs: columnDefsFactory.translateColumnDefsDisplayName(columnDefs),
				enableGrouping: true
		};
		var updateData = function () {
			$scope.gridMessage = "loading data...";
			reportsFactory.reportApi('voucher_report', null, null, {page:$scope.page,per_page:$scope.per_page}, false).success(function (res) {
				$scope.gridOptions.data = res.data.entries;
			});
		};

		$scope.updateData = updateData;
		$scope.showCurrency = reportsFactory.showCurrency;
		$scope.download = function (mode) {
			var header = reportsFactory.header();
			var fileName;
			fileName = 'voucher_report_p'+$scope.page;
			var tables = [];
			tables.push({entries: $scope.gridOptions.data, columns:$scope.gridOptions.columnDefs, tableName:'Voucher Report' });
			ExportFactory.exportTables(mode, tables, header, {layout:'l', showCurrency: reportsFactory.showCurrency.value},  null);
		};

		$rootScope.title = 'Voucher';

		$scope.prev = function (){
			if ($scope.page > 1) {
				$scope.page--;
				$scope.updateData();
			}
		};

		$scope.next = function (){
			$scope.page ++;
			$scope.updateData();
		};



		$timeout(function () {
			$scope.updateData();
		}, 10);

		$scope.groupOptions = {
				voucher_created_at:{
					dateLabel: 'Creation Date',
					timeLabel: 'Creation Time',
					group: false,
					aggregate: false
				},
				expired_at:{
					dateLabel: 'Expiration Date',
					timeLabel: 'Expiration Time',
					group: false,
					aggregate: false
				},
				sold_at:{
					dateLabel: 'Selling Date',
					timeLabel: 'Selling Time',
					group: false,
					aggregate: false
				}
		};
	}
}

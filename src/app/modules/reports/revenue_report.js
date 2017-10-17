export class RevenueReportController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants, ExportFactory, columnDefsFactory) {
		'ngInject';

		var sum = uiGridConstants.aggregationTypes.sum;

		const defaultColumnDefs = [
		                           { field: "range", width: '200', displayName: 'Meal Period'},
		                           { field: "pax", width: 200, displayName: 'Cover'},
		                           { field: "order_count", width: '200'},
		                           { field: "service_charge", width: 200, cellFilter: 'myCurrencyReport', type: 'number'},
		                           { field: "total_tax", width: 200, cellFilter: 'myCurrencyReport', type: 'number'},
		                           { field: "total_tips", width: 200, cellFilter: 'myCurrencyReport', type: 'number'},
		                           { field: "gross_sales", width: 200, cellFilter: 'myCurrencyReport', type: 'number'},
		                           { field: "rounding_amount", width: 200, cellFilter: 'myCurrencyReport', type: 'number'},
		                           { field: "charge_amount", width: 200, cellFilter: 'myCurrencyReport', type: 'number', displayName: 'Add Charge'},
		                           { field: "discount_amount", width: 200, cellFilter: 'myCurrencyReport', type: 'number'},
		                           { field: "refund_amount", width: 200, cellFilter: 'myCurrencyReport', type: 'number'},
		                           { field: "store_credit", width: 200, cellFilter: 'myCurrencyReport', type: 'number'},
		                           ];

		var columnDefs = columnDefsFactory.translateColumnDefsDisplayName(defaultColumnDefs)

		$scope.dateFrom = moment().subtract(0, 'day').format('YYYY-MM-DD');
		$scope.dateTo = moment().format('YYYY-MM-DD');

		$scope.filterDateOptions = {
				dateFormat: 'yy-mm-dd',
				changeMonth: true,
				changeYear: true
		};

		$scope.gridOptions = {
				columnDefs: columnDefs,
				data: [],
				showColumnFooter: true,
				enableHorizontalScrollbar: true,
		};

		$scope.gridOptions2 = {
				columnDefs: [],
				data: [],
				showColumnFooter: true,
				enableHorizontalScrollbar: true,
		};


		$scope.update = function() {
			updateData();
		};

		$scope.showCurrency = reportsFactory.showCurrency;
		$scope.download = function(mode) {
			var header = reportsFactory.header($scope.dateFrom, $scope.dateTo);


			var fileName;
			fileName = 'revenue_report';
			fileName = fileName + ' ' + $scope.dateFrom + '-' + $scope.dateTo;

			var tables = [];
			tables.push({entries: $scope.gridOptions.data, columns:$scope.gridOptions.columnDefs, tableName:'Sales By Time Segment' });
			tables.push({entries: $scope.gridOptions2.data, columns:$scope.gridOptions2.columnDefs, tableName:'Transaction Summary Report'});

			ExportFactory.exportTables(mode, tables, header, {layout:'l', showCurrency: reportsFactory.showCurrency.value},  fileName );
		};

		var depNaming = function( name, index ){
			return 'Dept_'+index;
		};

		var updateData = function() {
			$scope.gridMessage = "loading data...";
			$scope.gridMessage2 = "loading data...";

			reportsFactory.analyticsApi('sales_by_time_segment', $scope.dateFrom,  $scope.dateTo).success(function(res) {
				var deparmentColumns = _.map(res[0].departments, function(dept, index){


					var depname = depNaming ( dept.name, index );

					return {
						field: depname,
						displayName: dept.name,
						width: 200,
						cellFilter: 'myCurrencyReport'
					};
				});

				columnDefs = defaultColumnDefs.slice(0,3).concat(deparmentColumns, defaultColumnDefs.slice(3))
				$scope.gridOptions.columnDefs = columnDefs

				$scope.gridOptions.data = dataCallback(res);
				$scope.gridMessage = $scope.gridOptions.data.length < 1 ? "No result" : "";
			});

			reportsFactory.reportApi('transaction_summary_report', $scope.dateFrom,  $scope.dateTo).success(function(res) {

				var columnDefs =
					_.map(res.data.schema, function(row) {
						return {
							field: row.key,
							displayName: row.name,
              headerCellFilter: "translate",
							cellFilter: reportsFactory.schemaTypeFilter(row),
							width: 200
						};
					});

				$scope.gridOptions2.columnDefs = columnDefs

				$scope.gridOptions2.data = dataCallback2(res);
				$scope.gridMessage2 = $scope.gridOptions2.data.length < 1 ? "No result" : "";
			});


		};

		// inital
		updateData($scope.dateFrom, $scope.dateTo);

		function dataCallback(res) {
			_.forEach(res, function(row){
				_.forEach(row.departments, function(dept, index) {
					var depname = depNaming ( dept.name, index );

					row[depname] = dept.total;
				});
			});
			return res;
		}

		function dataCallback2(res) {
			return res.data.entries
		}

	}
};




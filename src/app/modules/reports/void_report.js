export class VoidReportController {
	constructor($scope, $rootScope, reportsFactory, columnDefsFactory) {
		'ngInject';


		var columnDefs = [

		                  columnDefsFactory.dateField("voided_time","Date"),
		                  columnDefsFactory.timeField("voided_time","Time"),
		                  columnDefsFactory.numberGroupField("order_number"),
		                  columnDefsFactory.numberGroupField("reference_number"),
		                  columnDefsFactory.standardGroupField("cashier"),
		                  columnDefsFactory.standardGroupField("voided_by"),
		                  columnDefsFactory.standardGroupField("table_number"),
		                  columnDefsFactory.standardGroupField("voided_item"),
		                  columnDefsFactory.standardAggregateField("quantity"),
		                  columnDefsFactory.currencyAggregateField("price"),
		                  columnDefsFactory.standardGroupField("reason")

		                  ];

		$scope.gridOptions = {
				enableGrouping: true
		};

		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'void_line_item_report')


	}
};

export class SalesPerformanceSummaryReportController {
	constructor(suppliers, categories, brands, departments, $scope, $rootScope, reportsFactory, uiGridConstants, columnDefsFactory) {
		'ngInject';


		var columnDefs = [
		                  columnDefsFactory.datetimeField("date_from"),
		                  columnDefsFactory.datetimeField("date_to"),
		                  columnDefsFactory.standardGroupField("sales_person"),
		                  columnDefsFactory.numberAggregateField("number_of_orders"),
		                  columnDefsFactory.numberAggregateField("items_sold"),
		                  columnDefsFactory.currencyAggregateField("total_amount"),
		                  columnDefsFactory.currencyAggregateField("discount_amount"),
		                  columnDefsFactory.currencyAggregateField("total_tax"),
		                  columnDefsFactory.currencyAggregateField("final_sales_total")
		                  ];


		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs);
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'sales_performance_summary_report');

	}
}

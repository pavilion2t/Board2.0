export class SalesPerformanceReportController {
	constructor($scope, $rootScope, reportsFactory, columnDefsFactory) {
		'ngInject';


		var columnDefs = [
		                  columnDefsFactory.dateField("date","Date"),
		                  columnDefsFactory.timeField("date","Time"),
		                  columnDefsFactory.standardField("order_number"),
		                  columnDefsFactory.standardGroupField("cashier.name","Cashier Name"),
		                  columnDefsFactory.standardField("product_name"),
		                  columnDefsFactory.standardAggregateField("qty"),

		                  columnDefsFactory.currencyAggregateField("cost"),
		                  columnDefsFactory.currencyAggregateField("price"),
		                  columnDefsFactory.currencyAggregateField("discounts"),
		                  columnDefsFactory.currencyAggregateField("total_collected"),
		                  columnDefsFactory.currencyAggregateField("tax"),
		                  columnDefsFactory.standardGroupField("payment_method"),
		                  columnDefsFactory.standardGroupField("sales_type")
		                  ];

		$scope.gridOptions = {
				enableGrouping: true
		};
		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'product_sales_breakdown_sheet')

	}
};

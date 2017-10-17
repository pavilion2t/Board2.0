export class MenuSalesReportController {
	constructor(MenuFactory, reportsFactory, $scope, columnDefsFactory) {
		'ngInject';
		var columnDefs = [
		                  columnDefsFactory.dateField("date","Date"),
		                  columnDefsFactory.timeField("date","Time"),
		                  columnDefsFactory.standardGroupField("favorite_tab_name","Menu"),
		                  columnDefsFactory.standardGroupField("product_name","Item"),
		                  columnDefsFactory.standardGroupField("top_parent_department.name","Department"),
		                  columnDefsFactory.numberAggregateField("qty","Quantity"),
		                  columnDefsFactory.currencyAggregateField("price"),
		                  columnDefsFactory.currencyAggregateField("discounts"),
		                  columnDefsFactory.currencyAggregateField("tax"),
		                  columnDefsFactory.currencyAggregateField("final_price")

		                  ];

		$scope.gridOptions = {
				enableGrouping: true
		};

		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'product_sales_breakdown_sheet')

	}
};

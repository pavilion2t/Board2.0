export class ProductSoldReportController {
	constructor(suppliers, categories, brands, departments, $scope, $rootScope, reportsFactory, columnDefsFactory) {
		'ngInject';

		var columnDefs = [
		                  columnDefsFactory.standardField("gtid"),
		                  columnDefsFactory.standardField("listing_barcode","2nd Barcode"),
		                  columnDefsFactory.standardGroupField("name","Product name"),
		                  columnDefsFactory.standardGroupField("department.name","Department"),
		                  columnDefsFactory.standardGroupField("brand.name","Brand"),
		                  columnDefsFactory.standardGroupField("category.name","Category"),
		                  columnDefsFactory.standardGroupField("supplier.name","Supplier"),
		                  columnDefsFactory.currencyField("price","Price"),
		                  columnDefsFactory.numberAggregateField("quantity","Quantity sold"),
		                  columnDefsFactory.currencyField("cost","Cost"),
		                  columnDefsFactory.currencyAggregateField("total","Total"),
		                  columnDefsFactory.currencyAggregateField("total_cost", "Total Cost"),
		                  columnDefsFactory.currencyField("unit_profit","Unit Profit"),
		                  columnDefsFactory.currencyAggregateField("total_profit", "Total Profit")
		                  ];


		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
		$scope.gridOptions = {
				enableGrouping: true
		}
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'product_sales_sheet')

	}
};

export class DiscountAppliedReportController {
	constructor($scope, $rootScope, reportsFactory, columnDefsFactory) {
		'ngInject';


		var columnDefs = [
		                  columnDefsFactory.standardField("date"),
		                  columnDefsFactory.currencyAggregateField("amount", "Discount Amount"),
		                  columnDefsFactory.standardGroupField("discount_name", "Discount Name"),
		                  columnDefsFactory.currencyAggregateField("discount_amount", "Flat Discount"),
		                  columnDefsFactory.percentageField("discount_percentage", "Percent Discount")
		                  ];
		$scope.gridOptions = {
				enableGrouping: true
		};
		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'discount_applied_report')

		$scope.filter = { group_by: 'date' };
	}
};

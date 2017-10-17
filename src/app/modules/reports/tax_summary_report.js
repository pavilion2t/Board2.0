export class TaxSummaryReportController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants, columnDefsFactory) {
		'ngInject';


		var sum = uiGridConstants.aggregationTypes.sum

		var columnDefs = [
		                  {field: "date", width: '20%'},
		                  {field: "tax_name", width: '20%'},
		                  {field: "tax_rate", width: '20%', cellFilter:'percentage'},
		                  {field: "total_sales", width: '20%', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "tax_collected", width: '20%', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},

		                  ];
		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'tax_summary')

	}
};

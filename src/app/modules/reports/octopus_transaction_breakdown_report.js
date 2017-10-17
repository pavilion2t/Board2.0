export class OctopusTransactionBreakdownReportController {
	constructor(CommonFactory, $scope, $rootScope, reportsFactory, uiGridConstants, columnDefsFactory) {
		'ngInject';



		var columnDefs = [
		                  {field: "reader_number", width: '20%'},
		                  {field: "card_number", width: '20%'},
		                  {field: "remaining_value", width: '200', cellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "last_add_type", width: '200'},
		                  {field: "last_add_date", width: '200'},
		                  {field: "order_number", width: '100'},
		                  {field: "transaction_type", width: '100'},
		                  {field: "transaction_time", width: '100'},
		                  {field: "value", width: '100', cellFilter: 'myCurrencyReport', type: 'number'},
		                  ];
		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'octopus_transaction_breakdown_sheet')

	}
};

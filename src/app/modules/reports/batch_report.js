export class BatchReportController {
  constructor($scope, $rootScope, reportsFactory, uiGridConstants, columnDefsFactory) {
	  'ngInject';

	  var columnDefs = [
	    {field: "id", width: '200', displayName: 'Batch ID'},
	    {field: "batch_time", width: '200', cellFilter: 'moment'},
	    {field: "net_amount", width: '200', displayName: 'Total Amount', cellFilter: 'myCurrencyReport', type: 'number'},
	    {field: "fee", width: '200', cellFilter: 'myCurrencyReport', type: 'number'},
	    {field: "batch_amount", width: '200', cellFilter: 'myCurrencyReport', type: 'number'},
	    {field: "credit_card_types", width: '200', displayName: 'Payment'},
	  ];
	
	  $scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
	  $scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'batch_report')
  }
};

export class DailyEarningReportController {
  constructor($scope, $rootScope, reportsFactory, columnDefsFactory) {
	  'ngInject';


	var columnDefs = [
    {field: "date", width: '200', displayName: 'Record date'},
    {field: "count", width: '200', type: 'number'},
    {field: "product_total", width: '200', cellFilter: 'myCurrencyReport', type: 'number'},
    {field: "delivery", width: '200', cellFilter: 'myCurrencyReport', type: 'number'},
    {field: "tax", width: '200', cellFilter: 'myCurrencyReport', type: 'number'},
    {field: "total", width: '200', cellFilter: 'myCurrencyReport', type: 'number'},
    {field: "cogs", width: '200', cellFilter: 'myCurrencyReport', type: 'number'},
    {field: "fee", width: '200', displayName: 'Credit Card Processing Fees',  cellFilter: 'myCurrencyReport', type: 'number'},
    {field: "earning", width: '200', displayName: 'Profit', cellFilter: 'myCurrencyReport', type: 'number'},
    {field: "margin", cellFilter: 'percentage', width: '400'},
	];

  $scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
  $scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'daily_transaction_breakdown_sheet')

  }
};

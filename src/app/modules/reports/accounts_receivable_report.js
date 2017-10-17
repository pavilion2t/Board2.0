export class AccountsReceivableReportController {
  constructor($scope, $rootScope, reportsFactory, uiGridConstants, columnDefsFactory) {
    'ngInject';
	  var sum = uiGridConstants.aggregationTypes.sum;
	
	  var columnDefs = [
	    {field: "customer.name", width: '100', displayName: 'Customer'},
	    {field: "number", width: '300', displayName: 'Invoice #'},
	    {field: "reference_number", width: '120', displayname: 'Reference #'},
	    {field: "invoice_date", width: '100'},
	    {field: "total_amount", width: '120', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
	    {field: "amount_paid", width: '120', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
	    {field: "age", width: '120', displayName: 'Age(days)', type: 'number'},
	    {field: "amount_current_due", width: '120', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
	    {field: "amount_due_31_to_60_days", width: '120', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', displayName: '31 to 60 days', type: 'number'},
	    {field: "amount_due_61_to_90_days", width: '120', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', displayName: '61 to 90 days', type: 'number'},
	    {field: "amount_due_91_to_120_days", width: '120', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', displayName: '91 to 120 days', type: 'number'},
	    {field: "amount_due_121_or_more_days", width: '120', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', displayName: '121+ days', type: 'number'},
	  ];
	  $scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
	  $scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'account_receivable_aging_report')
  }
};

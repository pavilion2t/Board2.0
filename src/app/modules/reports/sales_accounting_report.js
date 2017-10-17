export class SalesAccountingReportController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants) {
		'ngInject';

		var sum = uiGridConstants.aggregationTypes.sum;

		var columnDefs = [
		                  {field: "date", width: '200'},
		                  {field: "net_taxable_sales", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "net_sales_tax_collected", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "net_non_taxable_sales", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "delivery_fees", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "gif_cards_and_store_credit_sold", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "tips_received", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "total_credits", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "visa", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "mc", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "discover", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "amex", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "jcb", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "cc_total", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "cash_received", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "check_received", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "gif_cards_and_store_credit_tendered", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "cogs", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "cogs_partial_refunds", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "cogs_full_refunds", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "product_refunds", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "tax_refunds", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "total_debits", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "delivery_refunds", width: '180', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},

		                  ];

		$scope.columnDefs = columnDefs
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'sales_accounting_report')
		$scope.dataCallback = function(res) {
			return _.map(res, function(value, key) {
				value.date = key;
				return value;
			});
		}
	}
};

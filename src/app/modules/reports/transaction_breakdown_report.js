export class TransactionBreakdownReportController {
	constructor($scope, $rootScope, reportsFactory, $timeout, $filter, columnDefsFactory) {
		'ngInject';

		var columnDefs = [
		                  columnDefsFactory.standardGroupField("store_title"),
		                  columnDefsFactory.dateField("transaction_date", "Date"),
		                  columnDefsFactory.timeField("transaction_date", "Time"),
		                  columnDefsFactory.standardGroupField("payment_method"),
		                  columnDefsFactory.standardGroupField("cashier"),
		                  columnDefsFactory.currencyAggregateField("amount_before_tips"),
		                  columnDefsFactory.currencyAggregateField("tips_amount"),
                          columnDefsFactory.currencyAggregateField("amount"),
                          columnDefsFactory.datetimeField("voided_at"),
		                  columnDefsFactory.currencyAggregateField("fee"),
		                  columnDefsFactory.standardField("card_present", "Card Present"),
		                  columnDefsFactory.numberGroupField("order_number"),
		                  columnDefsFactory.numberGroupField("reference_number"),



		                  columnDefsFactory.standardField("batch_id", "Batch ID") ,
		                  columnDefsFactory.currencyAggregateField("tax_amount"),
		                  {field: "note", width: '180',cellFilter: 'noteFilter'},
		                  columnDefsFactory.numberAggregateField("cover")
		                  ];


		$scope.columnDefs = columnDefs;
		$scope.gridOptions = {
				enableGrouping: true
		};
		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'transaction_breakdown_report');

		$scope.dataCallback = function (res) {
			var dataSet = res.data.transaction_break_down_entries;

			// Sort Payment Method
			dataSet.sort(function (a,b){
				if (a.payment_method < b.payment_method){
					return -1;
				}
				if (a.payment_method > b.payment_method){
					return 1;
				}
				return 0;
			});
			return dataSet;
		};
	}
}

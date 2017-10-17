export class SalesSummaryReportByDaysController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants, columnDefsFactory) {
		'ngInject';


		$scope.columnDefsFactory = columnDefsFactory
		var columnDefs = [
		                  columnDefsFactory.dateField("date","Date"),
		                  columnDefsFactory.timeField("date","Time"),
		                  columnDefsFactory.currencyAggregateField("total_gross_sales"),
		                  columnDefsFactory.currencyAggregateField("discount_applied"),
		                  columnDefsFactory.currencyAggregateField("total_refunds"),
		                  columnDefsFactory.currencyAggregateField("service_fee_in_total"),
		                  columnDefsFactory.currencyAggregateField("rounding_in_total"),
		                  columnDefsFactory.currencyAggregateField("net_sales"),
		                  columnDefsFactory.currencyAggregateField("net_non_taxable_sales"),
		                  columnDefsFactory.currencyAggregateField("net_taxable_sales"),
		                  columnDefsFactory.currencyAggregateField("tax_total"),
		                  columnDefsFactory.currencyAggregateField("gift_card_and_store_credit_purchased"),
		                  columnDefsFactory.currencyAggregateField("net_tips"),
		                  columnDefsFactory.currencyAggregateField("net_cogs"),
		                  columnDefsFactory.currencyAggregateField("net_payment")
		                  ];


		$scope.gridOptions = {
				enableGrouping: true
		};
		$scope.columnDefs = [];
		angular.copy(columnDefsFactory.translateColumnDefsDisplayName(columnDefs), $scope.columnDefs);
		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'sales_summary_report_by_days')
		$scope.dataCallback =  function(res) {
			var entries = res.data.entries;
			var schema = res.data.schema;
			$scope.columnDefs.length = 0;
			$scope.columnDefs.push.apply($scope.columnDefs, columnDefs);
			$scope.columnDefsFactory.flattenData(entries, 'net_payment_by_tender');
			var rows = columnDefsFactory.translateColumnDefsDisplayName($scope.columnDefsFactory.getFlattenColumnHeader(schema, 'net_payment_by_tender','Payment', 'currency'));
			$scope.columnDefs.push.apply($scope.columnDefs, rows);
			return entries;
		}
	}
};

export class RefundReportController {
	constructor($scope, $rootScope, reportsFactory, columnDefsFactory) {
		'ngInject';

		var columnDefs = [

		                  columnDefsFactory.datetimeField("refund_created_at"),
		                  columnDefsFactory.datetimeField("order_created_at"),
		                  columnDefsFactory.numberGroupField("reference_number"),
		                  columnDefsFactory.standardGroupField("order_number"),
		                  columnDefsFactory.standardGroupField("product_name"),
		                  columnDefsFactory.numberAggregateField("refund_quantity"),
		                  columnDefsFactory.currencyAggregateField("amount_refunded"),
		                  columnDefsFactory.standardGroupField("refund_method"),
		                  columnDefsFactory.standardGroupField("refund_reason"),
		                  columnDefsFactory.standardGroupField("issuer.display_name")
		                  ];


		$scope.columnDefs = columnDefs
		$scope.gridOptions = {
				enableGrouping: true
		};

		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'refund_breakdown')
		$scope.dataCallback = function(res) {
			return _.map(res, function(value, key) {
				value.date = key;
				return value;
			});
		}
	}
};

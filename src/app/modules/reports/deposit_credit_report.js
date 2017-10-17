export class DepositCreditReportController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants, columnDefsFactory) {
		'ngInject';

		$scope.columnDefsFactory = columnDefsFactory;
		var columnDefs = [
		                  columnDefsFactory.datetimeField("expired_at","Effective Date"),
		                  columnDefsFactory.standardGroupField("label","Title"),
		                  columnDefsFactory.datetimeField("activated_at","Deposit Date"),
		                  columnDefsFactory.standardGroupField("customer_name","Customer"),
		                  columnDefsFactory.standardGroupField("order_number"),
		                  columnDefsFactory.standardGroupField("reference_number"),
		                  columnDefsFactory.currencyAggregateField("amount","Deposit amount"),
		                  columnDefsFactory.datetimeField("redeemed_at","Redemption Date"),
		                  columnDefsFactory.standardGroupField("redeemed_order_number"),
		                  columnDefsFactory.standardGroupField("redeemed_reference_number"),
		                  columnDefsFactory.currencyAggregateField("redeemed_charge_amount","Add Charge"),
		                  columnDefsFactory.currencyAggregateField("redeemed_service_fee_amount","Service charge"),
		                  columnDefsFactory.currencyAggregateField("redeemed_discount_amount","Discount"),
		                  columnDefsFactory.currencyAggregateField("redeemed_total_amount","Total (before tips)")
		                  ];

		$scope.columnDefs = [];
		angular.copy(columnDefsFactory.translateColumnDefsDisplayName(columnDefs), $scope.columnDefs);
		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'deposit_credit_report')
		$scope.dataCallback =  function(res) {
			var entries = res.data.entries;
			var schema = res.data.schema;
			$scope.columnDefs.length = 0;
			$scope.columnDefs.push.apply($scope.columnDefs, columnDefs);
			$scope.columnDefsFactory.flattenData(entries, 'redeemed_departments');
			var rows = $scope.columnDefsFactory.getFlattenColumnHeader(schema, 'redeemed_departments','Department', 'currency');
			$scope.columnDefs.push.apply($scope.columnDefs, rows);
			return entries;

		}
	}
};
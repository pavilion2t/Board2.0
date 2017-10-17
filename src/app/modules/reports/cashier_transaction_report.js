export class CashierTransactionReportController {
  constructor($scope, $rootScope, reportsFactory, columnDefsFactory) {
    'ngInject';

    $scope.flattenColumn = (entries, schema, columnDefs, fieldName, displayName, type, idx) => {
			$scope.columnDefsFactory.flattenData(entries, fieldName, schema);
			const rows = $scope.columnDefsFactory.getFlattenColumnHeader(schema, fieldName, displayName, type);
      columnDefs.splice(idx != null ? idx : columnDefs.length, 0, ...rows);
    };

    $scope.columnDefsFactory = columnDefsFactory;

    const columnDefs = [
       columnDefsFactory.getColumnDefs('cashier', 'Cashier Name', null, true, 'uniq'),
       columnDefsFactory.getColumnDefs('terminal', 'Terminal', null, true, 'uniq'),
       columnDefsFactory.getColumnDefs('date', 'Business Date', 'momentDate', true, 'uniq'),
       columnDefsFactory.currencyAggregateField('cash'),
       columnDefsFactory.currencyAggregateField('store_credit'),
       columnDefsFactory.currencyAggregateField('store_check', 'Check'),
       columnDefsFactory.currencyAggregateField('store_octopus', 'Octopus'),
       columnDefsFactory.currencyAggregateField('store_reward', 'Reward'),
       columnDefsFactory.currencyAggregateField('tips_amount'),
       columnDefsFactory.currencyAggregateField('amount_before_tips'),
       columnDefsFactory.currencyAggregateField('amount'),
    ];

    $scope.gridOptions = {
      enableGrouping: true,
      showColumnFooter: true,
      enableHorizontalScrollbar: true,
    };

		$scope.columnDefs = columnDefs.slice();
		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'cashier_transaction_report');
		$scope.dataCallback = function (res) {
			const entries = res.data.entries;
			const schema = res.data.schema;
      $scope.columnDefs.length = 0;
			$scope.columnDefs.push.apply($scope.columnDefs, columnDefs);
      $scope.flattenColumn(entries, schema, $scope.columnDefs, 'other_pay', '', 'currency', 7);
			return entries;
		};
  }
}


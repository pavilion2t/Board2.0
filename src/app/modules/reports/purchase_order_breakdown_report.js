export class PurchaseOrderBreakdownReportController {
	constructor($scope, $rootScope, reportsFactory, columnDefsFactory) {
		'ngInject';

		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'purchase_order_breakdown_report')
		$scope.dataCallback =  function(res) {
			return res.data.entries
		}
	}
};

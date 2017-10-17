export class InventoryFlowReportController {
	constructor($scope, reportsFactory) {
		'ngInject';

		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'inventory_flow_report')
		$scope.dataCallback =  function(res) {
			return res.data.entries
		}
	}
};


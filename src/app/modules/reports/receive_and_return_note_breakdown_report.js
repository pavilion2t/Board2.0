export class ReceiveAndReturnNoteBreakdownReportController {
	constructor(CommonFactory, $scope, $rootScope, reportsFactory, columnDefsFactory) {
		'ngInject';

		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'receive_order_breakdown')
		$scope.dataCallback =  function(res) {
			return res.data.entries
		}
	}
};

export class ReservationAndDepositReportController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants) {
		'ngInject';

		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'reservation_and_deposit_report')
		$scope.dataCallback =  function(res) {
			return res.data.entries
		}
	}
};

export class ExpirationDateReportController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants) {
		'ngInject';
		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'expiration_date_report')
		$scope.dataCallback =  function(res) {
			return res.data.entries
		}
	}
};
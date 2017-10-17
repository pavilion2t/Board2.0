export class StockTakeSummaryReportController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants) {
		'ngInject';


		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'stock_take_summary_report')
		$scope.dataCallback = function(res) {
			return res.data.stock_take_summary_entries
		}
	}
};

export class StockTransferBreakdownReportController {
	constructor($scope, reportsFactory) {
		'ngInject';

		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'stock_transfer_breakdown_report')
		$scope.dataCallback =  function(res) {
			return res.data.entries
		}
	}
};

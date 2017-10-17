export class StockTakeBreakdownReportController {
	constructor($scope, reportsFactory) {
		'ngInject';


		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'stock_take_breakdown_report')
		$scope.dataCallback =  function(res) {
			return res.data.entries
		}
	}
};

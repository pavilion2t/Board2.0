export class SalesBreakdownReportController {
	constructor($scope, reportsFactory, columnDefsFactory) {
		'ngInject';


		$scope.groupOptions = {
				user:{
					group: true,
					aggregate: false
				},
				table: {
					group: true,
					aggregate: false
				},
				status: {
					group: true,
					aggregate: false
				},
				customer: {
					group: true,
					aggregate: false
				},
				shipping_method: {
					group: true,
					aggregate: false
				},
				people: {
					group: false,
					aggregate: true
				},
				product_total: {
					group: false,
					aggregate: true
				},
				service_fee_total: {
					group: false,
					aggregate: true
				},
				discount: {
					group: false,
					aggregate: true
				},
				tips: {
					group: false,
					aggregate: true
				},
				tax: {
					group: false,
					aggregate: true
				},
				total: {
					group: false,
					aggregate: true
				},
				rounding: {
					group: false,
					aggregate: true
				},
				completed_at:{
					dateLabel: 'Completed Date',
					timeLabel: 'Completed Time',
					group: false,
					aggregate: false
				},
				canceled_at:{
					dateLabel: 'Canceled Date',
					timeLabel: 'Canceled Time',
					group: false,
					aggregate: false
				},
				created_at:{
					dateLabel: 'Created Date',
					timeLabel: 'Created Time',
					group: false,
					aggregate: false
				}
		};

		$scope.gridOptions = {
				enableGrouping: true
		};

		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'sales_breakdown_report')
		$scope.dataCallback = function(res) {
			var dataSet = res.data.sales_breakdown_entries;

			// Sort Payment Method
			dataSet.sort(function(a,b){
				if (a.status < b.status){
					return -1;
				}
				if (a.status > b.status){
					return 1;
				}
				return 0;
			})
			return dataSet
		}
	}
};
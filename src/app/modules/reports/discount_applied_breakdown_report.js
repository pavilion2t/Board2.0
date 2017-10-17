export class DiscountAppliedBreakdownReportController {
	constructor($scope, reportsFactory) {
		'ngInject';

		$scope.groupOptions = {
				store_title:{
					group: true,
					aggregate: false
				},
				discount_name:{
					group: true,
					aggregate: false
				},
				added_by: {
					group: true,
					aggregate: false
				},
				date_time: {
					group: true,
					aggregate: false
				},
				time_segment: {
					group: true, 
					aggregate: false
				},

				order_number: {
					group: true,
					aggregate: false
				},

				order_state: {
					group: true,
					aggregate: false
				},
				order_payment: {
					group: true,
					aggregate: false
				},
				people: {
					group: false,
					aggregate: true
				},
        category: {
          group: true,
          aggregate: false,
        },
				num_of_transactions: {
					group: false,
					aggregate: true
				},
				revenue: {
					group: false,
					aggregate: true
				},
				net_revenue: {
					group: false,
					aggregate: true
				},
				departments: {
					group: false,
					aggregate: true
				},
				discount_amount: {
					group: false,
					aggregate: true
				}

		};

		$scope.columnStyle = {
				people: {
					cellClass: '_align-right',
					headerCellClass: '_align-right',
				},
				num_of_transactions: {
					cellClass: '_align-right',
					headerCellClass: '_align-right',

				},
				discount_amount: {
					cellClass: '_align-right',
					headerCellClass: '_align-right',
				}
		}

		$scope.gridOptions = {
				enableGrouping: true
		};
		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'discount_applied_breakdown_report')
		$scope.dataCallback =  function(res) {
			return res.data.entries
		}
	}
};
export class SalesByHourReportController {
	constructor($scope, reportsFactory, columnDefsFactory) {
		'ngInject';

		var columnDefs = [
		                  { field: "range", width: '200'},
		                  { field: "sit_in_count", displayName: 'Dine in count', width: 200, type: 'number'},
		                  { field: "sit_in_item_sold", displayName: 'Dine In Item sold ', width: 200, type: 'number'},
		                  { field: "sit_in_gross_sales", displayName: 'Dine In Gross Sales', width: 200, cellFilter: 'myCurrencyReport', type: 'number'},
		                  { field: "pax", width: 200, displayName: 'Cover', type: 'number'},
		                  { field: "avg_sit_in_gross_sales", displayName: 'Avg Per Cover', width: 200, type: 'number'},
		                  { field: "pick_up_count", width: 200, type: 'number'},
		                  { field: "pick_up_item_sold", width: 200, type: 'number'},
		                  { field: "pick_up_gross_sales", width: 200, type: 'number', cellFilter: 'myCurrencyReport'},
		                  { field: "avg_pick_up_gross_sales", displayName: 'Avg Check', width: 200, type: 'number'},
		                  { field: "delivery_count", width: 200, type: 'number'},
		                  { field: "delivery_item_sold", width: 200, type: 'number'},
		                  { field: "delivery_gross_sales", width: 200, type: 'number', cellFilter: 'myCurrencyReport'},
		                  { field: "avg_delivery_gross_sales", displayName: 'Avg Check', width: 200, type: 'number'},

		                  { field: "order_count", width: 200, type: 'number'},
		                  { field: "item_sold", width: 200, type: 'number'},
		                  { field: "gross_sales", width: 200, type: 'number', cellFilter: 'myCurrencyReport'},
		                  { field: "discount_amount", type: 'number', displayName: 'Total discount', width: 200, cellFilter: 'myCurrencyReport'},
		                  { field: "service_charge", type: 'number', displayName: 'Total service charge', width: 200, cellFilter: 'myCurrencyReport'},
		                  { field: "refund_amount", type: 'number', width: 150, cellFilter: 'myCurrencyReport'},
		                  { field: "rounding_amount", type: 'number', width: 150, cellFilter: 'myCurrencyReport'},
		                  { field: "net_sales", type: 'number', width: 200, cellFilter: 'myCurrencyReport'},
		                  { field: "total_tips", type: 'number', width: 200, cellFilter: 'myCurrencyReport'},
		                  { field: "avg_sales", type: 'number', displayName: 'Avg Total', width: 200, cellFilter: 'myCurrencyReport'}
		                  ];

		$scope.columnDefs = columnDefs;
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'sales_by_hourly');
		$scope.dataCallback = function (res) {
			return _.map(res, function (value, key) {
				value.date = key;
				value.total_count = value.sit_in_count + value.pick_up_count + value.delivery_count;
				value.total_item_sold = value.sit_in_item_sold + value.pick_up_item_sold + value.delivery_item_sold;
				value.total_gross_sales = value.sit_in_gross_sales + value.pick_up_gross_sales + value.delivery_gross_sales;
				return value;
			});

		};
	}
}

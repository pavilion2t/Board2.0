export class TableUsageReportController {
	constructor($scope, reportsFactory, columnDefsFactory) {
		'ngInject';



		var columnDefs = [

		                  columnDefsFactory.dateField("date"),
		                  columnDefsFactory.standardGroupField("table_id"),
                      columnDefsFactory.standardGroupField('room_name', 'Zone'),
		                  columnDefsFactory.standardGroupField("table_name"),
		                  columnDefsFactory.numberAggregateField("cover"),
		                  columnDefsFactory.numberField("table_turnover"),
		                  columnDefsFactory.timeDurationAggregateField("avg_duration"),
		                  columnDefsFactory.currencyAggregateField("gross_sales"),
		                  columnDefsFactory.currencyField("avg_gross_sales"),
		                  columnDefsFactory.currencyAggregateField("discount"),
		                  columnDefsFactory.currencyAggregateField("net_revenue"),
		                  columnDefsFactory.currencyAggregateField("service_charge"),
		                  columnDefsFactory.currencyAggregateField("add_charge"),
		                  columnDefsFactory.currencyAggregateField("total_revenue"),
		                  columnDefsFactory.currencyField("avg_total_revenue_per_order")
		                  ];




		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs);
		$scope.gridOptions = {
				enableGrouping: true
		};
		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'table_usage_report')
		$scope.dataCallback =  function(res) {
			return res.data.entries
		}
	}
};

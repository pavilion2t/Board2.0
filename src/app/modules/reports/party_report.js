export class PartyReportController {
	constructor(CommonFactory, $scope, $rootScope, reportsFactory, columnDefsFactory) {
		'ngInject';

		var columnDefs = [

		                  columnDefsFactory.dateField("started_at","Start Date"),
		                  columnDefsFactory.timeField("started_at","Start Time"),
		                  columnDefsFactory.dateField("closed_at","Close Date"),
		                  columnDefsFactory.timeField("closed_at","Close Time"),
		                  columnDefsFactory.standardGroupField("room_name","Zone"),
		                  columnDefsFactory.standardGroupField("table_name","Table Number"),
		                  columnDefsFactory.numberAggregateField("size", "Cover"),

		                  columnDefsFactory.currencyAggregateField("total_spent"),
		                  columnDefsFactory.standardField("type"),
		                  columnDefsFactory.standardField("server")
		                  ];

		$scope.gridOptions = {
				enableGrouping: true
		};
		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs);
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'party_report')
	}
};

export class TimeClockReportController {
	constructor(reportsFactory, $scope, columnDefsFactory) {
		'ngInject';


		var columnDefs = [
		                  {field: "clock_in_at", width: '220', displayName: 'Clock In Time', cellFilter: 'moment'},
		                  {field: "clock_out_at", width: '220', displayName: 'Clock Out Time',  cellFilter: 'moment'},
		                  {field: "total", width: '20%', displayName: 'Total time',  cellFilter: 'timeDurationHour'},
		                  {field: "adjustment_type", width: '100'},
		                  {field: "adjustment_note", width: '20%'},
		                  {field: "user.display_name", width: '10%', displayName: 'User'},
		                  {field: "added_by.display_name", width: '10%', displayName: 'Added by'},

		                  ];

		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'time_clocks')
		$scope.dataCallback = function(res) {
			return _.map(res, function(item) {return item.time_clock; })
		}
	}
};

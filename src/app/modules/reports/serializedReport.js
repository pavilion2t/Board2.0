export class SerializedReportController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants, DashboardFactory, columnDefsFactory) {
		'ngInject';


		var columnDefs = [
		                  {field: "product", width: '20%', displayName: 'Product Name'},
		                  {field: "number", width: '20%', displayName: 'Serial Number'},
		                  {field: "added_by", width: '20%'},
		                  {field: "added_at", width: '10%',cellFilter:'moment'},
		                  {field: "status", width: '10%'},
		                  {field: "order_number", width: '20%'},

		                  ];

		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'serialized_report')

	}
};

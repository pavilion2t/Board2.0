export class CourierPerformanceBreakdownReportController {
  constructor($scope, $rootScope, reportsFactory, uiGridConstants, $timeout, CommonFactory, ExportFactory, columnDefsFactory) {
	  'ngInject';
	  var sum = uiGridConstants.aggregationTypes.sum;
	  var count = uiGridConstants.aggregationTypes.count;
	
	  var _gridDataCache;
	
	  var columnDefs = [
	    {field: "date", width: '20%', cellFilter: 'moment',  aggregationType: count},
	    {field: "courier", width: '10%'},
	    {field: "delivered_at", cellFilter: 'moment', displayName: 'Courier Add Time', width: '20%'},
	    {field: "created_by", width: '10%'},
	    {field: "order_number", width: '20%', type: 'number'},
	    {field: "order_total", width: '20%', type: 'number', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport'},
	
	  ];
	
	  $scope.filterDateOptions = {
	    dateFormat: 'yy-mm-dd',
	    changeMonth: true,
	    changeYear: true
	  };
	  $scope.filter = {};
	  $scope.filter.searchColumn = '';
	
	  $scope.range = {
	    dateFrom: moment().subtract(1, 'week').format('YYYY-MM-DD'),
	    dateTo: moment().format('YYYY-MM-DD'),
	  };
	
	  $scope.gridOptions = {
	    columnDefs: columnDefsFactory.translateColumnDefsDisplayName(columnDefs),
	    data: [],
	    showColumnFooter: true,
	    enableHorizontalScrollbar: true,
	  };
	
	  $scope.update = function() {
	    updateData();
	  };
	
	  $scope.filterReport = function(filter) {
	    if(filter.search) {
	      $scope.gridOptions.data = _.filter(_gridDataCache, (item) => {
	        return item[$scope.filter.searchColumn] && item[$scope.filter.searchColumn].toLowerCase().search(filter.search.toLowerCase()) > -1;
	      });
	
	    } else {
	      $scope.gridOptions.data = _.clone(_gridDataCache);
	    }
	    updateGridMessage();
	  };
	
	  $scope.download = function(mode) {
	    var fileName = 'Report ' + $scope.range.dateFrom + ' - ' + $scope.range.dateTo;
	
	    var header = reportsFactory.header($scope.range.dateFrom, $scope.range.dateTo);
	    ExportFactory.exportTable( mode, columnDefs, $scope.gridOptions.data, header, fileName + '.' + mode);
	
	  };
	
	  var updateData = function() {
	    $scope.gridMessage = "loading data...";
	
	    reportsFactory.analyticsApi('courier_performance_breakdown_report', $scope.range.dateFrom,  $scope.range.dateTo).success(function(res) {
	      _gridDataCache = res;
	      $scope.gridOptions.data = res;
	      $scope.filterReport($scope.filter);
	      updateGridMessage()
	    });
	
	  };
	
	  var updateGridMessage = function() {
	    $scope.gridMessage = $scope.gridOptions.data.length < 1 ? "No result" : "";
	  };
	
	  // inital, timeout to wait directive
	  $timeout(() => {
	    updateData()
	  }, 10)
  }

};

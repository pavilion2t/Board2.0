export class DailyOrderAndItemClosingReportController {
  constructor($scope, $rootScope, reportsFactory, uiGridConstants, $state, ExportFactory) {
	  'ngInject';

  $scope.dateFrom = moment().subtract(0, 'day').format('YYYY-MM-DD');
	$scope.dateTo = moment().format('YYYY-MM-DD');

  $scope.filterDateOptions = {
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true
  };

	$scope.update = function() {
		updateData();
	};

	var updateData = function() {
		$scope.gridMessage = "loading data..."

    reportsFactory.reportApi('clot_daily_closing_report', $scope.dateFrom,  $scope.dateTo).success(function(res) {
      $scope.data = res.data;
      var data = res.data;
      var data0 = {invoice_entry: res.data.invoice_entry};
      $scope.summaryReportA = _.compact( _.map(data0, function(item, key) {
        if(_.isPlainObject(item)) {
          var newitem = {};
          newitem.title = key;
          /*
          if ( key === 'Open Orders' ){
            newitem.title =
          }*/
          for (var itemobjects in item) {
            newitem[itemobjects] = item[itemobjects];
          }
          return newitem;
        }
      }));

      // reports at right side
      $scope.summaryReportB = _.compact( _.map(data, function(item, key) {
        if(_.isArray(item)) {
          return {title: key, data: item};
        }
      }));
		});

	};
  $scope.showCurrency = reportsFactory.showCurrency;
  $scope.download = function(mode) {
    reportsFactory.showCurrency = $scope.showCurrency;
    var header = reportsFactory.header($scope.dateFrom, $scope.dateTo);
    var tableA = [reportsFactory.getReport({data:$scope.summaryReportA,title:'Summary'})];
    var tables = _.map($scope.summaryReportB, reportsFactory.getReport);
    tableA = tableA.concat(tables);
    var fileName = $state.params.report;

    fileName = fileName + ' ' + $scope.dateFrom + '-' + $scope.dateTo;

    ExportFactory.exportTables(mode, tableA, header, {layout:'p', showCurrency: $scope.showCurrency.value},  fileName );
  };

	// inital
	updateData($scope.dateFrom, $scope.dateTo);

  }
};


export function dailyOrderAndItemClosingReport(reportsFactory, $filter){
  return {
    scope: {
      schema: '=',
      entries: '=',
      title: '='
    },
    templateUrl: 'app/modules/reports/daily_order_and_item_closing_report_table.html',
    restrict: 'E',
    controller: function($scope, $element, $attrs) {
      $scope.applyFilter = function(input, schema) {
        var filter = reportsFactory.schemaTypeFilter(schema)
        if(!filter) {
          return input
        }

        var split = filter.split(':');
        var filterName = split[0]
        split[0] = input

        return $filter(filterName).apply(this, split)
      };

    },
  };
}

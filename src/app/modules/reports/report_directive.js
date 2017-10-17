export function gridReport (reportsFactory, ExportFactory, uiGridExporterConstants, columnDefsFactory, gettextCatalog) {
    'ngInject';
	return {
		restrict: 'E',
		scope: {
			title: '=',
			columnDefs: '=?',
			columnStyle: '=?',
			gridOptions: '=?',
			groupOptions: '=?',
			fetchData: '=',
			parseData: '=?',
			filter: '=?',
			advanceTimeFilter: '=?',
			disableTimeFilter: '=?'
		},
		templateUrl: 'app/modules/reports/_gridReport.html',
		controller: function($scope) {
            function mapArrayEntry(entries) {
                    // flatten array value
                    // from: { departments: [0, 760, 3900, 0] }
                    // to: {
                    //   departments_0: 0,
                    //   departments_1: 760,
                    //   departments_2: 3900,
                    //   departments_3: 0,
                    // }
                    return _.map(entries,  function(entry) {
                            _.forEach(entry, function(value, key) {
                                    if(_.isArray(value)){
                                            _.forEach(value, function(v, index) {
                                                    entry[key+'_'+index] = v
                                            });
                                            delete entry[key]
                                    }
                            });
                            return entry;
                    })
            }
			var columnDefs = $scope.columnDefs || [{field: "id", width: '200'}] // field id is a hack to gain header height at start
			var columnStyle = $scope.columnStyle || {}
			var fetch = $scope.fetchData
			var parseData = $scope.parseData
			var groupOptions = $scope.groupOptions
			$scope.range = {}
			if($scope.disableTimeFilter) {
				$scope.range.dateFrom = null
				$scope.range.dateTo = null
			} else {
				$scope.range.dateFrom = moment().subtract(0, 'day').format('YYYY-MM-DD');
				$scope.range.dateTo = moment().format('YYYY-MM-DD');
			}

			$scope.gridOptions = _.assign({
				columnDefs: columnDefs,
				data: [],
				showColumnFooter: true,
				enableGrouping: false,
				onRegisterApi: function( gridApi ) {
					$scope.gridApi = gridApi;
				}
			}, $scope.gridOptions);
			$scope.update = function(filter) {
				updateData(filter);
			};

      $scope.showCurrency = reportsFactory.showCurrency;

			$scope.download = function(mode) {
                var count = 0;
                var fileName;
                var tableData = [];
                var tableList = {};
                if ($scope.range.dateFrom && $scope.range.dateTo){
                    fileName = $scope.title + ' ' + $scope.range.dateFrom + ' - ' + $scope.range.dateTo;
                }
                else {
                    fileName = $scope.title;
                }
                var header = reportsFactory.header($scope.dateFrom, $scope.dateTo);
                var downloadOne = function(data, paginator) {
                    var formatedData = formatData(data);
                    count = count + 1;
                    var tables = [];
                    tableList[paginator.current_page-1] = formatedData.data;

                    if (count === paginator.total_pages) {
                        for (var i=0; i<paginator.total_pages; i++)
                            tableData = tableData.concat(tableList[i]);

                        tables.push({entries: tableData, columns:formatedData.columns});
                        ExportFactory.exportTables(mode, tables, header, {layout:'l', showCurrency: $scope.showCurrency.value},  fileName);
                    }
                }
                fetchData({page: 1, per_page: 1000}, function(data, paginator) {
                    if (paginator == undefined) {
                        paginator = {
                            page: 1,
                            total_pages: 1,
                            current_page: 1
                        }
                    }
                    downloadOne(data, paginator);
                    for (var i= paginator.current_page; i<paginator.total_pages; i++) {
                        fetchData({page: i+1, per_page: 1000}, downloadOne);
                    }
                });
			};

            var fetchData = function(myFilter, callBack) {
                var pagination;
                var tmpFilter = Object.assign({page: 1, per_page: 200}, $scope.filter, myFilter);
                fetch($scope.range.dateFrom,  $scope.range.dateTo, tmpFilter).success(function(data, status, headers) {
                    if(headers('Link')) {
                        pagination = JSON.parse(headers('Link'));
                    }
                    else {
                        // new report API where pagination in data
                        try {
                            pagination = data.data.paging;
                        } catch(e) {
                            console.log('e', e);
                            // do nothing, don't change columnDefs
                        }
                    }
                    callBack(data, pagination);
                });
            };

            function formatData(data) {
                var entries = parseData ? parseData(data, $scope) : data;
                entries = mapArrayEntry(entries);
                var columnDefs = $scope.columnDefs;
                if ( !columnDefs ){
                    // "schema" are in data
                    try {
                        columnDefs = parseSchema(data.data.schema, columnStyle, groupOptions);
                    } catch(e) {
                        console.log('e', e);
                    }
                }
                return {data: entries, columns: columnDefs};
            }

            function updateView(data, pagination) {
                //$scope.gridMessage = "loading data...";
                $scope.pagingReady = false;
                var formatedData = formatData(data);
                if (pagination){
                    $scope.pagination = pagination;
                    $scope.pagingReady = true;
                }
                $scope.gridOptions.data = formatedData.data;
                $scope.gridOptions.columnDefs = formatedData.columns;
                $scope.gridMessage = formatedData.data.length < 1 ? gettextCatalog.getString("No result") : "";
            }

            $scope.update = function(filter) {
                fetchData(filter, updateView);
            }
			// inital
            $scope.update();
		},
	}


	function parseSchema(schema, columnStyle, groupOptions) {
		return _.reduce(schema, function(acc, row){

			var group = false;
			var aggregate = false;
			var timeLabel = 'Time';
			var dateLabel = 'Date';

			if ( groupOptions ){
				var groupOption = groupOptions[row.key];
				if ( groupOption ){
					group = groupOption.group;
					aggregate = groupOption.aggregate;

					if ( groupOption.timeLabel ){
						timeLabel = groupOption.timeLabel;
					}
					if ( groupOption.dateLabel ){
						dateLabel = groupOption.dateLabel;
					}
				}
			}

      if(row.type === "hash") {
        row.headers.forEach( function(header, index) {
          var filter = columnDefsFactory.getFilter( {type:row.array_format} );
          var columnDef = columnDefsFactory.getColumnDefs( row.key+'.'+header, row.name+'-'+header, filter, group, aggregate );
          acc.push(_.assign(columnDef, columnStyle[row.key]));
        });
        return acc;
      }
      else if(row.type !== "array") {
				var filter = null;
				var columnDef;

				// Split datetime into 2 columns
				if ( row.type === 'datetime' ){
					columnDef = columnDefsFactory.getColumnDefs( row.key, dateLabel, 'momentDate', group, aggregate );
					acc.push(_.assign(columnDef, columnStyle[row.key]));

					columnDef = columnDefsFactory.getColumnDefs( row.key, timeLabel, 'momentTime', group, aggregate );
					acc.push(_.assign(columnDef, columnStyle[row.key]));

				}
				else {
					filter = columnDefsFactory.getFilter( row );
					columnDef = columnDefsFactory.getColumnDefs( row.key, row.name, filter, group, aggregate );
					acc.push(_.assign(columnDef, columnStyle[row.key]));
				}
				return acc;
			} else {
				row.headers.forEach( function(header, index) {
					var filter = columnDefsFactory.getFilter( {type:row.array_format} );
					var columnDef = columnDefsFactory.getColumnDefs( row.key+ '_' + index, header, filter, group, aggregate );
					acc.push(columnDef);
				});
				return acc;
			}
		}, [])
	}
}

export function reportTimeFilter () {
    'ngInject';
	return {
		restrict: 'E',
		scope: {
			start: '=',
			end: '=',
			advance: '=',
			range: '='
		},
		templateUrl: 'app/modules/reports/_reportTimeFilter.html',
		controller: function($scope) {
			$scope.hours      =  {
                '00:00': '00:00:00',
		        '01:00': '01:00:00',
		        '02:00': '02:00:00',
		        '03:00': '03:00:00',
		        '04:00': '04:00:00',
		        '05:00': '05:00:00',
		        '06:00': '06:00:00',
		        '07:00': '07:00:00',
		        '08:00': '08:00:00',
		        '09:00': '09:00:00',
		        '10:00': '10:00:00',
		        '11:00': '11:00:00',
		        '12:00': '12:00:00',
		        '13:00': '13:00:00',
		        '14:00': '14:00:00',
		        '15:00': '15:00:00',
		        '16:00': '16:00:00',
		        '17:00': '17:00:00',
		        '18:00': '18:00:00',
		        '19:00': '19:00:00',
		        '20:00': '20:00:00',
		        '21:00': '21:00:00',
		        '22:00': '22:00:00',
		        '23:00': '23:00:00'
            };

			$scope.showTime   = false;
			$scope._startTime = '00:00:00';
			$scope._endTime   = '23:59:00';

			$scope._start = $scope.range.dateFrom || moment().subtract(1, 'day').format('YYYY-MM-DD');
			$scope._end =   $scope.range.dateTo   || moment().format('YYYY-MM-DD');


			$scope.filterDateOptions = {
					dateFormat: 'yy-mm-dd',
					changeMonth: true,
					changeYear: true
			};

			$scope.toggleAdvanceFilter = function() {
				$scope.showTime = !$scope.showTime;

				if(!$scope.showTime) {
					resetTime()
				}
			};
			$scope.$watch('_start', _update);
			$scope.$watch('_startTime', _update);
			$scope.$watch('_end', _update);
			$scope.$watch('_endTime', _update);

			function _update()  {
				if($scope.showTime) {
					$scope.range.dateFrom = $scope._start + ' ' + $scope._startTime
					$scope.range.dateTo   = $scope._end + ' ' +  $scope._endTime

				} else {
					$scope.range.dateFrom = $scope._start
					$scope.range.dateTo = $scope._end
				}
			}

			function resetTime() {
				$scope._startTime = '00:00:00';
				$scope._endTime = '23:59:00';
			}
		}

	};
}

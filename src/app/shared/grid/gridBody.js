export function gridBody($rootScope, $http, $window, $compile, $location, $timeout, $state, $stateParams, AuthFactory, CommonFactory, DashboardFactory, ExportFactory, $filter) {
	'ngInject';

	return {
		restrict: 'E',
		scope: false,    // just use parent scope at the moment
		templateUrl: 'app/shared/grid/grid-body.html',
		controller: function ($scope, $element) {    // before compilation

			var stateParams = $stateParams;

			stateParams.page = stateParams.page || 1;
			stateParams.count = stateParams.count || 25;

			/* STATE NAME - for empty grid title */
			$scope.stateName = $state.current.name.split('.')[1];

			var header = function () {
				var store = DashboardFactory.getCurrentStore();
				var text = [];

				text.push(store.title);
				text.push(store.address1);

				if (store.address2 && store.address2 !== '') {
					text.push(store.address2);
				}
				text.push('' + store.city + ', ' + store.state + ' ' + store.zipcode + ' ' + store.country_code);
				text.push('');
				var title = '';
				if ($rootScope.title) {
					title = $rootScope.title.trim();
				}
				text.push(title);
				text.push('Export Date: ' + moment().format('YYYY-MM-DD'));

				return text;
			}

			if (!$scope.redirecting) {   // params present

				if (stateParams.count === 'all') {
					$scope.returnAll = true;
				} else {
					$scope.returnAll = false;
					$scope.rowCount = Number(stateParams.count);
					$scope.pageNumber = Number(stateParams.page);
				}

				$scope.dataView = new Slick.Data.DataView();

				// grid row special colors (vantiv_mid table)
				if ($scope.getItemMetadata) {
					$scope.dataView.getItemMetadata = $scope.getItemMetadata;
				}

				$scope.allData = [];

				var title = $scope.title || "";
				/* NEW ITEM NAME - DERIVE FROM PAGE TITLE */
				// fugly hack - hope all the spelling is right
				if (title.slice(-3) === 'ies') {
					$scope.newItemName = title.slice(0, -3) + 'y';
				} else if (title.slice(-2) === 'es' && ['les', 'ces', 'tes', 'ges', 'res', 'ses'].indexOf(title.slice(-3)) === -1) {
					$scope.newItemName = title.slice(0, -2);
				} else if (title.slice(-1) === 's') {
					$scope.newItemName = title.slice(0, -1);
				} else {
					$scope.newItemName = title;
				}

				/* IMPORTING / EXPORTING CSV FILES */
				$scope.toggleImport = function () {
					$scope.isImporting = !$scope.isImporting;
				};
				$scope.getSelectedItems = function () {
					var selected = _.map($scope.selectItems, function (item, i) {
						return item ? $scope.allData[i] : null;
					});
					return _.filter(selected, function (item, i) {
						return item;
					});
				};
				$scope.exportCsv = function () {
					$scope.fetchPage({
						export: true, callback: function () {
							var selectedItems = $scope.exportData;
							var usedColumns = $scope.exportColumns ? $scope.exportColumns : columns.slice(1, -2);
							ExportFactory.exportCsv(usedColumns, selectedItems, header());
						}
					});
				};

				$scope.exportPdf = function () {
					$scope.fetchPage({
						export: true, callback: function () {
							var selectedItems = $scope.exportData;
							var usedColumns = $scope.exportColumns ? $scope.exportColumns : columns.slice(1, -2);
							ExportFactory.exportPdf(usedColumns, selectedItems, header());
						}
					});

				};
				$scope.exportExcel = function () {
					$scope.fetchPage({
						export: true, callback: function () {
							var selectedItems = $scope.exportData;
							var usedColumns = $scope.exportColumns ? $scope.exportColumns : columns.slice(1, -2);
							ExportFactory.exportExcel(usedColumns, selectedItems, header());
						}
					});

				};


				/* COLUMNS init */
				var columns = $scope.columns;

				var totalWidth = $window.document.getElementsByClassName('grid')[0].offsetWidth - 82;
				_.each(columns, function (column) {
					column.width = Number(column.ratio.slice(0, -1)) / 100 * totalWidth;
					column.id = column.field;
					column.resizable = true;
					column.selectable = true;
				});


				/* ACTIONS init */
				$scope.selectItems = [];
				$scope.selectedItems = [];
				$scope.showActions = [];
				var itemSelectFormatter = function (row, cell, value, columnDef, dataContext) {
					// no ng-style as does not work well with Math.max
					var lineHeight = Math.max($scope.rowHeight, 45);
					var selectHTML = '<div class="item-select _compile" style="line-height: ' + lineHeight + 'px"><div class="input-checkbox"><input id="checkbox-' + row + '" type="checkbox" ng-model="selectItems[' + row + ']"><label for="checkbox-' + row + '"></label></div></div>';
					return selectHTML;
				};
				var actionsFormatter = function (row, cell, value, columnDef, dataContext) {
					var actionsHTML = '<div class="actions-buttons _compile" ng-show="showActions[' + row + ']"><button class="actions-button" ng-repeat="(i, action) in actions" ng-if="!action[2] || action[2](dataView.getItem(' + row + '))" ng-click="showActions[' + row + '] = false; action[1](dataView.getItem(' + row + '))">{{action[0]|translate}}</button></div>';
					$compile(actionsHTML)($scope);
					return actionsHTML;
				};
				var actionsToggleFormatter = function (row, cell, value, columnDef, dataContext) {
					var toggleHTML = '<div class="actions-toggle _compile" ng-click="showActions[' + row + '] = !showActions[' + row + '];"><i class="fa actions-arrow" ng-class="{\'fa-angle-left\': !showActions[' + row + '], \'fa-angle-right\': showActions[' + row + ']}"></i></div>';
					$compile(toggleHTML)($scope);
					return toggleHTML;
				};
				columns.unshift({ field: 'item-select', id: 'item-select', name: '', formatter: itemSelectFormatter, width: 40 });
				columns.push({ field: 'actions-toggle', id: 'actions-toggle', name: '', formatter: actionsToggleFormatter, width: 40 });
				columns.push({ field: 'actions-buttons', id: 'actions-buttons', name: '', formatter: actionsFormatter, minWidth: 0, width: 1 });
				$scope.createNewItem = function () {
					// dashboard has new convension
					if ($state.current.name.indexOf('dashboard') > -1) {
						$state.go('^.new');
					} else {
						$state.go($state.current.name + '_new');
					}
				};

				/* COMPILE FILTERS */
				if (!$scope.filterColumns) {
					$scope.filterColumns = [];
					for (var i = 1; i < $scope.columns.length - 2; i++) {
						$scope.filterColumns.push($scope.columns[i]);
					}
				}
				var cloneFilters = function (oldFilters) {
					var newFilters = _.map(oldFilters, function (filter) {
						return _.clone(filter);
					});
					// add default empty filters
					var _reducer = function (memo, filter) {
						return memo || (filter.column === $scope.filterColumns[i]);
					}

					if (!stateParams.filters) {
						for (var i = 0; i < $scope.filterColumns.length; i++) {
							if ($scope.filterColumns[i].defaultFilter) {
								if (!_.reduce(newFilters, _reducer, false)) {
									if ($scope.filterColumns[i].types && $scope.filterColumns[i].types.length === 1) {
										newFilters.push({ column: $scope.filterColumns[i], condition: $scope.filterColumns[i].types[0] });
									} else {
										newFilters.push({ column: $scope.filterColumns[i] });
									}
								}
							}
						}
					}
					return newFilters;
				};

				if (stateParams.filters) {
					var filters = _.map(stateParams.filters.split('____'), function (str, i) {
						var filterArray = str.split('__');
						var filter = filterArray[1] === 'between' ?
								{ condition: filterArray[1], from: filterArray[2], to: filterArray[3] } :
								{ condition: filterArray[1], value: filterArray[2] };
								// find appropriate column
								for (var k = 0; k < $scope.filterColumns.length; k++) {
									if (filterArray[0] === $scope.filterColumns[k].field) {
										filter.column = $scope.filterColumns[k];
										// hack for options
										if (filter.column.types && filter.column.types[0] === 'options' && filterArray[1] === 'equal') {
											filter.condition = 'options';
										}
										if (filter.column.unformatter) {
											if (filter.value) {
												filter.value = filter.column.unformatter(filter.value);
											}
											if (filter.from) {
												filter.from = filter.column.unformatter(filter.from);
											}
											if (filter.to) {
												filter.to = filter.column.unformatter(filter.to);
											}
										}
										break;
									}
								}
								return filter.column ? filter : null;
					});
					$scope.filters = _.filter(filters, function (filter, i) {
						return filter;
					});
				} else {
					$scope.filters = {};
				}
				$scope.newFilters = cloneFilters($scope.filters);
			}
		},

		link: function (scope, elem, attrs) {    // after compilation
			var stateParams = $stateParams;

			stateParams.page = stateParams.page || 1;
			stateParams.count = stateParams.count || 25;


			if (!scope.redirecting) {   // params present

				scope.rowHeight = scope.rowHeight || 40;
				// hack - scope.columns without slice() fucks up filtering
				var grid = new Slick.Grid($('.grid__body'), scope.dataView, scope.columns.slice(), {
					enableTextSelectionOnCells: true,
					headerRowHeight: 30,
					rowHeight: scope.rowHeight
				});

				scope.dataView.onRowCountChanged.subscribe(function (e, args) {
					grid.updateRowCount();
					grid.render();
				});
				var fixLastCellCSS = function (count) {
					$('.actions-buttons').closest('.slick-cell').css({ 'overflow': 'visible', 'z-index': 200, 'padding': 0 });
					$('.actions-buttons').css({ 'bottom': 'auto' });
				};
				var compileTimer;
				grid.onViewportChanged.subscribe(function (e, args) {
					clearTimeout(compileTimer);
					compileTimer = setTimeout(fixLastCellCSS, 200);
					scope.$apply(function () {
						scope.selectItems = scope.selectItems;
						scope.showActions = scope.showActions;
					});
					$('._compile').not('.ng-scope').each(function (i, el) {
						$compile(el)(scope);
					});
				});
				// reload action directives when data change
				scope.dataView.onRowsChanged.subscribe(function (e, args) {
					grid.invalidateRows(args.rows);
					grid.render();
					fixLastCellCSS();
				});

				var resizeTimer;
				var resizeGrid = function () {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(function () {
						var totalWidth = $window.document.getElementsByClassName('grid')[0].offsetWidth - 82;
						var columns = scope.columns;
						_.each(columns, function (column, i) {
							if (i > 0 && i < columns.length - 2) {
								column.width = Number(column.ratio.slice(0, -1)) / 100 * totalWidth;
							}
						});
						grid.resizeCanvas();
						grid.setColumns(columns);
						$('._compile').not('.ng-scope').each(function (i, el) {
							$compile(el)(scope);
						});
						clearTimeout(compileTimer);
						compileTimer = setTimeout(fixLastCellCSS, 200);
					}, 100);    // delay resize by 100ms to reduce load
				};
				$window.addEventListener('resize', resizeGrid);
				$rootScope.$on('$stateChangeStart', function (event, toState) {
					$window.removeEventListener('resize', resizeGrid);
				});

				scope.$watchCollection('allData', function (newValue, old) {
					scope.showActions = [];
					for (var i = 0; i < newValue.length; i++) {
						scope.showActions.push(false);
					}
					$('.grid__body').height(newValue.length * scope.rowHeight + 31);
					grid.resizeCanvas();
					scope.dataView.setItems(newValue);
					// horrible stuff
					$('._compile').not('.ng-scope').each(function (i, el) {
						$compile(el)(scope);
					});
				});
				// scope.$watch('returnAll', function(newValue, old) {
				//   if(newValue !== undefined) {
				//     if(newValue) {
				//       $state.go($state.current.name, { page: undefined, count: 'all'});
				//     } else {
				//       $state.go($state.current.name, {page: 1, count: 25});
				//     }
				//   }
				// });
				scope.$watchCollection('selectItems', function (newValue, old) {
					var selected = [];
					_.each(newValue, function (value, i) {
						if (value) {
							selected.push(scope.dataView.getItem(i));
						}
					});
					scope.selectedItems = selected;
				});
				scope.$watch('selectAllItems', function (newValue, old) {
					var length = scope.dataView.getLength();
					for (var i = 0; i < length; i++) {
						scope.selectItems[i] = newValue;
					}
				});
				// add select all items box
				var selectAllHTML = '<div class="item-select"><div class="input-checkbox"><input id="checkbox-all" type="checkbox" ng-model="selectAllItems"><label for="checkbox-all"></label></div></div>';
				var selectAllDirective = $compile(selectAllHTML)(scope);
				$($('.slick-header-column')[0]).append(selectAllDirective);

				/* FETCH DATA */
				var fetchPage = function (options, callback) {
					if (!options) {
						options = {};
						options.export = false;
					}

					scope.loadingGrid = true;

					var params = _.omit(stateParams, 'store_id', 'count', 'filters');

					if (stateParams.filters) {
						if (scope.filterType == 'gateway') {
							// [1] fiter format for gateway
							var filterParams = _.reduce(stateParams.filters.split('____'), function (result, filter, i) {
								// filter example. created_at__equal__2016-01-04
								var filterStrings = filter.split('__')

								if (filterStrings[1] === 'between') {
									// date between format 01/28/2016 - 01/29/2016
									result[filterStrings[0]] = filterStrings[2].replace(/-/g, '/') + ' - ' + filterStrings[3].replace(/-/g, '/')

									console.log('between', filterStrings);
								} else {
									result[filterStrings[0]] = filterStrings[2]
								}

								return result
							}, {});

							_.assign(params, filterParams)

						} else {
							// [2] fiter format for bindo

							var filtersArray = _.reduce(stateParams.filters.split('____'), function (memo, str) {
								memo.push(str);
								return memo
							}, []);
							params['filters[]'] = filtersArray
						}
					}

					if (scope.returnAll || options.export) {
						params.page = 1
						params.per_page = 9999999
					} else {
						params.per_page = stateParams.count

					}
					// special case of order
					if ($state.current.name === 'app.dashboard.suppliers' ||
							$state.current.name === 'app.dashboard.inventory.index') {
						params.order_by = 'name';

					} else if ($state.current.name === 'app.dashboard.discounts.index') {
						params.order_by = 'priority';
					}
					else {
						params.order_by = 'updated_at';
						params.order_asc = 'desc';
					}

					var addParam = function (params, defaultParams) {
						if (defaultParams && defaultParams.length > 0) {
							for (var i = 0; i < scope.defaultParams.length; i++) {
								var item = scope.defaultParams[i];
								params[item.key] = item.value;
							}
						}
					};
					addParam(params, scope.defaultParams);

					function handleSuccess (data, status, headers, config) {
						if (headers('Link')) {
							scope.pagination = JSON.parse(headers('Link'));
						}
						if (data.paging) {
							scope.pagination = data.paging;
						}

						// cater for old array format from API
						var items = Array.isArray(data) ? data : data[Object.keys(data)[0]];
						if (items.code !== undefined) {
							// stupid stupid hack for logistics API
							var logistics_key = Object.keys(data[Object.keys(data)[1]])[0];
							items = data.data[logistics_key];
						}
						// cater for old object wrap format
						var allData;

						allData = scope.objectWrap ? _.map(items, function (item) {
							return item[scope.objectWrap];
						}) : items;

						if (scope.useAsId) {    // ugly hack
							_.each(allData, function (item) {
								item.id = item[scope.useAsId];
							});
						}
						if (options.export) {
							scope.exportData = allData;
						}
						else {
							scope.allData = allData;
							if (allData.length === 0) {
								scope.gridIsEmpty = true;
							}
						}

						// hack: reduce height if there are fewer than 25 rows


						scope.loadingGrid = false;
						scope.loadingPagination = false;
						if (options.callback) {
							options.callback();
						}
					}

					function handleError (err) {
						scope.loadingGrid = false;
						scope.errorMessage = err.message || 'Error when getting data';

					}

					if ( scope.filterMode && scope.filterMode === 'advanced' ){
						var storeId = DashboardFactory.getStoreId();

						var filter = {};
						var wildcard = null;
						var range = null;
						for ( var i = 0; i < scope.newFilters.length; i++ ){
							var filt = scope.newFilters[i];
							if ( filt.condition === 'contain' && filt.value ){
								if ( !wildcard ){
									wildcard = {};
								}
								wildcard[filt.column.field] = '*'+filt.value+'*';
							}
							else if ( filt.condition === 'equal' && filt.value ){
								if ( !filter ){
									filter = {};
								}
								filter[filt.column.field] = filt.value;
							}
							else if ( filt.condition === 'between' && filt.from && filt.to ){
								if ( !range ){
									range = {};
								}
								var rangeObject = {};
								rangeObject.gte = filt.from;
								rangeObject.lte = filt.to;
								range[filt.column.field] = rangeObject;
							}
						}
						filter['store_id'] = [storeId];

						var searchObject = {};
            var { per_page = 25, page = 1 } = params;
						if (filter){
							searchObject["filter"] = filter;
						}
						if ( wildcard ){
							searchObject["wildcard"] = wildcard;
						}
						if ( range ){
							searchObject["range"] = range;
						}
            searchObject.sort = [{ created_at: 'desc'}];
						$http.post(scope.route, { "search":searchObject, per_page, page }).success(handleSuccess).error(handleError);
					}
					else {
						$http.get(scope.route, { params: params }).success(handleSuccess).error(handleError);
					}
				};
				scope.fetchPage = fetchPage;
				fetchPage();


				// for item updates
				scope.reload = function () {
					$state.transitionTo($state.current, stateParams, {
						reload: true,
						inherit: false,
						notify: true
					});
				};
			}
		}
	};
}

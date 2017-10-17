(function () {
	'use strict';
	var module = angular.module('ui.grid.exporter.raw', ['ui.grid']);
	module.constant('uiGridExporterConstants', {
		featureName: 'exporter',
		ALL: 'all',
		VISIBLE: 'visible',
		SELECTED: 'selected',
		CSV_CONTENT: 'CSV_CONTENT',
		BUTTON_LABEL: 'BUTTON_LABEL',
		FILE_NAME: 'FILE_NAME'
	});

	module.service('uiGridExporterService', ['$q', 'uiGridExporterConstants', 'gridUtil', '$compile', '$interval', 'i18nService',
	                                         function ($q, uiGridExporterConstants, gridUtil, $compile, $interval, i18nService) {

		var service = {

				delay: 100,

				initializeGrid: function (grid) {

					//add feature namespace and any properties to grid for needed state
					grid.exporter = {};
					this.defaultGridOptions(grid.options);
					var publicApi = {
							events: {
								exporter: {
								}
							},
							methods: {
								exporter: {
									rawExport: function (rowTypes, colTypes) {
										return service.rawExport(grid, rowTypes, colTypes);
									}
								}
							}
					};

					grid.api.registerEventsFromObject(publicApi.events);

					grid.api.registerMethodsFromObject(publicApi.methods);

					if (grid.api.core.addToGridMenu){
						service.addToMenu( grid );
					} else {
						$interval( function() {
							if (grid.api.core.addToGridMenu){
								service.addToMenu( grid );
							}
						}, this.delay, 1);
					}

				},

				defaultGridOptions: function (gridOptions) {
					gridOptions.exporterSuppressMenu = gridOptions.exporterSuppressMenu === true;
					gridOptions.exporterMenuLabel = gridOptions.exporterMenuLabel ? gridOptions.exporterMenuLabel : 'Export';
					gridOptions.exporterSuppressColumns = gridOptions.exporterSuppressColumns ? gridOptions.exporterSuppressColumns : [];
					gridOptions.exporterHeaderFilterUseName = gridOptions.exporterHeaderFilterUseName === true;
					gridOptions.exporterFieldCallback = gridOptions.exporterFieldCallback ? gridOptions.exporterFieldCallback : function( grid, row, col, value ) { return value; };
					gridOptions.exporterAllDataFn = gridOptions.exporterAllDataFn ? gridOptions.exporterAllDataFn : null;
					if ( gridOptions.exporterAllDataFn == null && gridOptions.exporterAllDataPromise ) {
						gridOptions.exporterAllDataFn = gridOptions.exporterAllDataPromise;
					}
				},

				rawExport: function (grid, rowTypes, colTypes) {
					var self = this;
					var exportColumnHeaders = grid.options.showHeader ? self.getColumnHeaders(grid, colTypes) : [];
					var exportData = self.getData(grid, rowTypes, colTypes, true);
					return {column:exportColumnHeaders, data:exportData};
				},

				loadAllDataIfNeeded: function (grid, rowTypes, colTypes) {
					if ( rowTypes === uiGridExporterConstants.ALL && grid.rows.length !== grid.options.totalItems && grid.options.exporterAllDataFn) {
						return grid.options.exporterAllDataFn()
						.then(function() {
							grid.modifyRows(grid.options.data);
						});
					} else {
						var deferred = $q.defer();
						deferred.resolve();
						return deferred.promise;
					}
				},

				getColumnHeaders: function (grid, colTypes) {
					var headers = [];
					var columns;

					if ( colTypes === uiGridExporterConstants.ALL ){
						columns = grid.columns;
					} else {
						var leftColumns = grid.renderContainers.left ? grid.renderContainers.left.visibleColumnCache.filter( function( column ){ return column.visible; } ) : [];
						var bodyColumns = grid.renderContainers.body ? grid.renderContainers.body.visibleColumnCache.filter( function( column ){ return column.visible; } ) : [];
						var rightColumns = grid.renderContainers.right ? grid.renderContainers.right.visibleColumnCache.filter( function( column ){ return column.visible; } ) : [];

						columns = leftColumns.concat(bodyColumns,rightColumns);
					}

					columns.forEach( function( gridCol, index ) {
						if ( gridCol.colDef.exporterSuppressExport !== true &&
								grid.options.exporterSuppressColumns.indexOf( gridCol.name ) === -1 ){
							headers.push({
								name: gridCol.field,
								displayName: grid.options.exporterHeaderFilter ? ( grid.options.exporterHeaderFilterUseName ? grid.options.exporterHeaderFilter(gridCol.name) : grid.options.exporterHeaderFilter(gridCol.displayName) ) : gridCol.displayName,
										width: gridCol.drawnWidth ? gridCol.drawnWidth : gridCol.width,
												align: gridCol.colDef.type === 'number' ? 'right' : 'left',
														gridInfo: gridCol
							});
						}
					});

					return headers;
				},
				getData: function (grid, rowTypes, colTypes, applyCellFilters) {
					var data = [];
					var rows;
					var columns;
					switch ( rowTypes ) {
					case uiGridExporterConstants.ALL:
						rows = grid.rows;
						break;
					case uiGridExporterConstants.VISIBLE:
						rows = grid.getVisibleRows();
						break;
					case uiGridExporterConstants.SELECTED:
						if ( grid.api.selection ){
							rows = grid.api.selection.getSelectedGridRows();
						} else {
							gridUtil.logError('selection feature must be enabled to allow selected rows to be exported');
						}
						break;
					}
					if ( colTypes === uiGridExporterConstants.ALL ){
						columns = grid.columns;
					} else {
						var leftColumns = grid.renderContainers.left ? grid.renderContainers.left.visibleColumnCache.filter( function( column ){ return column.visible; } ) : [];
						var bodyColumns = grid.renderContainers.body ? grid.renderContainers.body.visibleColumnCache.filter( function( column ){ return column.visible; } ) : [];
						var rightColumns = grid.renderContainers.right ? grid.renderContainers.right.visibleColumnCache.filter( function( column ){ return column.visible; } ) : [];

						columns = leftColumns.concat(bodyColumns,rightColumns);
					}
					rows.forEach( function( row, index ) {
						if (row.exporterEnableExporting !== false) {
							var extractedRow = [];
							columns.forEach( function( gridCol, index ) {
								if ( (gridCol.visible || colTypes === uiGridExporterConstants.ALL ) &&
										gridCol.colDef.exporterSuppressExport !== true &&
										grid.options.exporterSuppressColumns.indexOf( gridCol.name ) === -1 ){
									//var cellValue = applyCellFilters ? grid.getCellDisplayValue( row, gridCol ) : grid.getCellValue( row, gridCol );
									//if ( !cellValue ){

									var cellValue =  grid.getCellValue( row, gridCol );
									//}

									var extractedField = { value: grid.options.exporterFieldCallback( grid, row, gridCol, cellValue ) };
									if ( gridCol.colDef.exporterPdfAlign ) {
										extractedField.alignment = gridCol.colDef.exporterPdfAlign;
									}
									extractedRow.push(extractedField);
								}
							});

							data.push(extractedRow);
						}
					});
					return data;
				},
		};
		return service;
	}
	]);
})();
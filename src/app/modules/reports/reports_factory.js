export function reportsFactory(CommonFactory, DashboardFactory, $rootScope, $http, $state, $filter, $q, ExportFactory) {
  'ngInject';
	var props = {};

	var analytics = function() {
		return $rootScope.analytics + '/v2/stores/' + DashboardFactory.getStoreId();
	};
	var api = function() {
		return $rootScope.BindoAPI + '/stores/' + DashboardFactory.getStoreId() + '/reports';
	};
	var analyticsv4 = function() {
		return $rootScope.analytics + '/v4/stores/' + DashboardFactory.getStoreId();
	};

	var getReport = function(report){
		function word(string) {
			if(string) {
				return string.replace(/_/gi, ' ');
			} else {
				return '';
			}
		}
		var headers = [];

		var title = $filter('titleCase')(word(report.title));
		var keys = _.map(report.data, function(x){
			return _.keys(x);
		});
		var uniquekeys = {};
		_.each(keys, function(key){
			_.each(key, function(k){
				uniquekeys[k] = true;
			});
		});
		delete uniquekeys.$$hashKey;
		delete uniquekeys.bold;
		var columns = [];
		for (var key in uniquekeys) {
			if ( key === 'name' || key === 'tender' || key === 'title' ){
				columns.unshift(key);
			}
			else {
				columns.push(key);
			}
		}
		if ( report.schema ){
			_.each(report.schema, function(column){

				var header = {};
				header.displayName = column.name;
				header.field = column.key;
				if (column.filter){
					header.filter = column.filter;
				}
				headers.push(header);
			});
		}
		else {
			_.each(columns, function(column){
				headers.push({displayName: $filter('titleCase')(word(column)),field:column});
			});
		}

		var data = _.map(report.data, function(row){
			if ( !row ){
				return null;
			}
			var newrow = JSON.parse(JSON.stringify(row));
			if ( newrow.title ){
				newrow.title = $filter('titleCase')(row.title);
			}
			if ( typeof newrow.amount !== 'undefined' && newrow.amount !== null ){

        newrow.amount = $filter('myCurrencyReport')(newrow.amount);
			}

			if ( typeof newrow.tips_amount !== 'undefined' && newrow.tips_amount !== null ){
				newrow.tips_amount = $filter('myCurrencyReport')(newrow.tips_amount);

			}
			return newrow;
		});

		return {columns:headers, entries:data, tableName:title};
	};

	var header = function(dateFrom, dateTo){
		var store = DashboardFactory.getCurrentStore();
		var text = [];

		text.push(store.title);
		text.push(store.address1);

		if ( store.address2 && store.address2 !== '' ){
			text.push(store.address2);
		}
		text.push(''+store.city+', '+store.state + ' '+ store.zipcode +' '+ store.country_code);
		text.push('');
		var title = $filter('titleCase')($state.params.report);
		text.push(title);

		var line = '';
		if ( dateFrom || dateTo ){
			line+='Date: ';
		}

		if ( dateFrom ){
			line+='from '+ dateFrom + ' ';
		}
		if ( dateTo ){
			line+='to ' + dateTo;
		}
		if ( dateFrom || dateTo ){
			text.push(line);
		}
		text.push('Export Date: '+ moment().format('YYYY-MM-DD'));

		return text;
	};

	var ReportResource = function(path) {
		this.path = path;

		this.get =  function(dateFrom, dateTo, filter, download, listOfStores) {
			var params = {
					date_from: dateFrom,
					date_to: dateTo
			}
			var storeIds = null;
			if ( listOfStores.length > 1 ){
				storeIds = listOfStores.join(',');
			}

			if ( storeIds ){
				params['store_ids'] = storeIds;
			}

			params = _.pick(_.extend(params, filter), _.identity); // remove empty

			var options =  {
					params: params
			};

			if(download === true) {
				options.headers = {
						Accept : 'application/csv',
				};
				options.responseType = 'arraybuffer';
			}

			var promise = $http.get(this.path, options);

			if( download && download.mode === 'csv' ) {
				promise.then( function(csv) {
					var fileName = $rootScope.currentStores[0].title + '__';
					try {
						fileName = fileName + $state.params.report;
					} catch(e) {
						fileName = fileName + 'Report';
					}
          if ( dateFrom && dateTo ) {
            fileName = fileName + ' ' + dateFrom + '-' + dateTo;
          }
					fileName = fileName + '.csv';
					var data = csv.data;
					if ( download.dataCallback ){
						data = download.dataCallback(data);
					}
					ExportFactory.exportCsv(download.columnDefs, data, header(dateFrom, dateTo), fileName);
				})
			}
			else if( download && download.mode === 'pdf' ) {
				promise.then( function(csv) {
          var fileName = $rootScope.currentStores[0].title + '__';
					try {
            fileName = fileName + $state.params.report;
					} catch(e) {
            fileName = fileName + 'Report';
					}
          if ( dateFrom && dateTo ) {
            fileName = fileName + ' ' + dateFrom + '-' + dateTo;
          }
					fileName = fileName + '.pdf';
					var data = csv.data;
					if ( download.dataCallback ){
						data = download.dataCallback(data);
					}

					ExportFactory.exportPdf(download.columnDefs, data, header(dateFrom, dateTo), fileName);

				})
			}
			else if( download && download.mode === 'xls' ) {
				promise.then( function(csv) {
          var fileName = $rootScope.currentStores[0].title + '__';
					try {
            fileName = fileName + $state.params.report;
					} catch(e) {
            fileName = fileName + 'Report';
					}
          if ( dateFrom && dateTo ) {
            fileName = fileName + ' ' + dateFrom + '-' + dateTo;
          }
					fileName = fileName + '.xls';
					var data = csv.data;
					if ( download.dataCallback ){
						data = download.dataCallback(data);
					}
					ExportFactory.exportExcel(download.columnDefs, data, header(dateFrom, dateTo), fileName);
				})
			}

			return promise
		};
	};

	var analyticsApi = function(uri, dateFrom, dateTo, filter, download) {

		var listOfStores = DashboardFactory.getStoreIds();
		var multipleStore = ( listOfStores.length > 1 );

		var api;
		if ( multipleStore ){
			api = $rootScope.analytics + '/v2/';
		}
		else {
			api = $rootScope.analytics + '/v2/stores/' + DashboardFactory.getStoreId();
		}

		var path = api + '/' + uri;
		return new ReportResource(path).get(dateFrom, dateTo, filter, download, listOfStores)
	}

	var analyticsv4Api = function(uri, dateFrom, dateTo, filter, download) {
		var listOfStores = DashboardFactory.getStoreIds();
		var multipleStore = ( listOfStores.length > 1 );


		var api;
		if ( multipleStore ){
			api = $rootScope.analytics + '/v4/';
		}
		else {
			api = $rootScope.analytics + '/v4/stores/' + DashboardFactory.getStoreId();
		}


		var path = api + '/' + uri;
		return new ReportResource(path).get(dateFrom, dateTo, filter, download, listOfStores)
	}

	var reportApi = function (reportName, dateFrom, dateTo, filter, download) {

		var listOfStores = DashboardFactory.getStoreIds();
		var multipleStore = ( listOfStores.length > 1 );
		var api;

		if ( multipleStore ){
			api = $rootScope.BindoAPI + '/reports';
		}
		else {
			api = $rootScope.BindoAPI + '/stores/' + DashboardFactory.getStoreId() + '/reports';
		}
		var path = api + '/' + _.snakeCase(reportName);
		return new ReportResource(path).get(dateFrom, dateTo, filter, download, listOfStores)
	};

	var schemaTypeFilter = function (row) {
		return (row.type === 'datetime') ? 'moment' :
			(row.type === 'date') ? 'momentDate' :
				(row.type === 'currency') ? 'myCurrencyReport' :
					row.currency ? 'myCurrencyReport' :
						row.percentage ? 'percentage' :
							_.isNumber(row.decimal) ? 'number:'+ row.decimal : null
	};


	props.getReport = getReport;
	props.analyticsApi = analyticsApi;
	props.analyticsv4Api = analyticsv4Api;
	props.reportApi = reportApi;
	props.schemaTypeFilter = schemaTypeFilter;
	props.header = header;
	props.showCurrency = {value: true};

	return props;
};

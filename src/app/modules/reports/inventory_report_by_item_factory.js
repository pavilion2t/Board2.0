
export function InventoryReportByItemFactory (CommonFactory, DashboardFactory, $rootScope, $http, $state, $filter, $q, ExportFactory) {
	'ngInject';

	var factory = {};
	factory.getReport = function(dateFrom, dateTo, items){
		var options = {};
    options.date_from = dateFrom;
    options.date_to = dateTo;
    options.product_ids = items;
    var params  = $.param(options);
    var url = $rootScope.BindoAPI + '/stores/' + DashboardFactory.getStoreId() + '/reports/festive_report?'+params;
    return $http.get(url);
	};
	return factory;
};

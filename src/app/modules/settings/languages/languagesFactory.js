export function LanguagesFactory($rootScope, $http, DashboardFactory) {
	'ngInject';
	var factory = {};

	factory.languages_by_locale = DashboardFactory.languages_by_locale_lower;


	factory.getLocales = function(storeid) {
		storeid = storeid | DashboardFactory.getStoreId();
		return $http.get($rootScope.api + '/api/v2/stores/' + storeid+'/store_locales?per_page=999999');
	};

	factory.createLocales = function(values,storeid){
		storeid = storeid | DashboardFactory.getStoreId();
		return $http.post($rootScope.api + '/api/v2/stores/'+ storeid+'/store_locales',{"store_locale":{"locale":values}});
	};

	factory.deleteLocales = function(id,storeid){
		storeid = storeid | DashboardFactory.getStoreId();
		return $http.delete($rootScope.api + '/api/v2/stores/'+ storeid+'/store_locales/'+id);
	};

	return factory;

};

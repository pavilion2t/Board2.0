export function SummaryFactory($q, $rootScope, $http, DashboardFactory) {
	'ngInject';


	// dates are inclusive
	var getSalesSummary = function(id, startDate, endDate) {
		var deferred = $q.defer();

		$http.get( $rootScope.BindoAPI + '/stores/' + id + '/reports/sales_summary_report', {
			params: {
				date_from: startDate,
				date_to: endDate,
				"exposures[]": ['product_sales', 'number_of_product_sales', 'net_sales', 'total_gross_sales', 'gross_profit']
			}
		}).success((res) => {
			deferred.resolve(res.data);
		});
		return deferred.promise;
	};
	var getTopProducts = function(id, startDate, endDate) {
		return $http.get($rootScope.analytics + '/v3/stores/' + id + '/product_sales_sheet', {
			params: {
				date_from: startDate,
				date_to: endDate
			}
		});
	};
	var getTopDepartments = function(id, startDate, endDate) {
		return $http.get($rootScope.analytics + '/v3/stores/' + id + '/product_sales_summary_sheet', {
			params: {
				date_from: startDate,
				date_to: endDate
			}
		});
	};

	var getPuchase = function(storeIds, startDate, endDate) {
		var deferred = $q.defer();

		var _purchaseSummaryPromises = function(storeIds, startDate, endDate) {

			var options = {
					params: {
						date_from: startDate,
						date_to: endDate
					}
			};

			return _.map(storeIds, function(id) {
				return $http.get($rootScope.analytics + '/v3/stores/' + id + '/purchase_summary', options);
			});
		};

		$q.all(_purchaseSummaryPromises(storeIds, startDate, endDate)).then(function(data){
			data = _.map(data, function(data) { return data.data; });

			var total = _.reduce(data, function(memo, data){
				memo[0] = memo[0] + data[0];
				memo[1] = memo[1] + data[1];
				return memo;
			}, [0.0, 0]);

			deferred.resolve(total[0]);

		}, function(error){
			deferred.reject(error);
		});

		return deferred.promise;

	};

	var getProductSold = function(storeIds, startDate, endDate) {
		var deferred = $q.defer();

		$q.all(_salesSummaryPromises(storeIds, startDate, endDate)).then(function(data){
			data = _.flatten(_.map(data, function(data) { return data.data; }));

			var total = _.reduce(data, function(memo, data){ return data.quantity + memo; }, 0);
			deferred.resolve(total);

		}, function(error){
			deferred.reject(error);
		});

		return deferred.promise;
	};


	var _salesSummaryPromises = function(storeIds, startDate, endDate) {
		return _.map(storeIds, function(id) {
			return getTopDepartments(id, startDate, endDate);
		});
	};

	var timeFrame = {};


	return {
		timeFrame: timeFrame,
		getSalesSummary: getSalesSummary,
		getTopProducts: getTopProducts,
		getTopDepartments: getTopDepartments,
		getProductSold: getProductSold,
		getPuchase: getPuchase,
	};


}

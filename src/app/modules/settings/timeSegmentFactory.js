export function TimeSegmentFactory($rootScope, $http, $q, DashboardFactory) {
  'ngInject';

  var factory = {};

  var _apiPath = function(storeId) {
    storeId = storeId || DashboardFactory.getStoreId();
    return $rootScope.api + '/api/v2/stores/' + storeId + '';
  };
  factory.get = function(storeId) {
    var path = _apiPath(storeId);
    var deferred = $q.defer();
    $http.get(path).success(function(data) {
      deferred.resolve(data.store.opening_hours);
    });
    return deferred.promise;
  };

  factory.set = function(storeId, opening_hours) {
    var path = _apiPath(storeId);
    return $http.put(path,{"store_attributes":
      {
        "opening_hours": opening_hours,
        "time_segments": opening_hours
      }
      }
    );
  };

  factory.getSegments = function(storeId) {
    var path = _apiPath(storeId) + '/time_segments';
    var deferred = $q.defer();
    $http.get(path).success(function(data) {
      deferred.resolve(data.time_segments);
    });
    return deferred.promise;
  };

  factory.setSegments = function(storeId, time_segments) {
    var path = _apiPath(storeId)+ '/time_segments';
    return $http.put(path,{ "time_segments": time_segments});
  };


  return factory;
}

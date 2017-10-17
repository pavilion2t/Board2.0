export function ExternalSourcesStoreFactory($rootScope, $http) {
  'ngInject';
  var searchStores = function (title, zipcode) {
    return $http.get($rootScope.api + '/api/v2/store-search?title=' + title + '&zipcode=' + zipcode + '&country=en');
  };

  var createStore = function (data) {
    console.log(data);
    return $http.post($rootScope.api + '/api/v2/stores', data);
  };

  var updateExchangeRateByStore = function (data, store_id) {
    return $http.put($rootScope.api + '/api/v2/stores/' + store_id, data);
  };

  var createUpdateExternalSource = function (data) {
    console.log(data);
    return $http.post($rootScope.externalsources + '/external_sources', data);
  }

  var retrieveExternalSource = function (source_type, source_id) {
    return $http.get($rootScope.externalsources + '/external_sources/' + source_type + '/' + source_id);
  }

  var retrieveExternalSourceStore = function (external_source_id, store_id) {
    return $http.get($rootScope.externalsources + '/external_sources/external_source_stores/' + external_source_id + '/' + store_id);
  }

  var deleteExternalSourceStore = function (external_source_id, store_id) {
    return $http.delete($rootScope.externalsources + '/external_sources/external_source_stores/' + external_source_id + '/' + store_id);
  }

  return {
    searchStores: searchStores,
    updateExchangeRateByStore: updateExchangeRateByStore,
    createStore: createStore,
    createUpdateExternalSource: createUpdateExternalSource,
    retrieveExternalSource: retrieveExternalSource,
    retrieveExternalSourceStore: retrieveExternalSourceStore,
    deleteExternalSourceStore: deleteExternalSourceStore
  };

}

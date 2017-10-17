export class CustomfieldFactory {
  constructor($rootScope, $http, CommonFactory, DashboardFactory) {
    'ngInject';

    var getFields = function() {
      return $http.get(_apiPath);
    };

    var createField = function() {
      return $http.post(_apiPath);
    };

    var updateField = function(id) {
      return $http.put(_apiPath + '/' + id);
    };

    var deleteField = function(id) {
      return $http.delete(_apiPath + '/' + id);
    };

    var _apiPath = $rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/custom_fields';

    return {
      getFields: getFields,
      createField: createField,
      updateField: updateField,
      deleteField: deleteField,
    };

  }
}

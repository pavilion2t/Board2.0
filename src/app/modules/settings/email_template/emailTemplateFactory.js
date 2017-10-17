export function EmailTemplateFactory( $rootScope, $http, $q, CommonFactory, DashboardFactory) {
    'ngInject';
    var getTemplate = function(id, storeId) {
      storeId = storeId || DashboardFactory.getStoreId();
      return $http.get($rootScope.gateway + '/v2/stores/' + storeId + '/email_template/'+id);
    };

    var getTemplates = function(storeId) {
      storeId = storeId || DashboardFactory.getStoreId();
      return $http.get($rootScope.gateway + '/v2/stores/' + storeId + '/email_template');
    };

    var createTemplate = function(data, storeId) {
      storeId = storeId || DashboardFactory.getStoreId();
      return $http.post($rootScope.gateway + '/v2/stores/' + storeId + '/email_template',{email_template:data});
    };

    var updateTemplate = function(data, id, storeId) {
      storeId = storeId || DashboardFactory.getStoreId();
      return $http.put($rootScope.gateway + '/v2/stores/' + storeId + '/email_template/'+id,{email_template:data});
    };

    var deleteTemplate = function(id, storeId) {
      storeId = storeId || DashboardFactory.getStoreId();
      return $http.delete($rootScope.gateway + '/v2/stores/' + storeId + '/email_template/'+id);
    };

    var makePrimary = function(data, id, storeId) {
      data.default = true
      storeId = storeId || DashboardFactory.getStoreId();
      return $http.put($rootScope.gateway + '/v2/stores/' + storeId + '/email_template/'+id, {
        email_template: data
      })
    }
    return {
      getTemplate: getTemplate,
      getTemplates: getTemplates,
      createTemplate: createTemplate,
      updateTemplate: updateTemplate,
      deleteTemplate: deleteTemplate,
      makePrimary
    };

  };

export function IframeFactory($q, $rootScope, $http, CommonFactory, DashboardFactory) {
  'ngInject';

  var getIframePages = function() {
    return $http.get($rootScope.storefrontApi + '/v1/stores/' + DashboardFactory.getCurrentStore().slug + '/iframe_pages');
  };

  var getIframePage = function(id) {
    return $http.get($rootScope.storefrontApi + '/v1/stores/' + DashboardFactory.getCurrentStore().slug + '/iframe_pages/' + id);
  };

  var createIframePage = function(data) {
    return $http.post($rootScope.storefrontApi + '/v1/stores/' + DashboardFactory.getCurrentStore().slug + '/iframe_pages', {iframe_page: data});
  };

  var updateIframePage = function(id, data) {
    return $http.put($rootScope.storefrontApi + '/v1/stores/' + DashboardFactory.getCurrentStore().slug + '/iframe_pages/' + id, {iframe_page: data});
  };

  var deleteIframePage = function(id) {
    return $http.delete($rootScope.storefrontApi + '/v1/stores/' + DashboardFactory.getCurrentStore().slug + '/iframe_pages/' + id);
  };

  var getIframeSections = function(pageId) {
    return $http.get($rootScope.storefrontApi + '/v1/stores/' + DashboardFactory.getCurrentStore().slug + '/iframe_pages/' + pageId + '/iframe_page_sections');
  };

  var deleteIframeSection = function(pageId, sectionId) {
    return $http.delete($rootScope.storefrontApi + '/v1/stores/' + DashboardFactory.getCurrentStore().slug + '/iframe_pages/' + pageId + '/iframe_page_sections/' + sectionId);
  };


  var requestIframeActivation = function() {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/request_iframe_activation');
  };

  var getIframeSetting = function() {
    return $http.get($rootScope.storefrontApi + '/v1/stores/' + DashboardFactory.getCurrentStore().slug + '/current_iframe_setting');
  };

  var createIframeSetting = function(data) {
    return $http.post($rootScope.storefrontApi + '/v1/stores/' + DashboardFactory.getCurrentStore().slug + '/iframe_settings', {iframe_setting: data});
  };

  var updateIframeSetting = function(id, data) {
    return $http.put($rootScope.storefrontApi + '/v1/stores/' + DashboardFactory.getCurrentStore().slug + '/iframe_settings/' + id, {iframe_setting: data});
  };

  return {
    getIframePages: getIframePages,
    getIframePage: getIframePage,
    createIframePage: createIframePage,
    updateIframePage: updateIframePage,
    deleteIframePage: deleteIframePage,
    requestIframeActivation: requestIframeActivation,
    getIframeSetting: getIframeSetting,
    createIframeSetting: createIframeSetting,
    updateIframeSetting: updateIframeSetting,
    deleteIframeSection: deleteIframeSection,
  };

}

export function BackEndFactory(DashboardFactory, $rootScope, $http) {
  'ngInject';
  function setApi() {
    if(process.env.NODE_ENV === 'production') {
      $rootScope.env = 'production';
      $rootScope.api = 'https://bindo.com';
      $rootScope.BindoAPI = 'https://api2.bindo.com';
      $rootScope.externalsources = 'https://api.bindo.com/external_sources';
      $rootScope.gateway = 'https://gateway.bindo.com';
      $rootScope.analytics = 'https://analytics.bindo.com';
      $rootScope.logistics = 'https://api.bindo.com/logistics';
      $rootScope.storefront = 'https://storefront.bindo.com';
      $rootScope.storefrontApi = 'https://storefront-api.bindo.com';
      $rootScope.storefrontEmbed = 'https://storefront.bindo.com/storefront.js';

      $rootScope.clientId = '6lq1dleipg1ydj8h5w1gp9cl1';
      $rootScope.clientSecret = 'c8q30ncchruhicq85gvw6vdcp';
      $rootScope.s3 = 'https://s3.amazonaws.com/bindo-images';
    } else {
      $rootScope.env = 'staging';
      $rootScope.api = 'https://trybindo.com';
      $rootScope.goApi = 'https://try-main.bindo.io'
      $rootScope.BindoAPI = 'https://api.trybindo.com';
      $rootScope.externalsources = 'https://api.trybindo.com/external_sources';
      $rootScope.gateway = 'https://gateway.trybindo.com';
      $rootScope.analytics = 'https://analytics.trybindo.com';
      $rootScope.logistics = 'https://api.trybindo.com/logistics';
      $rootScope.storefront = 'https://storefront.trybindo.com';
      $rootScope.storefrontApi = 'https://storefront-api.trybindo.com';
      $rootScope.storefrontEmbed = 'http://storefront.trybindo.com/storefront.js';

      $rootScope.clientId = '1clvjqb9fmv5bkjoq2akbc1h4';
      $rootScope.clientSecret = '1tfcglxmnjv4t263dji05wmjr';
      $rootScope.s3 = 'https://s3.amazonaws.com/bindo-images-dev';
    }

    $rootScope.googleMaps = '//maps.googleapis.com/maps/api/js?sensor=false&key=AIzaSyCYeQBJsWFZXrf9laBJn_P2ev5SrI0nLyM';
  }

  // In progess: make all the service use below function so that there will be less repeated code

  function jsonToQueryString(json) {
    if ( json !== null || typeof json !== 'undefined' ) {
        return '?' + Object.keys(json).map(
                function (key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
                }
            ).join('&');
    }
    return "";
  }

  var gatewayPath = $rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId();
  var analyticPath = $rootScope.analytics + '/v3/stores/' + DashboardFactory.getStoreId();
  var storePath = $rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId();

  var getGateway = function( path, content ){
      return $http.get(gatewayPath + path + jsonToQueryString(content) );
  };
  var postGateway = function( path, content ) {
      return $http.post(gatewayPath + path, content );
  };
  var putGateway = function( path, content ) {
      return $http.put(gatewayPath + path, content );
  };



  var getAnalytics = function( path, content ){
      return $http.get( analyticPath + path + jsonToQueryString(content) );
  };



  var getStores = function( path, content ){
      return $http.get( storePath + path + jsonToQueryString(content) );
  };
  var postStores = function ( path, content ){
      return $http.post( storePath + path, content );
  };
  var putStores = function( path, content ) {
      return $http.put( storePath + path, content );
  };

  var deleteStores = function ( path ){
      return $http.delete( storePath + path );
  };

  return {
    setApi: setApi,

    getGateway: getGateway,
    postGateway: postGateway,
    putGateway: putGateway,

    getAnalytics: getAnalytics,

    getStores: getStores,
    postStores: postStores,
    putStores: putStores,
    deleteStores: deleteStores
  };
}

export function EventDevicesFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  var api = function (storeId) {
    if ( !storeId ){
      storeId = DashboardFactory.getStoreId();
    }
    return $rootScope.api + '/api/v2/stores/' + storeId;
  };

  var getStore = function(storeId) {
    return $http.get( api(storeId) + '/module');
  };

  var putStore = function(value) {
    return $http.put( api() + '/module',{module:{device_whitelist_enabled:value}});
  };

  var getDevices = function(storeId) {
    return $http.get( api(storeId) + '/devices?per_page=999&page=1');
  };

  var postDevices = function(device) {
    return $http.post( api() + '/devices', {device:device});
  };

  var putDevices = function(device) {
    return $http.put( api() + '/devices/'+device.id, {device:{whitelist:device.whitelist}});
  };

  var deleteDevices = function(device) {
    return $http.delete( api() + '/devices/'+device.id);
  };


  return {
    getStore: getStore,
    putStore: putStore,
    getDevices: getDevices,
    postDevices: postDevices,
    putDevices: putDevices,
    deleteDevices: deleteDevices
  };
}

export function CustomAttributesFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  var factory = {};



  factory.getAttributes = function(storeid) {
    storeid = storeid | DashboardFactory.getStoreId();
    return $http.get($rootScope.api + '/api/v2/stores/'+storeid+'/custom_fields');
  };

  factory.createAttribute = function(values,storeid){
    storeid = storeid | DashboardFactory.getStoreId();
    return $http.post($rootScope.api + '/api/v2/stores/'+storeid+'/custom_fields',{"custom_field":values});
  };

  factory.updateAttribute = function(id,values,storeid){
    storeid = storeid | DashboardFactory.getStoreId();
    return $http.put($rootScope.api + '/api/v2/stores/'+storeid+'/custom_fields/'+id,{"custom_field":values});
  };

  factory.deleteAttribute = function(id,storeid,forced){
    storeid = storeid | DashboardFactory.getStoreId();
    var forcedparam = '';
    if ( forced ){
      forcedparam = '?force=true';
    }
    return $http.delete($rootScope.api + '/api/v2/stores/'+ storeid+'/custom_fields/'+id+forcedparam);
  };

  return factory;

}

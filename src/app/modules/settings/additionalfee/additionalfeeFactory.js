export function AdditionalfeeFactory($rootScope, $http, DashboardFactory, CommonFactory, messageFactory) {
  'ngInject';

  var getFee = function(id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/additional_fees/'+id)
  };

  var getFees = function(id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/additional_fees');
  };

  var updateFee = function(id, values){
    return $http.put($rootScope.api + '/api/v2/stores/'+ DashboardFactory.getStoreId() + '/additional_fees/' + id, { additional_fee: values});
  };

  var createFee = function(values){
    return $http.post($rootScope.api + '/api/v2/stores/'+ DashboardFactory.getStoreId() + '/additional_fees', { additional_fees: values} );
  };

  var removeFee = function(id){

    return $http.delete ($rootScope.api + '/api/v2/stores/'+ DashboardFactory.getStoreId() + '/additional_fees/' + id);
  };

  return {
    getFee: getFee,
    getFees: getFees,
    updateFee: updateFee,
    createFee: createFee,
    removeFee: removeFee
  };

}

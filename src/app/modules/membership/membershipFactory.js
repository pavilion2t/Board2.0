export function MembershipFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  var getMembership = function(id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/membership_levels/'+id);
  };

  var updateMembership = function(id, data) {
    return $http.put($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/membership_levels/'+id, {membership_level:data});
  };

  var createMembership = function(data) {
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/membership_levels', {membership_level:data});
  };


  var deleteMembership = function(id) {
    return $http.delete($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/membership_levels/'+id);
  };

  return {
    getMembership: getMembership,
    updateMembership:updateMembership,
    createMembership:createMembership,
    deleteMembership:deleteMembership
  };
}

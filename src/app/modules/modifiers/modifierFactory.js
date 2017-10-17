export function ModifierFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  var createModifierGroup = function (group) {
    var modifierGroup = angular.copy(group);
    modifierGroup.modifiers = _.flatten(_.values(group.modifiers));

    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/modifier_groups', { modifier_group: modifierGroup });
  };
  var updateModifierGroup = function (id, group) {
    var modifierGroup = angular.copy(group);
    modifierGroup.modifiers = _.flatten(_.values(group.modifiers));
    return $http.put($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/modifier_groups/' + id, { modifier_group: modifierGroup });
  };
  var getModifierGroup = function (id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/modifier_groups/' + id);
  };
  var deleteModifierGroup = function (id) {
    return $http.delete($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/modifier_groups/' + id);
  };


  var createModifierSet = function (set) {
    var modifierSet = angular.copy(set);
    modifierSet.modifier_set_options = _.flatten(_.values(set.modifier_set_options));
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/modifier_sets', { modifier_set: modifierSet });
  };
  var updateModifierSet = function (id, set) {
    var modifierSet = angular.copy(set);
    modifierSet.modifier_set_options = _.flatten(_.values(set.modifier_set_options));
    return $http.put($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/modifier_sets/' + id, { modifier_set: modifierSet });
  };
  var getModifierSet = function (id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/modifier_sets/' + id);
  };
  var deleteModifierSet = function (id) {
    return $http.delete($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/modifier_sets/' + id);
  };

  return {
    createModifierGroup: createModifierGroup,
    updateModifierGroup: updateModifierGroup,
    getModifierGroup: getModifierGroup,
    deleteModifierGroup: deleteModifierGroup,


    createModifierSet: createModifierSet,
    updateModifierSet: updateModifierSet,
    getModifierSet: getModifierSet,
    deleteModifierSet: deleteModifierSet
  };
}

export class PermissionsController {
  constructor($scope, $state, $stateParams, PermissionsFactory, ngDialog, DashboardFactory) {
    'ngInject';

    $scope.editMode = false;
    $scope.toggleMode = false;
    var _permissionsCache = {};
    var storeId = $stateParams.store_id;

    $scope.expandAll = function(){
      for ( var i = 0; i < $scope.permissionList.length; i ++ ){
        $scope.permissionList[i].show =true;
      }
    };

    $scope.collapseAll = function(){
      for ( var i = 0; i < $scope.permissionList.length; i ++ ){
        $scope.permissionList[i].show =false;
      }
    };

    // load permissions data
    function loadPermissions() {
      PermissionsFactory.get(storeId)
        .success(function(data) {
          $scope.permissions = data;

          $scope.permissionList = [];
          $scope.permissionMap = {};
          for ( var key in $scope.permissions.store_permissions[0].permissions ){

            var moduleValues = key.split(':');
            var moduleName = moduleValues[0];
            var moduleMode = moduleValues[1];


            if ( !$scope.permissionMap[moduleName] ){
              var permissionObject = {};
              permissionObject.name = moduleName;
              permissionObject.list = [];
              permissionObject.show =true;
              $scope.permissionMap[moduleName] = permissionObject;
              $scope.permissionList.push(permissionObject);
            }

            $scope.permissionMap[moduleName].list.push(key);


          }

        })
        .error(function(err) {
          console.error(err);
        });

    }

    loadPermissions()

    // load store data
    PermissionsFactory.getStore(storeId)
      .success(function(data) {
        $scope.store = data;
        var storeObj = $scope.store;
      })
      .error(function(err) {
        console.error(err);
      });

    $scope.enableEditMode = function() {
      $scope.editMode = true;
      angular.copy($scope.permissions, _permissionsCache);
    };

    $scope.toggle = function(key, key_permissions, rolename, user_permissions, $event) {
      user_permissions[key] = !user_permissions[key];
    };

    $scope.toggleCol = function(user_permissions) {
      var isSelectedAll = $scope.isSelectedAll(user_permissions)
      for (var prop in user_permissions) {
        user_permissions[prop] =  !isSelectedAll
      }
    };

    $scope.isSelectedAll = function (user_permissions) {
      return _.filter(user_permissions, permission => permission === false).length === 0
    }

    $scope.editRoles = function() {
      ngDialog.open({
        template: 'app/modules/settings/permissions/roles.html',
        className: 'ngdialog-theme-default',
        controller: 'RolesController',
      })
        .closePromise.then(function (response) {
        console.log(response);
        loadPermissions()
      });
    };

    $scope.cancelEdit = function () {
      if(confirm('Discard all changes?')) {
        $scope.editMode = false;
        $scope.permissions = angular.copy(_permissionsCache, $scope.permissions);
      }
    }

    $scope.saveEdit = function () {
      PermissionsFactory.update(storeId, $scope.permissions)
        .success(function(data) {

          window.location.reload();


        })
        .error(function(err) {
          console.error(err);
          $scope.errorMessage = err.message || 'Error when saving';
        });
    }

  }
}

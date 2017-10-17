
export class RolesController {
  constructor($scope, $state, $stateParams, rolesFactory) {
    'ngInject';

    rolesFactory.get().success((data) => {
      $scope.storeRoles = data.store_roles
    })

    $scope.createRole = function (name) {
      rolesFactory.create({name: name}).success((data) => {
        $scope.storeRoles.push(data.store_role)
      })
    }

    $scope.removeRole = function (role) {
      if(confirm('Are you sure you want to remove this role? Can\'t undo this action')) {
        rolesFactory.remove(role.id).success((data) => {
          _.pull($scope.storeRoles, role)
        })
      }
    }

    $scope.closeDialog = function () {
      $scope.closeThisDialog()
    }

  }
}

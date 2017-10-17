export default angular
  .module('select_department', [])
  .directive('selectDepartment', function () {
    return {
      restrict: 'E',
      template: "<button class='_secondary' ng-click='open()'>{{'Select Department'|translate}}</button>",
      transclude: true,
      scope: {
        onClose: '=',
        departments: '=',
        selectedIds: '=?',
        parent: '=?',
        storeId: '=?',
      },
      controller: function (ngDialog, $scope) {
        'ngInject';
        var _departments;

        // formatter for checkbox
        var formatter = function () {
          _departments = _.map(_.cloneDeep($scope.departments), (department) => {
            if (_.includes($scope.selectedIds, department.id)) {
              department.checked = true;
            }
            return department
          });
        };

        formatter()

        $scope.open = function () {

          ngDialog.open({
            template: 'app/shared/directive/select_department/select_department.html',
            className: 'ngdialog-theme-default ngdialog-theme-mega',
            controller: 'SelectDepartment',
            data: _departments,

          }).closePromise.then(function (response) {

            if (!response.value || response.value === "$closeButton" || response.value === "$document") {
              formatter();
              return
            }
            $scope.selectedIds = response.value; // will use in formatter
            $scope.onClose({ parent: $scope.parent, departmentIds: $scope.selectedIds });

          });
        };
      }
    };
  })
  .controller('SelectDepartment', function (messageFactory, DashboardFactory, $scope) {
    'ngInject';
    $scope.takenIds = $scope.$parent.takenIds || [];

    $scope.departments = $scope.ngDialogData;

    $scope.select = function () {
      var resultListings = _cookSelected($scope.departments);

      $scope.closeThisDialog(resultListings);
    };

    var _cookSelected = function (lisings) {
      return _.compact(_.map($scope.departments, (department) => {
        return department.checked ? department.id : null;
      }));
    };
  })


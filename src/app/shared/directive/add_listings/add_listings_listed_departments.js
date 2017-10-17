export function addListingsListedDepartments(DepartmentFactory, DashboardFactory, ngDialog, $rootScope, $compile, $state, CommonFactory) {
  'ngInject';
  return {
    restrict: 'E',
    scope: {
      selected: '=selected',
      department: '=?department',
      departments: '=?departments',
      listedDepartments: '=?listedDepartments'
    },
    templateUrl: 'app/shared/directive/add_listings/add_listings_listed_departments.html',
    link: function (scope, elem, attrs) {

      var childrenHTML = "<div class='department__children' ng-class='{_empty: !department._children.length }' ng-model='department._children'>" +
        "<div ng-repeat='department in department._children'><add-listings-listed-departments selected='department.selected' department='department' departments='departments' listed-departments='listedDepartments'></add-listings-listed-departments></div></div>";
      elem.find('.list__department').append(childrenHTML);
      $compile(elem.find('.department__children'))(scope);


      scope.$watch('selected', function (newVal, oldVal) {

        if (newVal === "undefined" || oldVal === "undefined") return;
        if (newVal === oldVal) return;
        scope.department.selected = newVal;

        _.forEach(scope.department._children, function (item) {
          if (newVal) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });

      });

      scope.$watch('department.selected', function (newVal, oldVal) {

        if (newVal === "undefined" || oldVal === "undefined") return;
        if (newVal === oldVal) return;
        scope.department.selected = newVal;

        _.forEach(scope.department._children, function (item) {
          if (newVal) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        });

      });


    }

  };
}

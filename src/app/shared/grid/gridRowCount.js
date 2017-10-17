export function gridRowCount($http, $state) {
  'ngInject';

  return {
    restrict: 'E',
    scope: false,    // just use parent scope at the moment
    templateUrl: 'app/shared/grid/grid-row-count.html',
    link: function(scope, elem, attrs) {
      scope.newRowCount = scope.rowCount;
      scope.Math = window.Math;
      scope.disableAll = true;
      scope.updateRowCount = function(count) {
        scope.rowCount = count;
        scope.pageNumber = 1;
      };
    }
  }
}

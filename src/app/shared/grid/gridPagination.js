export function gridPagination($http, $state) {
  'ngInject';

  return {
    restrict: 'E',
    scope: false,    // just use parent scope at the moment
    templateUrl: 'app/shared/grid/grid-pagination.html',
    link: function(scope, elem, attrs) {
      var currentState = $state.current.name;

      var paginationLinks = function(pagination) {
        var min;
        var max;

        if(scope.pageNumber > 4) {
          max = Math.min(scope.totalPages, scope.pageNumber + 5);
          min = Math.max(1, max - 9);
        } else {
          min = 1;
          max = Math.min(scope.totalPages, 10);
        }
        return _.range(min, max + 1);
      };

      scope.goToPage = function(targetPageNumber) {
        var params = { page: targetPageNumber, count: scope.rowCount };
        $state.go(currentState, params);
      };
      scope.goToPreviousPage = function() {
        var params = { page: scope.pageNumber - 1, count: scope.rowCount };
        $state.go(currentState, params);
      };
      scope.goToNextPage = function() {
        var params = { page: scope.pageNumber + 1, count: scope.rowCount };
        $state.go(currentState, params);
      };
      scope.goToFirstPage = function() {
        var params = { page: 1, count: scope.rowCount };
        $state.go(currentState, params);
      }
      scope.goToLastPage = function() {
        var params = { page: scope.totalPages, count: scope.rowCount };
        $state.go(currentState, params);
      }


      scope.$watch('pagination', function(newValue, old) {
        if(newValue) {
          scope.totalEntries = newValue.total_entries;
          scope.totalPages = newValue.total_pages;
          scope.paginationLinks = paginationLinks(newValue);
        }
      });



      scope.$watch('pageNumber', function(newValue, old) {
        if(!scope.returnAll) {

          var params = {page: newValue, count: scope.rowCount};
          $state.go($state.current.name, params);
        }
      });
      scope.$watch('rowCount', function(newValue, old) {
        if(!scope.returnAll) {
          var params = {page: scope.pageNumber, count: newValue};
          $state.go($state.current.name, params);

        }
        else {
          var params = {page: scope.pageNumber, count: 'all'};
          $state.go($state.current.name, params);
        }
      });
    }
  }
}

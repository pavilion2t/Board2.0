export function indexPaginator() {
    return {
        restrict: 'E',
        scope: {
            fetchData: '=',
            pagination: '='
        },
        templateUrl: 'app/shared/grid/grid-pagination.html',
        link: function(scope, elem, attrs) {
            scope.pageNumber = scope.pagination.current_page;
            scope.totalPages = scope.pagination.total_pages;
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
            scope.$watch('pagination', function(newValue, old) {
              if(newValue) {
                scope.totalEntries = newValue.total_entries;
                scope.totalPages = newValue.total_pages;
                scope.paginationLinks = paginationLinks(newValue);
              }
            });
            scope.goToFirstPage = function() {
                scope.pageNumber = 1;
                scope.fetchData({page: scope.pageNumber, per_page: scope.pagination.per_page});
            }
            scope.goToPreviousPage = function() {
                if (scope.pageNumber > 1) {
                    scope.pageNumber --;
                    scope.fetchData({page: scope.pageNumber, per_page: scope.pagination.per_page});
                }
            };
            scope.goToPage = function(number) {
                scope.pageNumber = number;
                scope.fetchData({page: scope.pageNumber, per_page: scope.pagination.per_page});
            }
            scope.goToNextPage = function() {
                if (scope.pageNumber < scope.pagination.total_pages) {
                    scope.pageNumber ++;
                    scope.fetchData({page: scope.pageNumber, per_page: scope.pagination.per_page});
                }
            };
            scope.goToLastPage = function() {
                scope.pageNumber = scope.pagination.total_pages;
                scope.fetchData({page: scope.pageNumber, per_page: scope.pagination.per_page});
            };
        }
    };
}

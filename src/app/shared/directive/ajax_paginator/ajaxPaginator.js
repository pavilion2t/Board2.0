export function ajaxPaginator() {
  return {
    restrict: 'E',
      scope: {
        fetchData: '&',
        pagination: '='
      },
      templateUrl: 'shared/directive/ajax_paginator/ajax-pagination.html',
      link: function(scope, elem, attrs) {
        scope.page = 1;
        scope.total_pages = scope.pagination.total_pages;
        scope.previous = function() {
          if (scope.page > 1) {
              scope.page --;
              scope.fetchData({page: scope.page, per_page: scope.pagination.per_page});
          }
        };
      scope.next = function() {
          if (scope.page < scope.pagination.total_pages) {
              scope.page ++;
              scope.fetchData({page: scope.page, per_page: scope.pagination.per_page});
          }
        };
      }
  };
}

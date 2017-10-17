export function gridEmpty($http, $window, $state, AuthFactory) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/shared/grid/grid-empty.html'
  }
}

export function emptyImage() {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      elem.error(function () {
        elem.attr('src', 'assets/images/icons/inventory@2x.png');
      });
    }
  };
}

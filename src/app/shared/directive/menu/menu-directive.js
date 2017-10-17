export function menu(NavigationMenuFactory, $stateParams, $timeout, $location, $rootScope, $state) {
  'ngInject';
  return {
    restrict: 'EA',
    templateUrl: 'app/shared/directive/menu/menu.html',

    replace: true,
    link: function ($scope, element, attrs) {
      $scope.store_id = $stateParams.store_id;
      $scope.menu = NavigationMenuFactory.menu;

      $scope.reload = function (route) {
        $rootScope.extendedView = false;
        if (route.startsWith('/v2')) {
          window.history.pushState({ url: route }, 'Bindo Dashboard', route);
          location.reload();
        }
        //$location.path($scope.store_id + '/' + route);
        //$state.go($state.current.name, $stateParams, { reload: true });
      };
    }
  };
}

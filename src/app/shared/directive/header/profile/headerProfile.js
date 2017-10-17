export function headerProfile($cookies, AuthFactory, $document) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/shared/directive/header/profile/header-profile.html',
    scope: true,
    link: function(scope, elem, attrs) {
      scope.toggleMenu = function(e) {
        e.stopPropagation();
        scope.showHeaderProfileMenu = !scope.showHeaderProfileMenu

        if(scope.showHeaderProfileMenu) {
          $document.on('click.profileMenu', function() {
            scope.$apply(() => {
              scope.showHeaderProfileMenu = false;
            })
            $document.off('click.profileMenu');
          });
        } else {
          $document.off('click.profileMenu');
        }
      };
      scope.logout = AuthFactory.logout;
      scope.$cookies = $cookies;
    }
  }
}

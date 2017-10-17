export function header() {
  return {
    restrict: 'E',
    templateUrl: 'app/shared/directive/header/header.html',
    transclude: true,
    controller: function($scope, $cookies, gettextCatalog) {
      'ngInject';
      $scope.setLang = function(lang) {
        gettextCatalog.setCurrentLanguage(lang);
        $cookies.lang = lang;
      };
    }
  };
}

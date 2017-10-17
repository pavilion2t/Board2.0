export function routerConfig($locationProvider, $urlRouterProvider, $stateProvider) {
  'ngInject';

  // $urlRouterProvider
  //   .rule(function ($injector, $location) {
  //     'ngInject';
  //
  //     var path = $location.path();
  //     // Remove trailing slashes from path
  //     if (path !== '/' && path.slice(-1) === '/') {
  //       $location.replace().path(path.slice(0, -1));
  //     }
  //   });

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('app', {
      abstract: true,
      url: '',
      template: '<div ui-view></div>'
    })

  $urlRouterProvider.when(/^[/]v2/, function ($match, $window) {
    'ngInject';

    return $match.input;
  });

  $urlRouterProvider.otherwise('/login');
}

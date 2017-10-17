export function config($sceDelegateProvider, $routeProvider, $locationProvider, $httpProvider, uiSelectConfig, $stateProvider, $urlRouterProvider) {
  'ngInject';

  $httpProvider.interceptors.push('myHttpInterceptor');

  //Enable cross domain calls
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://localhost:3000**',
    'http://localhost:3001**',
    'http://localhost:3002**',
    'http://0.0.0.0:3000**',
    'http://0.0.0.0:3001**',
    'http://0.0.0.0:3002**',

    'http://trybindo.dev**',
    'http://trybindo.com**',
    'http://bindo.com**',
    'http://api.bindo.com**',
    'http://*.bindo.com**',

    //to allow oAuth via Yelp API in YelpFactory
    'http://api.yelp.com**'
  ]);
  
}

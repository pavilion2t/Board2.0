export function runBlock($stateParams, BackEndFactory, gettextCatalog, $rootScope, $cookies, $location, $http, $window, $state, $timeout, AuthFactory, DashboardFactory) {
  'ngInject';


  // [0] settings before check auth
  BackEndFactory.setApi();

  // [1] auth check on load
  if (!$cookies['access_token']) {
    return $state.go('app.login.main')
    // return $location.url('/login');
  }

  // [2] update default HTTP headers
  AuthFactory.updateHeaders($cookies['access_token']);

  // [3] set default language
  gettextCatalog.setCurrentLanguage($cookies.lang || 'en');

  /*
  // [4] set intercom
  window.Intercom('boot', {
    app_id: "nohg5oi3",
    user_id: $cookies['user_id'],
    email: $cookies['email'],
    name: $cookies['user_name'],
    widget: {
      activator: '#intercom'
    }
  });*/

  $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {

    var storeLength, multiStoreSupport;
    // check support for multi store
    try {
      storeLength = toParams.store_id.split(',').length;
    } catch (e) {
      storeLength = 0;
    }
    try {
      multiStoreSupport = toState.data.multiStoreSupport;
    } catch (e) {
      multiStoreSupport = false;
    }

    if (!multiStoreSupport && storeLength > 1) {
      $rootScope.blocked = true;
      $rootScope.blockedMessage = "multi store not supported in this section";
    } else {
      $rootScope.blocked = false;
      $rootScope.blockedMessage = "";

    }

    // auth check on state change
    var targetIsLogin = toState.name.search('app.login') === 0;
    if (!targetIsLogin && !$cookies['access_token']) {
      AuthFactory.logout();
    }
    // set page header
    var prefix = 'Bindo Dashboard - ';
    if (toState.name === 'app.login.main') {
      $rootScope.title = 'Login';
    } else {

      try {
        var mainStateArray = toState.name.split('.')[1].split('_')[0].split('-');
        var mainState = _.reduce(mainStateArray, function (memo, str) {
          var state = str.charAt(0).toUpperCase() + str.slice(1);
          return memo + ' ' + state;
        }, '');
        var subState = toState.name.split('.')[1].split('_')[1];
        subState = subState ? ' - ' + subState.charAt(0).toUpperCase() + subState.slice(1) : '';

        //[1] generate title from state
        $rootScope.title = mainState + subState;

      } catch (e) {
        //[2] default title if can't generate title from state
        $rootScope.title = 'bindo Dashboard';
      }
    }
    $rootScope.htmlTitle = prefix + $rootScope.title;
  });

}


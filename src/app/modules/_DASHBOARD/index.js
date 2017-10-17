
import { DashboardController } from './dashbaordController';

export default angular
  .module('_DASHBOARD', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.login', { abstract: true, url: '/', templateUrl: 'app/modules/login/login.html', controller: 'LoginController' })
      .state('app.login.main', { url: 'login?token', templateUrl: 'app/modules/login/views/main-login.html', controller: 'LoginMainController' })
      .state('app.login.recover-password', { url: 'recover-password', templateUrl: 'app/modules/login/views/recover-password.html' })
      .state('app.login.recovery-email-sent', { url: 'recovery-email-sent', templateUrl: 'app/modules/login/views/recovery-email-sent.html' })
      .state('app.login.reset-password', { url: 'reset-password', templateUrl: 'app/modules/login/views/reset-password.html' })
      .state('app.login.reset-password-success', { url: 'reset-password/success', templateUrl: 'app/modules/login/views/reset-password-success.html' })

      .state('app.dashboard', {
        url: '/:store_id?layout',
        templateUrl: function (stateParams){
          if (stateParams.layout === 'UIWebView') {
            return 'app/modules/_DASHBOARD/uiwebview.html';

          } else {
            return 'app/modules/_DASHBOARD/dashboard.html';
          }
        },
        controller: 'DashboardController',
        resolve: {
          getStores: function(DashboardFactory,$q,$rootScope, $stateParams) {
            var deferred = $q.defer();
            DashboardFactory.getStores().then(function(data){

              deferred.resolve(data);
            });
            $rootScope.layout = $stateParams.layout;

            return deferred.promise;
          },
          permission: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }

            return DashboardFactory.setupPermission($stateParams.store_id);
          },
          modules : function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.setupSetting($stateParams.store_id);
          }

        }
      })
  })
  .controller('DashboardController', DashboardController)


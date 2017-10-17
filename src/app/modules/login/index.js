import { LoginController, LoginMainController } from './loginController'

export default angular
  .module('login', [])
  // .config(function ($stateProvider) {
  //   'ngInject';
  //
  //   $stateProvider
  //     .state('app.login', { abstract: true, url: '/', templateUrl: 'app/modules/login/login.html', controller: 'LoginController' })
  //     .state('app.login.main', { url: 'login?token', templateUrl: 'app/modules/login/views/main-login.html', controller: 'LoginMainController' })
  //     .state('app.login.recover-password', { url: '/recover-password', templateUrl: 'app/modules/login/views/recover-password.html' })
  //     .state('app.login.recovery-email-sent', { url: '/recovery-email-sent', templateUrl: 'app/modules/login/views/recovery-email-sent.html' })
  //     .state('app.login.reset-password', { url: '/reset-password', templateUrl: 'app/modules/login/views/reset-password.html' })
  //     .state('app.login.reset-password-success', { url: '/reset-password/success', templateUrl: 'app/modules/login/views/reset-password-success.html' })
  // })
  .controller('LoginController', LoginController)
  .controller('LoginMainController', LoginMainController)

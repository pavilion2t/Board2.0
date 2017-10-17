
import { AnswersOptions, inputLimit, inputPhone, WelcomeController } from './welcomeController'

export default angular
  .module('welcome', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.welcome', {url: '/welcome', templateUrl: 'app/modules/welcome/welcome.html', controller: 'WelcomeController'})
  })
  .controller('WelcomeController', WelcomeController)
  .value('AnswersOptions', AnswersOptions)
  .directive('inputLimit', inputLimit)
  .directive('inputPhone', inputPhone)

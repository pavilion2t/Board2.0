
import { ActivatingController } from './activatingController'

export default angular
  .module('activating', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.activating', { url: '/activating', templateUrl: 'app/modules/activating/activating.html', controller: 'ActivatingController' })
  })
  .controller('ActivatingController', ActivatingController)


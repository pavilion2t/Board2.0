
import { SummaryController } from './summaryController'
import { metricsDetail, summaryDatePicker } from './summaryDirective'
import { SummaryFactory } from './summaryFactory'

export default angular
  .module('summary', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.summary', {
        url: '/summary',
        templateUrl: 'app/modules/summary/summary.html',
        controller: 'SummaryController',
        data: {
          multiStoreSupport: true,
        }
      });
  })
  .controller('SummaryController', SummaryController)
  .directive('metricsDetail', metricsDetail)
  .directive('summaryDatePicker', summaryDatePicker)
  .factory('SummaryFactory', SummaryFactory)

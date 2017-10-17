import { LotInquiryController } from './lotInquiryController'
import { LotInquiryFactory } from './lotInquiryFactory'

export default angular
  .module('log_inquiry', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.lot-inquiry', {
        url: '/lot-inquiry?filters',
        templateUrl: 'app/modules/lot_inquiry/lot_inquiry.html',
        controller: 'LotInquiryController'
      })
  })
  .controller('LotInquiryController', LotInquiryController)
  .factory('LotInquiryFactory', LotInquiryFactory)


import { advancedDiscountFormController, advancedDiscountNewController, advancedDiscountViewController, AdvancedDiscountNewItemFactory, DISCOUNT_TYPE, TRIGGER, TIME_RANGE_TYPE, DATE_RANGE_EXCLUDE_TYPE, CHANNELS, SHIP_METHOD, OUTCOMES, STACKTABLE } from './advancedDiscountsController'
import { DiscountFactory } from './discountFactory'
import { DiscountOptionsFactory } from './DiscountOptionsFactory'
import { DiscountsController, DiscountFormItemFactory, DiscountFormController, DiscountViewController, DiscountNewController, GENERAL_DISCOUNT_TYPE } from './discountsController'
import { discountOrderController } from './order'

export default angular
  .module('discounts', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.discounts', {
        abstract: true,
        url: '/discounts',
        template: '<ui-view />',
        resolve: {
          departments: function ($stateParams, DashboardFactory) {
            if (!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getDepartments($stateParams.store_id);
          },
        }
      })
      .state('app.dashboard.discounts.edit_order', {
        url: '/edit_order', templateUrl: 'app/modules/discounts/order.html', controller: 'discountOrderController',
        resolve: {
          grid_data: function ($stateParams, DashboardFactory) {
            if (!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getDiscounts($stateParams.store_id);
          },
        }
      })
      .state('app.dashboard.discounts.index', { url: '?page&count&filters', templateUrl: 'app/modules/discounts/index.html', controller: 'DiscountsController' })
      .state('app.dashboard.discounts.new', { url: '/new', templateUrl: 'app/modules/discounts/new_discount.html', controller: 'DiscountNewController' })
      .state('app.dashboard.discounts.view', { url: '/:discount_id', templateUrl: 'app/modules/discounts/view_discount.html', controller: 'DiscountViewController' })
      .state('app.dashboard.discounts.new_advanced', { url: '/new/advanced', templateUrl: 'app/modules/discounts/new_advanced_discount.html', controller: 'advancedDiscountNewController' })
      .state('app.dashboard.discounts.view_advanced', { url: '/view/advanced/:discount_id', templateUrl: 'app/modules/discounts/view_advanced_discount.html', controller: 'advancedDiscountViewController' })
  })
  .controller('advancedDiscountFormController', advancedDiscountFormController)
  .controller('advancedDiscountNewController', advancedDiscountNewController)
  .controller('advancedDiscountViewController', advancedDiscountViewController)
  .factory('AdvancedDiscountNewItemFactory', AdvancedDiscountNewItemFactory)
  .constant('DISCOUNT_TYPE', DISCOUNT_TYPE)
  .constant('TRIGGER', TRIGGER)
  .constant('TIME_RANGE_TYPE', TIME_RANGE_TYPE)
  .constant('DATE_RANGE_EXCLUDE_TYPE', DATE_RANGE_EXCLUDE_TYPE)
  .constant('CHANNELS', CHANNELS)
  .constant('SHIP_METHOD', SHIP_METHOD)
  .constant('OUTCOMES', OUTCOMES)
  .constant('STACKTABLE', STACKTABLE)
  .factory('DiscountFactory', DiscountFactory)
  .factory('DiscountOptionsFactory', DiscountOptionsFactory)
  .controller('DiscountsController', DiscountsController)
  .factory('DiscountFormItemFactory', DiscountFormItemFactory)
  .controller('DiscountFormController', DiscountFormController)
  .controller('DiscountViewController', DiscountViewController)
  .controller('DiscountNewController', DiscountNewController)
  .constant('GENERAL_DISCOUNT_TYPE', GENERAL_DISCOUNT_TYPE)
  .controller('discountOrderController', discountOrderController)

import { PurchaseOrderFulfillController } from './fulfillController';
import { PurchaseOrderFactory, PurchaseOrderFormatter } from './purchaseOrderFactory';
import { PurchaseOrdersController, PurchaseOrderBaseController, PurchaseOrderNewController, PurchaseOrderViewController, PurchaseOrderFormController, PurchaseOrderROController, PurchaseOrderImportController, MiscChargeController } from './purchaseOrdersController'

export default angular
  .module('purchase_orders', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.purchase-orders', {
        abstract: true,
        url: '/purchase-orders',
        template: '<ui-view />',
        controller: 'PurchaseOrderBaseController',
        resolve: {
          suppliers: function ($stateParams, DashboardFactory) {

            if (!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getSuppliers($stateParams.store_id);
          },

        }
      })
      .state('app.dashboard.purchase-orders.index', { url: '?page&count&filters', templateUrl: 'app/shared/grid/grid_view.html', controller: 'PurchaseOrdersController', data: { multiStoreSupport: true } })
      .state('app.dashboard.purchase-orders.import', { url: '/import', templateUrl: 'app/modules/purchase_orders/import_purchase_order.html', controller: 'PurchaseOrderImportController' })
      .state('app.dashboard.purchase-orders.new', { url: '/new', templateUrl: 'app/modules/purchase_orders/new_purchase_order.html', controller: 'PurchaseOrderNewController', data: { multiStoreSupport: true } })
      .state('app.dashboard.purchase-orders.view', {
        cache: false, url: '/:id', templateUrl: 'app/modules/purchase_orders/view_purchase_order.html', controller: 'PurchaseOrderViewController', data: { multiStoreSupport: true },
        resolve: {
          purchase_order: function ($stateParams, PurchaseOrderFactory, $state) {

            if (!$stateParams.id) {
              return null;
            }

            var store_id = $stateParams.store_id.split(',')[0];
            console.log('store_id', store_id);
            return PurchaseOrderFactory.getPurchaseOrder($stateParams.id, store_id);
          }
        }
      })
      .state('app.dashboard.purchase-orders.view.receive-order', { url: '/:roid', templateUrl: 'app/modules/purchase_orders/view_receive_order.html', controller: 'PurchaseOrderROController' })
  })
  .controller('PurchaseOrderFulfillController', PurchaseOrderFulfillController)
  .factory('PurchaseOrderFactory', PurchaseOrderFactory)
  .factory('PurchaseOrderFormatter', PurchaseOrderFormatter)
  .controller('PurchaseOrdersController', PurchaseOrdersController)
  .controller('PurchaseOrderBaseController', PurchaseOrderBaseController)
  .controller('PurchaseOrderNewController', PurchaseOrderNewController)
  .controller('PurchaseOrderViewController', PurchaseOrderViewController)
  .controller('PurchaseOrderFormController', PurchaseOrderFormController)
  .controller('PurchaseOrderROController', PurchaseOrderROController)
  .controller('PurchaseOrderImportController', PurchaseOrderImportController)
  .controller('MiscChargeController', MiscChargeController)
  .controller('MiscChargeController', MiscChargeController)

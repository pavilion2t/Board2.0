
import { StockTransferController } from './stockTransferController'
import { StockTransferFactory } from './stockTransferFactory'
import { StockTransferNewController } from './stockTransferNewController'
import { StockTransferViewController, ShippingTransferContorller, FulfillingTransferContorller } from './stockTransferViewController'

export default angular
  .module('stock_transfers', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.stock-transfers', {
        abstract: true,
        url: '/stock-transfers',
        template: '<ui-view />',
        resolve: {
          store_transfer: function(DashboardFactory, $q, $stateParams) {
            var deferred = $q.defer();
            DashboardFactory.getChainInfo($stateParams.store_id).success(function(res) {
              try {
                deferred.resolve(res.chain_info.allow_store_transfer.current);

              } catch(e) {
                console.warning(e);
                deferred.resolve([]);
              }

            }).error(function(e) {
              console.log('e', e);
              deferred.resolve(null);
            });

            return deferred.promise;
          },
        }
      })
      .state('app.dashboard.stock-transfers.index', {
        url: '?page&count&filters',
        templateUrl: 'app/modules/stock_transfers/list_stock_transfers.html',
        controller: 'StockTransferController'
      })
      .state('app.dashboard.stock-transfers.new', {
        url: '/new?type',
        templateUrl: 'app/modules/stock_transfers/new_stock_transfer.html',
        controller: 'StockTransferNewController',
      })
      .state('app.dashboard.stock-transfers.view', {
        url: '/:id',
        templateUrl: 'app/modules/stock_transfers/view_stock_transfer.html',
        controller: 'StockTransferViewController'
      })
  })
  .controller('StockTransferController', StockTransferController)
  .controller('StockTransferNewController', StockTransferNewController)
  .factory('StockTransferFactory', StockTransferFactory)
  .controller('StockTransferViewController', StockTransferViewController)
  .controller('ShippingTransferContorller', ShippingTransferContorller)
  .controller('FulfillingTransferContorller', FulfillingTransferContorller)

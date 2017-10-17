
import { InventoryController, InventoryViewController, InventoryQuantityDetailController } from './inventoryController'
import { InventoryFactory } from './inventoryFactory'

export default angular
  .module('inventory', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.inventory', {
        abstract: true,
        url: '/inventory',
        template: '<ui-view />',
        resolve: {
          taxOptions: function($stateParams, TaxOptionsFactory) {
            return TaxOptionsFactory.get(null, $stateParams.store_id);
          },
          departments: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getDepartments($stateParams.store_id);
          },
          brands: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getBrands($stateParams.store_id);
          },
          locales: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getLocales($stateParams.store_id);
          },
          categories: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getCategories($stateParams.store_id);
          },
          suppliers: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getSuppliers($stateParams.store_id);
          },
          attributes: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getAttributes($stateParams.store_id);
          },
          unit_groups: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getUnitGroups($stateParams.store_id);
          }
        },
        data: {
          multiStoreSupport: false
        }
      })
      .state('app.dashboard.inventory.index', {url: '?page&count&filters', templateUrl: 'app/modules/inventory/list_inventory.html', controller: 'InventoryController'})
      .state('app.dashboard.inventory.new-item', {url: '/new/item', templateUrl: 'app/modules/inventory/new_inventory.html', controller: 'InventoryViewController'})
      .state('app.dashboard.inventory.new-custom-item', {url: '/new/custom_item', templateUrl: 'app/modules/inventory/new_inventory.html', controller: 'InventoryViewController'})
      .state('app.dashboard.inventory.view', {url: '/:listing_id?selected_store_id', templateUrl: 'app/modules/inventory/view_inventory.html', controller: 'InventoryViewController'})
  })
  .controller('InventoryController', InventoryController)
  .controller('InventoryViewController', InventoryViewController)
  .controller('InventoryQuantityDetailController', InventoryQuantityDetailController)
  .factory('InventoryFactory', InventoryFactory)

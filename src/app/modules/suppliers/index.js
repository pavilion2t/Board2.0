
import { SupplierFactory } from './supplierFactory'
import { SuppliersController, SupplierViewController, SupplierNewController } from './suppliersController'

export default angular
  .module('suppliers', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.suppliers', {abstract: true, url: '/suppliers', template: '<ui-view />'})
      .state('app.dashboard.suppliers.index', {url: '?page&count&filters', templateUrl: 'app/shared/grid/grid_view.html', controller: 'SuppliersController'})
      .state('app.dashboard.suppliers.new', {url: '/new', templateUrl: 'app/modules/suppliers/new_supplier.html', controller: 'SupplierNewController'})
      .state('app.dashboard.suppliers.view', {url: '/:supplier_id', templateUrl: 'app/modules/suppliers/view_supplier.html', controller: 'SupplierViewController'})
  })
  .factory('SupplierFactory', SupplierFactory)
  .controller('SuppliersController', SuppliersController)
  .controller('SupplierViewController', SupplierViewController)
  .controller('SupplierNewController', SupplierNewController)

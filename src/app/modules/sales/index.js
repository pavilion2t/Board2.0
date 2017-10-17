import { SaleFactory } from './saleFactory'
import { SalesController, SaleViewController, itemStatus } from './salesController'


export default angular
  .module('sales', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.sales', {abstract: true, url: '/sales', template: '<ui-view />'})
      .state('app.dashboard.sales.index', {url: '?page&count&filters', templateUrl: 'app/shared/grid/grid_view.html', controller: 'SalesController'})
      .state('app.dashboard.sales.view', {url: '/:number', templateUrl: 'app/modules/sales/view_sale.html', controller: 'SaleViewController'})
  })
  .factory('SaleFactory', SaleFactory)
  .controller('SalesController', SalesController)
  .controller('SaleViewController', SaleViewController)
  .directive('itemStatus', itemStatus)


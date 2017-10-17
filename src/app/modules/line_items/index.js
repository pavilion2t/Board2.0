
import { LineItemFactory } from './lineItemFactory'
import { LineItemViewController, LineItemsController } from './lineItmesController'

export default angular
  .module('line_items', [])
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('app.dashboard.line-items', { abstract: true, url: '/line-items', template: '<ui-view />' })
      .state('app.dashboard.line-items.index', { url: '?page&count&filters', templateUrl: 'app/shared/grid/grid_view.html', controller: 'LineItemsController' })
      .state('app.dashboard.line-items.view', { url: '/:code?order', templateUrl: 'app/modules/line_items/view_line_item.html', controller: 'LineItemViewController' })
  }])
  .factory('LineItemFactory', LineItemFactory)
  .controller('LineItemViewController', LineItemViewController)
  .controller('LineItemsController', LineItemsController)

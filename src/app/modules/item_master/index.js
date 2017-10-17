
import { ItemMasterController, ItemMasterViewController } from './itemMasterController'
import { ItemMasterFactory } from './itemMasterFactory'

export default angular
  .module('item_master', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.item-master', {
        abstract: true,
        url: '/item-master',
        template: '<ui-view />'
      })
      .state('app.dashboard.item-master.index', {url: '?page&count&filters', templateUrl: 'app/modules/item_master/list_itemMaster.html', controller: 'ItemMasterController'})
      .state('app.dashboard.item-master.view', {url: '/:listing_id', templateUrl: 'app/modules/item_master/view_itemMaster.html', controller: 'ItemMasterViewController'})
  })
  .controller('ItemMasterController', ItemMasterController)
  .controller('ItemMasterViewController', ItemMasterViewController)
  .factory('ItemMasterFactory', ItemMasterFactory)

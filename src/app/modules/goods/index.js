
import { GoodsController, GoodsViewController } from './goodsController'
import { GoodsFactory } from './goodsFactory'

export default angular
  .module('goods', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.goods', {abstract: true, url: '/goods', template: '<ui-view />', resolve : {note_type:function(){return "goods";}}})
      .state('app.dashboard.goods.index', {url: '?page&count&filters', templateUrl: 'app/modules/goods/list_goods.html', controller: 'GoodsController'})
      .state('app.dashboard.goods.new', {url: '/new', templateUrl: 'app/modules/goods/view_goods.html', controller: 'GoodsViewController',
        resolve : {
          suppliers: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getSuppliers($stateParams.store_id);
          }
        }})
      .state('app.dashboard.goods.view', {url: '/:id', templateUrl: 'app/modules/goods/view_goods.html', controller: 'GoodsViewController',
        resolve : {
          suppliers: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getSuppliers($stateParams.store_id);
          }
        }})
      .state('app.dashboard.returnnote', {abstract: true, url: '/returnnote', template: '<ui-view />', resolve : {note_type:function(){return "return";}}})
      .state('app.dashboard.returnnote.index', {url: '?page&count&filters', templateUrl: 'app/modules/goods/list_goods.html', controller: 'GoodsController'})
      .state('app.dashboard.returnnote.new', {url: '/new', templateUrl: 'app/modules/goods/view_goods.html', controller: 'GoodsViewController',
        resolve : {
          suppliers: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getSuppliers($stateParams.store_id);
          }
        }})
      .state('app.dashboard.returnnote.view', {url: '/:id', templateUrl: 'app/modules/goods/view_goods.html', controller: 'GoodsViewController',
        resolve : {
          suppliers: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getSuppliers($stateParams.store_id);
          }
        }})
  })
  .controller('GoodsController', GoodsController)
  .controller('GoodsViewController', GoodsViewController)
  .factory('GoodsFactory', GoodsFactory)

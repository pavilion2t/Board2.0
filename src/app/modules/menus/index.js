import { MenuController, MenuViewController } from './menuController'
import { MenuFactory } from './MenuFactory'

export default angular
  .module('menus', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.menus', {abstract: true, url: '/menus', template: '<ui-view />'})
      .state('app.dashboard.menus.index', {url: '', templateUrl: 'app/modules/menus/list_menus.html', controller: 'MenuController'})
      .state('app.dashboard.menus.view', {url: '/:id', templateUrl: 'app/modules/menus/view_menu.html', controller: 'MenuViewController'})
  })
  .controller('MenuController', MenuController)
  .controller('MenuViewController', MenuViewController)
  .factory('MenuFactory', MenuFactory)

import { ModifierFactory } from './modifierFactory'
import { ModifiersSetController, ModifierSetViewController, modifierSetForm } from './modifiersController'

export default angular
  .module('modifiers', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.modifiers', {
        abstract: true,
        url: '/modifiers',
        template: '<ui-view />',
        resolve: {
          departments: function($stateParams, DashboardFactory) {
            if(!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getDepartments($stateParams.store_id);
          },
        }
      })
      .state('app.dashboard.modifiers.index', {url: '?page&count&filters', templateUrl: 'app/modules/modifiers/list_modifiers.html', controller: 'ModifiersSetController'})
      .state('app.dashboard.modifiers.new', {url: '/new', templateUrl: 'app/modules/modifiers/new_modifierset.html', controller: 'ModifierSetViewController'})
      .state('app.dashboard.modifiers.view', {url: '/:modifier_set_id', templateUrl: 'app/modules/modifiers/view_modifierset.html', controller: 'ModifierSetViewController'})

    /*
     .state('app.dashboard.modifiers.new', {url: '/new', templateUrl: 'app/modules/modifiers/new_modifier.html', controller: 'ModifierNewController'})
     .state('app.dashboard.modifiers.view', {url: '/:modifier_set_id', templateUrl: 'app/modules/modifiers/view_modifier.html', controller: 'ModifierViewController'})
     */
  })
  .controller('ModifiersSetController', ModifiersSetController)
  .controller('ModifierSetViewController', ModifierSetViewController)
  .directive('modifierSetForm', modifierSetForm)
  .factory('ModifierFactory', ModifierFactory)

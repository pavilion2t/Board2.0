
import { MembershipController, MembershipViewController, MembershipNewController } from './membershipController'
import { MembershipFactory } from './MembershipFactory'

export default angular
  .module('membership', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.membership', {abstract: true, url: '/membership', template: '<ui-view />'})
      .state('app.dashboard.membership.index', {url: '?page&count&filters', templateUrl: 'app/shared/grid/grid_view.html', controller: 'MembershipController'})
      .state('app.dashboard.membership.new', {url: '/new', templateUrl: 'app/modules/membership/membership.html', controller: 'MembershipNewController'})
      .state('app.dashboard.membership.view', {url: '/:id', templateUrl: 'app/modules/membership/membership.html', controller: 'MembershipViewController'})

  })
  .controller('MembershipController', MembershipController)
  .controller('MembershipViewController', MembershipViewController)
  .controller('MembershipNewController', MembershipNewController)
  .factory('MembershipFactory', MembershipFactory)

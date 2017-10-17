
import { CustomersController, CustomerViewController, CustomerNewController } from './customersController'
import { CustomerFactory } from './customerFactory'

export default angular
  .module('customers', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.customers', { abstract: true, url: '/customers', template: '<ui-view />' })
      .state('app.dashboard.customers.index', {
        url: '?page&count&filters', templateUrl: 'app/modules/customers/customer_grid_view.html', controller: 'CustomersController',
        resolve: {
          membershipLevels: function ($stateParams, CustomerFactory) {
            console.log($stateParams.store_id);
            return CustomerFactory.getMembershipLevels($stateParams.store_id);
          }
        }
      })
      .state('app.dashboard.customers.new', { url: '/new', templateUrl: 'app/modules/customers/view_customer.html', controller: 'CustomerNewController' })
      .state('app.dashboard.customers.view', { url: '/:customer_id', templateUrl: 'app/modules/customers/view_customer.html', controller: 'CustomerViewController' })
  })
  .controller('CustomersController', CustomersController)
  .controller('CustomerViewController', CustomerViewController)
  .controller('CustomerNewController', CustomerNewController)
  .factory('CustomerFactory', CustomerFactory)

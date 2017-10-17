export function addCustomer() {
  return {
    restrict: 'E',
    templateUrl: "app/shared/directive/add_customer/add_customer_button.html",
    scope: {
      customerId: '=',
      customerName: '='
    },
    controller: function (ngDialog, $scope) {
      'ngInject';
      $scope.open = function () {

        ngDialog.open({
          template: 'app/shared/directive/add_customer/add_customer_popup.html',
          className: 'ngdialog-theme-default ngdialog-theme-mega',
          controller: 'AddCustomer',
          scope: $scope,

        }).closePromise.then(function (response) {

          $scope.customerId = response.value.id;
          $scope.customerName = response.value.name;
        });

      };
    }
  };
}

export class AddCustomer {
  constructor(messageFactory, AddCustomerFactory, DashboardFactory, $scope) {
    'ngInject';
    $scope.searchCustomer = function (keyword) {
      if (typeof keyword !== 'undefined' && keyword !== null && keyword !== '') {
        $scope.customers = [];
        AddCustomerFactory.getCustomer(keyword).success(function (data) {
          $scope.customers = [];
          _.each(data, function (value) {
            $scope.customers.push(value.customer);
          })
          console.log($scope.customers);
        });
      }
    };
    $scope.select = function (customer) {

      $scope.closeThisDialog(customer);
    };
  }
}


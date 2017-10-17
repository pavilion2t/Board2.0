export class ActivatingController{
  constructor($state, $stateParams, $scope, $rootScope, $http, DashboardFactory) {
    'ngInject';

    // check activate
    if (DashboardFactory.getCurrentStore().pos_active) {
      $state.go('app.dashboard.summary', $stateParams);
      return;
    }


    $scope.updatingContact = false;
    $scope.contact = {
      email: DashboardFactory.getCurrentStore().email,
      phone: DashboardFactory.getCurrentStore().phone
    };
    $scope.newContact = {
    };

    $scope.updateContact = function () {
      $scope.updatingContact = true;
      $scope.newContact = _.clone($scope.contact);
    };
    $scope.cancelUpdate = function () {
      $scope.updatingContact = false;
    };
    $scope.confirmUpdate = function (newContact) {
      if (newContact.phone && newContact.email) {
        $scope.attention = false;
        $scope.contact = {
          phone: newContact.phone,
          email: newContact.email
        };
        $scope.updatingContact = false;
        $scope.saveContact($scope.contact);
      } else {
        $scope.attention = true;
      }
    };
    $scope.saveContact = function (contact) {
      $http.put($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId(), { store_attributes: $scope.contact })
        .success(function (data){
        })
        .error(function (err) {
          console.error(err);
        });
    };
  }
}

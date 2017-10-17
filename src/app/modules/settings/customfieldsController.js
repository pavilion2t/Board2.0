export class CustomfieldsController {
  constructor($rootScope, $scope, $http, CommonFactory, DashboardFactory, CustomfieldFactory) {
    'ngInject';

    $scope.alert = function() {
      CustomfieldFactory.getFields()
    };

  }
}

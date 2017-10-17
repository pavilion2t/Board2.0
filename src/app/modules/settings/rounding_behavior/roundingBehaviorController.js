export class RoundingBehaviorController {
  constructor(RoundingBehaviorFactory, $scope, $rootScope, $state, $stateParams, DashboardFactory, FormatterFactory, ItemMasterFactory, gettextCatalog) {
    'ngInject';

    $scope.store = null;
    $scope.original_store = null;
    RoundingBehaviorFactory.getStore().then(function(data){
      $scope.store = data.data.module;
      $scope.original_store = angular.copy($scope.store);
    });

    $scope.cancel = function(){
      if(confirm('Discard all changes?')) {
        $scope.store = angular.copy($scope.original_store);
      }
    };

    $scope.save = function(){

      RoundingBehaviorFactory.updateStore($scope.store).then(function(data) {
        $scope.original_store = angular.copy($scope.store);
      });

    };


  }
}

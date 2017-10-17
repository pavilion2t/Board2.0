export class PolicyController {
  constructor(PolicyFactory, $scope) {
    'ngInject';

    $scope.store = {};
    $scope.original_store = {};
    PolicyFactory.getStore().success(function(data){

      $scope.store.highlight = data.store.highlight;
      $scope.store.policy = data.store.policy;
      $scope.original_store = angular.copy($scope.store);
    });

    $scope.cancel = function(){
      if(confirm('Discard all changes?')) {
        $scope.store = angular.copy($scope.original_store);
      }
    };

    $scope.save = function(){

      PolicyFactory.updateStore($scope.store).success(function(data) {
        $scope.original_store = angular.copy($scope.store);
      }).error(function(err){
        console.error(err);
        $scope.errorMessage = err.message;
      });

    };


  }
}

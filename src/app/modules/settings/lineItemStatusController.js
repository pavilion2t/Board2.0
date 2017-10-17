export class LineItemStatusController {
  constructor($scope, $http, CommonFactory, DashboardFactory, LineItemStatusFactory) {
    'ngInject';

    $scope.getStatus = function(){
      LineItemStatusFactory.getStatus().success(function(res) {
        try {
          $scope.statusList = res.data.line_item_statuses;
        } catch(e) {
          console.error('broken status list data');
        }
      });
    };
    $scope.createStatus = function() {
      LineItemStatusFactory.createStatus($scope.newStatus).success(function(){
        $scope.getStatus();
        $scope.newStatus = '';
      }).error(_handleError);
    };
    $scope.deleteStatus = function(id) {
      LineItemStatusFactory.deleteStatus(id).success(function(){
        $scope.getStatus();
      }).error(_handleError);
    };

    $scope.getStatus();

    var _handleError = function(res){
      if(res.message) {
        alert(res.message);

        // TODO: Better message
      }
    };
  }
}

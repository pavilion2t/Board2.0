/**
 * Created by Alan Tang on 2/13/2017.
 */
/**
 * Created by Alan Tang on 2/13/2017.
 */
export function StoreSelectionFactory($rootScope, $http, DashboardFactory, CommonFactory, messageFactory) {
  'ngInject';

  var getChainMembers = function(store_id) {
    store_id = store_id || DashboardFactory.getStoreId();
    console.log('store_id', store_id);
    return $http.get($rootScope.api + '/api/v2/stores/' +  store_id + '/chain_members');
  };

  return {
    getChainMembers: getChainMembers
  };

}
export function storeSelection() {
  return {
    restrict: 'E',
    template: "" +
    '<input-select ng-disabled="disabled" ng-click="open" value="storesNames" placeholder="placeholder"></input-select>',
    transclude: true,
    scope: {
      storeIds: '=',
      callbackItem: '=',
      disabled: '=',
      title: '@'
    },
    controller: function(StoreSelectionFactory, ngDialog, $scope) {
      'ngInject';


      $scope.placeholder = 'select stores';
      $scope.storesNames = '';
      $scope.storeIdMap = {};
      $scope.storesName = [];

      StoreSelectionFactory.getChainMembers().then(function(data) {
        $scope.members = data.data;
        $scope.updateData();
      });

      $scope.$watch('storeIds',function(){
        $scope.updateData();
      },true);

      $scope.updateData = function(){
        var members = $scope.members;
        if ( $scope.storeIds ) {
          for (var k = 0; k < $scope.storeIds.length; k++) {
            $scope.storeIdMap[$scope.storeIds[k]] = true;
          }
        }
        $scope.storesName.length = 0;
        if ( members ){
	        for ( var i = 0; i < members.length; i ++ ){
	
	          var member = members[i].chain_member;
	          if ( $scope.storeIdMap[member.id] ) {
	            $scope.storesName.push(member.title);
	          }
	        }
        }
        $scope.storesNames = $scope.storesName.join(', ');
      };


      $scope.open = function() {

        ngDialog.open({
          templateUrl: 'app/shared/directive/store_selection/store.html',
          className: 'ngdialog-theme-default ngdialog-theme-mega',
          controller: 'StoreSelect',
          scope: $scope,

        }).closePromise.then(function (response) {
          $scope.storeIds = response.value;
          $scope.updateData();

          if ( $scope.onClose ) {

            $scope.onClose(response, $scope.callbackItem);

          }

        });

      };
    }
  };
}
export class StoreSelect {
  constructor(StoreSelectionFactory, DashboardFactory, $scope) {
    'ngInject';
    $scope.storeIds = $scope.$parent.storeIds;
    $scope.title = $scope.$parent.title;
    $scope.searching = true;
    $scope.storeIdMap = {};
    $scope.selectStore = function(store){
      store._selected = !store._selected;

      $scope.selectedAll = true;
      for (var k = 0; k < $scope.stores.length; k++) {
        if ( !$scope.stores[k]._selected ){
          $scope.selectedAll = false;
          break;
        }
      }
    };

    $scope.selectAll = function(){
      for (var k = 0; k < $scope.stores.length; k++) {
        $scope.stores[k]._selected = !$scope.selectedAll;
      }
      $scope.selectedAll = !$scope.selectedAll;

    };
    if ( $scope.storeIds ) {
      for (var k = 0; k < $scope.storeIds.length; k++) {
        $scope.storeIdMap[$scope.storeIds[k]] = true;
      }
    }
    $scope.stores = [];
    StoreSelectionFactory.getChainMembers().then(function(data){
      var members = data.data;

      for ( var i = 0; i < members.length; i ++ ){
        var member = members[i].chain_member;
        var selected = $scope.storeIdMap[member.id];

        $scope.stores.push({name:member.title, id:member.id, _selected:selected});
      }
      $scope.searching = false;
    });

    $scope.confirm = function() {
      $scope.storeIds = [];
      for ( var i = 0; i < $scope.stores.length; i ++ ){
        if ( $scope.stores[i]._selected ) {
          $scope.storeIds.push($scope.stores[i].id);
        }
      }
      $scope.closeThisDialog($scope.storeIds);
    };

  }
}

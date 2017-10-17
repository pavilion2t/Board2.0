export function addMaterial() {
  return {
    restrict: 'E',
    template: "<button class='_add' ng-click='open()'>{{'Add '+name}}</button>",
    transclude: true,
    scope: {
      onClose: '=',
      takenIds: '=?',
      storeId: '=',
      singleSelect: '=',
      supplier: '=',
      type: '@',
    },
    controller: function($scope, AddMaterialFactory) {
      'ngInject';
      $scope.open = function(){
        AddMaterialFactory.open($scope, $scope.type);
      };
      if ( $scope.type === '0' ){
        $scope.name = 'Inventory';
      }
      else {
        $scope.name = 'Material';
      }
    }
  };
}

export function AddMaterialFactory(ngDialog, $http, $rootScope, DashboardFactory) {
  'ngInject';

  var factory = {};
  factory.open = function($scope, type) {
    factory.type = type;
    ngDialog.open({
      templateUrl: 'app/shared/directive/add_material/add_material.html',
      className: 'ngdialog-theme-default ngdialog-theme-mega',
      controller: 'AddMaterial',
      scope: $scope

    }).closePromise.then( function (response) {
        if ( $scope.onClose ) {
          $scope.onClose(response);
        }

      });

  };


  factory.getMaterial = function(keyword, page, store_id, type) {
    if ( !page ){
      page = 1;
    }
    store_id = store_id || DashboardFactory.getStoreId();
    console.log('store_id', store_id);
    var keywordFilter = '';
    if ( keyword ){
      keywordFilter = '&filters[]=name__contain__'+encodeURIComponent(keyword);
    }
    return $http.get($rootScope.api + '/api/v2/stores/' +  store_id + '/listings?bom_type='+type+keywordFilter+'&order_by=name&page='+page+'&per_page=25');
  };

  return factory;

}

export class AddMaterial {
  constructor(messageFactory, AddMaterialFactory, DashboardFactory, $scope, $rootScope, $stateParams, $http ) {
    'ngInject';
    $scope.factory = AddMaterialFactory;
    $scope.keyword = "";
    $scope.page = 1;
    $scope.searching = true;
    $scope.search = function(){
      $scope.searching = true;
      AddMaterialFactory.getMaterial($scope.keyword, $scope.page, DashboardFactory.getStoreId() ).then(function(data){

        var rawData = data.data;
        $scope.searching = false;
        $scope.bom = _.map(rawData,function(data){
          data.listing._selected = false;
          return data.listing;
        });
      });
    };

    AddMaterialFactory.getMaterial(null, $scope.page, DashboardFactory.getStoreId(), AddMaterialFactory.type ).then(function(data){
      $scope.searching = false;

      var rawData = data.data;
      $scope.bom = _.map(rawData,function(data){
        data.listing._selected = false;
        return data.listing;
      });
    });

    $scope.confirm = function(){

      var selectedItem = [];
      _.each($scope.bom, function(value){
        if ( value._selected ){
          selectedItem.push(value);
        }
      });
      $scope.closeThisDialog(selectedItem);
    };
    $scope.selectOrder = function(item){
      item._selected = !item._selected;
    }
    $scope.previous = function(){
      if ( $scope.page > 1 ){
        $scope.page--;
        $scope.search();
      }
    };
    $scope.next = function(){

      $scope.page++;
      $scope.search();

    };


  }
}

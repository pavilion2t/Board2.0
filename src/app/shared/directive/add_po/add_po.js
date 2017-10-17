export function addPo() {
  return {
    restrict: 'E',
    template: "<button class='_add' ng-click='open()'>{{'Add PO'|translate}}</button>",
    transclude: true,
    scope: {
      onClose: '=',
      takenIds: '=?',
      storeId: '=',
      singleSelect: '=',
      supplier: '='
    },
    controller: function($scope, AddPOFactory) {
      'ngInject';
      $scope.open = function(){
        AddPOFactory.open($scope);
      };

    }
  };
}

export function AddPOFactory(ngDialog) {

  'ngInject';
  var factory = {};
  factory.open = function($scope) {

    ngDialog.open({
      templateUrl: 'app/shared/directive/add_po/add_po.html',
      className: 'ngdialog-theme-default ngdialog-theme-mega new-grn-from-po',
      controller: 'AddPO',
      scope: $scope

    }).closePromise.then( function (response) {
        if ( $scope.onClose ) {
          $scope.onClose(response);
        }

      });

  };

  return factory;

}

export class AddPO {
  constructor(messageFactory, AddListingFactory, DashboardFactory, $scope, $rootScope, $stateParams, $http ) {
    'ngInject';
    DashboardFactory.getSuppliers().then(function(data){
      $scope.suppliers = data;
    });

    $scope.search = {};

    console.log($scope.takenIds);

    $scope.takenIdsMap = {};
    _.each($scope.takenIds,function(val){
      $scope.takenIdsMap[val] = true;
    });

    $scope.statusOptions = [
      {label:'All',value: ''},
      // {label:'Created',value: 'pending'},
      {label:'Submitted',value: 'submitted'},
      {label:'Partial Fulfilled', value: 'partially_fulfilled'},
      {label:'Fulfilled',value: 'fulfilled'},
      // {label:'Cancelled',value: 'canceled'}
      ];
    $scope.search.status = $scope.statusOptions[0];
    $scope.search.number = '';
    $scope.search.supplier = null;
    if ( $scope.supplier ){
      $scope.search.supplier = $scope.supplier;
    }

    $scope.page = 1;

    $scope.searchPO = function(newSearch){
      if ( newSearch ){
        $scope.page = 1;
      }
      $scope.route = $rootScope.gateway + '/v2/purchase_orders?page='+$scope.page+'&per_page=25&store_ids=' + $stateParams.store_id;

      var filters = [];

      if (  $scope.search.number && $scope.search.number !== '' ){
        filters.push('filters%5B%5D=number__contain__'+$scope.search.number);
      }
      if ( $scope.search.supplier !== null ){
        filters.push('filters%5B%5D=supplier_name__contain__'+$scope.search.supplier.name);
      }
      if ( $scope.search.status.value !== '' ){
        filters.push('filters%5B%5D=state__equal__'+$scope.search.status.value);
      }
      if ( filters.length > 0 ) {
        $scope.route = $scope.route + '&' + filters.join('&');
      }


      $http.get($scope.route).success(function(data){
        $scope.purchase_orders = _.filter(data, d => {
          let state = _.get(d, 'purchase_order.state');
          return state === 'submitted' || state === 'partially_fulfilled' || state === 'fulfilled';
        });
        _.each($scope.purchase_orders, function(value){
          value.purchase_order.selected = false;
        });
      });

    };
    $scope.previous = function(){
      if ( $scope.page > 1 ){
        $scope.page--;
        $scope.searchPO();
      }
    };
    $scope.next = function(){

      $scope.page++;
      $scope.searchPO();

    };
    $scope.selectOrder = function(order){

      if ( $scope.singleSelect ) {
        _.each($scope.purchase_orders, function(value){
          value.purchase_order.selected = false;
        });
        order.purchase_order.selected = true;
      }
      else {
        order.purchase_order.selected = !order.purchase_order.selected;
      }
    };

    $scope.confirm = function(){

      var selectedPurchaseOrder = [];
      _.each($scope.purchase_orders, function(value){
        if ( value.purchase_order.selected ){
          selectedPurchaseOrder.push(value);
        }
      });
      $scope.closeThisDialog(selectedPurchaseOrder);
    };



  }
}

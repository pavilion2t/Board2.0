export function addListingsInputSelect() {
  return {
    restrict: 'E',
    template: '<input-select ng-disabled="isDisabled" ng-click="open" value="value" placeholder="placeholder"></input-select> ',
    scope: {
      isDisabled: '=ngDisabled',
      placeholder: '=placeholder',
      fetchList: '=fetchList',
      close: '=close',
      hiddenValue: '=hiddenValues',
      isSearch: '=showSearch',
      search: '=search',
      title: '=title'

    },
    controller: function(ngDialog, $scope) {

      //clear checked
      $scope.$watch('isDisabled', function(oldVal, newVal){
        if(newVal){
          angular.forEach($scope.fetchList, function(itm){
            itm.selected = false;
          });
        }
      });

      $scope.$watch('[hiddenValue, fetchList]', function(oldVal, newVal){

        if(typeof $scope.hiddenValue === "undefined" || $scope.hiddenValue.length === 0) return;

        var display_value = [];

        _.forEach($scope.fetchList, function(list){

          _.forEach($scope.hiddenValue, function(id){
            var cid = list.product_id ? list.product_id : list.id;
            if(cid === id){
              list.selected = true;
              display_value.push(list.name);
            }
          });

          $scope.value = display_value.join(', ');

        });

      }, true);


      $scope.open = function(){

        ngDialog.open({

          template: 'app/shared/directive/add_listings/add_listings_input_select.html',
          className: 'ngdialog-theme-defaut ngdialog-theme-mega width-42p',
          controller: 'addListingsInputSelect',
          scope: $scope

        }).closePromise.then(function (response) {
          if(response.value === null || typeof response.value === "undefined" || response.value === '$closeButton'){
            return;
          }

          if(typeof $scope.close !== "undefined")
            $scope.close(response.value);
        });
      };
    }
  };
}
export class addListingsInputSelectController {
  constructor(DashboardFactory, $scope, $timeout) {
    'ngInject';
    $scope.searchListings = function(keyword) {
      $scope.searching = true;
      $scope.addErrorMessage = '';
      $scope.$parent.search(keyword)
        .then(function(data) {
          $scope.lists = $scope.lists || []
          $scope.lists = $scope.lists.concat(data);
          $scope.lists = _.uniq($scope.lists, 'product_id');
          $scope.fetchList = data;
          $scope.searching = false;
        })

    };

    // if(typeof $scope.$parent.search === "undefined"){
    if($scope.$parent.fetchList) {
      $scope.lists = angular.copy($scope.$parent.fetchList);
    }
    //}


    $scope.isAllSelected = false;

    $scope.toggleAll = function() {
      $scope.isAllSelected = !$scope.isAllSelected;
      angular.forEach($scope.lists, function(itm){ itm.selected = $scope.isAllSelected; });
      if(!$scope.isAllSelected) $scope.isEnablingSaveButton = false;
    };

    $scope.$watch('lists', function(newVal, oldVal){
      angular.forEach(newVal, function(itm){
        if(itm.selected){
          $scope.isEnablingSaveButton = true;
          return false;
        }
      });
    }, true);


    $scope.add = function() {


      //$scope.onlyDepartments += value.name + ", ";

      var lists = _.filter($scope.lists, function(itm){
        return itm.selected;
      });

      $scope.$parent.value = "";
      $scope.$parent.hiddenValue = [];
      var display_value = [];
      angular.forEach(lists, function(value, key) {
        var id = value.product_id ? value.product_id : value.id;
        $scope.$parent.hiddenValue.push(id);
        display_value.push(value.name);

      });

      $scope.$parent.value = display_value.join(', ');


      //save only when click save button
      angular.copy($scope.lists ,$scope.$parent.fetchList);
      $scope.closeThisDialog(lists);

    };


  }
}

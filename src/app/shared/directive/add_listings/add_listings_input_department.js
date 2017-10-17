export function addListingsInputSelectDepartment() {
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
      'ngInject';
      //clear checked
      $scope.$watch('isDisabled', function(oldVal, newVal){
        if(newVal){
          angular.forEach($scope.fetchList, function(itm){
            itm.selected = false;
          });
        }
      });

      $scope.$watch('[hiddenValue, fetchList]', function(oldVal, newVal){

        function iterate(lists){
          _.forEach(lists, function(list){
            _.forEach($scope.hiddenValue, function(id){
              var cid = list.id;

              if(cid === id){
                list.selected = true;
                display_value.push(list.name);
              }
            });

            if(!list._children || list._children.length > 0){
              iterate(list._children);
            }

          });
        }

        if(typeof $scope.hiddenValue === "undefined" || $scope.hiddenValue.length === 0) return;

          var display_value = [];
          iterate($scope.fetchList);
          $scope.value = display_value.join(', ');

      }, true);


      $scope.open = function(){

        ngDialog.open({

          template: 'app/shared/directive/add_listings/add_listings_input_department.html',
          className: 'ngdialog-theme-defaut ngdialog-theme-mega width-42p',
          controller: 'addListingsInputSelectDepartment',
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

export class addListingsInputSelectDepartmentController {
  constructor(DashboardFactory, $scope, $timeout) {
    'ngInject';
    $scope.searchListings = function(keyword) {
      $scope.searching = true;
      $scope.addErrorMessage = '';
      $scope.$parent.search(keyword)
        .then(function(data) {
          $scope.listedDepartments = data;
          $scope.fetchList = data;
          $scope.searching = false;
        })

    };
    console.log('$scope.$parent.fetchList', $scope.$parent.fetchList);
    // if(typeof $scope.$parent.search === "undefined"){
    $scope.listedDepartments = angular.copy($scope.$parent.fetchList);
    //}


    $scope.isAllSelected = false;

    $scope.toggleAll = function() {
      $scope.isAllSelected = !$scope.isAllSelected;
      angular.forEach($scope.listedDepartments, function(itm){ itm.selected = $scope.isAllSelected; });
      if(!$scope.isAllSelected) $scope.isEnablingSaveButton = false;
    };

    $scope.$watch('listedDepartments', function(newVal, oldVal){
      angular.forEach(newVal, function(itm){
        if(itm.selected){
          $scope.isEnablingSaveButton = true;
          return false;
        } else{
          itm['selected'] = false;
        }
      });
    }, true);



    $scope.add = function() {
      var lists = [];
      function filter(l){

        _.forEach(l, function(itm){
          if(itm.selected){
            lists.push(itm);
          }
          if(itm._children.length > 0){
            filter(itm._children);
          }
        });

      }

      filter($scope.listedDepartments);

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
      angular.copy($scope.listedDepartments ,$scope.$parent.fetchList);
      $scope.closeThisDialog(lists);

    };


  }
}

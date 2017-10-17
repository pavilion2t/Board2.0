export default angular
  .module('select_discounts', [])
  .directive('selectDiscount', function () {
    return {
      restrict: 'E',
      template: '<input-select ng-disabled="isDisabled" ng-click="open" value="value" placeholder="placeholder"></input-select>',
      transclude: true,
      scope: {
        selectedIds: '=selectedIds',
        isDisabled: '=ngDisabled',
        placeholder: '=placeholder',
        fetchList: '=fetchList',
        close: '=close',
        hiddenValue: '=hiddenValue',
        onlyAdvance: '=onlyAdvance'
      },
      controller: function (ngDialog, $scope) {
        'ngInject';
        function updateValue() {
          if ($scope.hiddenValue) return '';
          var display_value = $scope.fetchList.filter(d => $scope.selectedIds.indexOf(d.id) > -1).map(d => d.name);
          $scope.value = display_value.join(', ');
        }

        updateValue();
        $scope.$watchCollection('selectedIds', updateValue, true);
        $scope.$watch('fetchList', updateValue, true);
        $scope.$watch('hiddenValue', updateValue);

        $scope.open = function () {
          ngDialog.open({
            template: 'app/shared/directive/select_discounts/select_discounts.html',
            className: 'ngdialog-theme-default ngdialog-theme-mega  width-42p',
            controller: 'SelectDiscount',
            scope: $scope,
          }).closePromise.then(function (response) {
            if (!response.value || response.value === "$closeButton" || response.value === "$document") {
              return
            }
            $scope.selectedIds = response.value.map(d => d.id);
            var display_value = $scope.fetchList.filter(d => $scope.selectedIds.indexOf(d.id) > -1).map(d => d.name);
            $scope.value = display_value.join(', ');
            // $scope.close($scope.selectedIds);
          });
        };
      }
    };
  })
  .controller('SelectDiscount', function (messageFactory, DashboardFactory, $scope) {
    'ngInject';
    var storeId = DashboardFactory.getStoreId();
    var selectedIds = $scope.$parent.selectedIds || [];
    let all = $scope.$parent.fetchList.slice();
    $scope.allDiscounts = $scope.$parent.onlyAdvance ? all.filter(d => d.is_advance_discount === true) : all;
    $scope.$watch('allDiscounts', function () {
      $scope.allDiscounts.forEach(d => d.checked = selectedIds.indexOf(d.id) > -1);
    });


    $scope.isEnablingSaveButton = function () {
      return _selected().length > 0;
    };

    $scope.select = function () {
      $scope.closeThisDialog(_selected());
    };

    var _selected = function () {
      return $scope.allDiscounts.filter(d => d.checked);
    }

  })


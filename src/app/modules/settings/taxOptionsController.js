export class TaxOptionsController {
  constructor(DashboardFactory, taxOptions, CommonFactory, TaxOptionsFactory, $state, $scope) {
    'ngInject';

    $scope.taxOptions = taxOptions;
    $scope.taxOptions.sort( (a, b) => {
      return a.priority > b.priority;
    });

    $scope.store_id = DashboardFactory.getStoreId();
    $scope.newTaxOption = {tax_type: 1, method: 1, store_id:$scope.store_id};

    $scope.store_id = DashboardFactory.getStoreId();

    $scope.taxTypes = TaxOptionsFactory.taxTypes
    $scope.taxMethods = TaxOptionsFactory.taxMethods

    $scope.createOption = function(taxOption) {
      TaxOptionsFactory
        .create(taxOption)
        .success((data) => {
          $state.go('^.index', null, {reload: true})
        });

    };

    $scope.updateOption = function(taxOption) {
      TaxOptionsFactory.update(taxOption.id, taxOption).success(() => {
        taxOption._show = false
        $state.reload()
      });
    };

    $scope.makePrimary = function(taxOption){
      TaxOptionsFactory
        .makePrimary(taxOption.id)
        .success(() => $state.reload());
    };

    $scope.removeOption = function(taxOption) {
      TaxOptionsFactory
        .remove(taxOption.id)
        .success(() => $state.reload());
    };


    $scope.sortableOptions = {
      handle: "h3",

      stop: function(e, ui) {
        _.each($scope.taxOptions, (taxOption, index) => {
          if(taxOption.priority != index) {
            taxOption.priority = index
            TaxOptionsFactory.update(taxOption.id, taxOption)
          }
        })
      },
    }
  }
}

export function taxOptionForm (){
  return {
    scope: {
      taxOption: '=',
      taxTypes: '=',
      taxMethods: '=',
    },
    restrict: 'E',
    templateUrl: 'app/modules/settings/tax_options_form.html',
    controller: function($scope, $element, $attrs, $transclude, DashboardFactory) {
	  $scope.store_id = DashboardFactory.getStoreId();
      $scope.isRateDollar = function(tax_type) {
        return tax_type === 3
      };

    }
  };
}

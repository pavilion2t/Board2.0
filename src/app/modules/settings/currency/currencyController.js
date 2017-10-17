
export function myCurrency() {
  return {
    restrict: 'E',
    templateUrl: 'app/modules/settings/currency/form.html',
    transclude: true,
    scope: {
      title: '@title',
      defaultCurrency: '=',
      isDisabled: '=ngDisabled'
    },
    link: function(scope, element, attrs) {
      var pattern = /^[0-9]+(\.[0-9]{1,10})?$/i;
      scope.currencyPattern = pattern;
    },
    controller: function($scope, currencymap) {

      $scope.currency = _.map(currencymap, function(item){
        return {
          name: item.name,
          currency_to: item.code,
          symbol: item.symbol_native
        };
      });

      $scope.onSelectCallback = function($item, $model){

        var duplicate_times = 0;
        _.forEach($scope.$parent.exchange_rates, function(it){
          if(it.currency_to === $item.currency_to){
            duplicate_times++;
          }
        })
        if(duplicate_times > 1){
          alert('Duplicated currency, choose another again.');
          $scope.defaultCurrency.currency_to = '';
          $scope.defaultCurrency.symbol = '';
        }else{
          $scope.defaultCurrency.symbol = $item.symbol;
        }
        $scope.defaultCurrency.rate = 0;
      };

    }
  };
}

export class CurrencyController {
  constructor($scope, $state, $stateParams, PermissionsFactory, ngDialog, DashboardFactory, currencymap, ExternalSourcesStoreFactory) {
    'ngInject';

    $scope.editMode = false;
    $scope.isMultiple = false;
    var store = DashboardFactory.getCurrentStore();

    $scope.defaultCurrency = {
      symbol: currencymap[store.currency].symbol_native,
      currency_to: store.currency,
      rate: 1.0

    };

    $scope.exchange_rates = [];

    DashboardFactory.getExchangeRate().then(function(data){

      $scope.exchange_rates = _.map(data.data.exchange_rates, function(item){
        return {
          symbol: currencymap[item.currency_to].symbol_native,
          currency_to: item.currency_to,
          rate: parseFloat(item.rate)
        };
      });

      if($scope.exchange_rates.length > 0){
        $scope.isMultiple = true;
      }
    });

    $scope.addCurrency = function(){
      $scope.exchange_rates.push({
        currency_to: '',
        rate: 1.0
      });
    };

    $scope.bottomActions = [
      ['Cancel', function() {
        $state.go($state.current.name, $stateParams, { reload: true });
      }, false],
      ['Save', function() {

        var isReady = true;
        _.forEach($scope.exchange_rates, function(item){
          if(item.currency_to === '' || item.symbol === ''){
            isReady = false;
          }
        });

        if(isReady){
          var params = {
            exchange_rates: $scope.exchange_rates
          };

          ExternalSourcesStoreFactory.updateExchangeRateByStore(params, DashboardFactory.getStoreId())
            .success(function(data) {
              $state.go($state.current.name, $stateParams, { reload: true });
            })
            .error(function(err) {
              console.error(err);
              $scope.errorMessage = err.message || 'Error when saving';
            });
        }else{
          alert('form can not be null');
        }


      }, true],
    ];

  }
}

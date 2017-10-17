export default angular
  .module('tax_options', [])
  .controller('TaxOptionsSelectController', function (messageFactory, TaxOptionsFactory, $scope) {
    'ngInject';
    $scope.selectedOptionIds = $scope.ngDialogData.selectedOptionIds;
    console.log('$scope.ngDialogData.selectedOptionIds', $scope.ngDialogData.selectedOptionIds);
    TaxOptionsFactory.get().then((data)=> {
      $scope.taxOptions = data;

      // check tax options
      $scope.taxOptions.forEach((option)=> {
        console.log('option', option);
        option.checked = _.includes($scope.selectedOptionIds, option.id);
      })

    });

    $scope.validateTaxOptions = function (taxOptions, taxOption) {
      if (taxOption.included_in_price && !taxOption.checked) {
        taxOptions.forEach((option) => {
          if (option.included_in_price) {
            option.checked = false;
          }
        })
        messageFactory.add('only one Included in price tax can enable', 'normal')
      }
    };


    $scope.updateTaxOptions = function () {
      var taxOptionsIds = _.compact(_.map($scope.taxOptions, (option) => {
        if (option.checked) {
          return option.id;
        }
      }));
      $scope.closeThisDialog(taxOptionsIds);
    };

  })



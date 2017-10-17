export function storeSearch(ExternalSourcesStoreFactory, $parse) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/shared/external_sources/store-search.html',
    link: function ($scope, elem, attrs) {

      $scope.searchStores = function (title, zipcode) {
        ExternalSourcesStoreFactory.searchStores(title, zipcode)
          .success(function (result) {
            $scope.searchedStores = result.data;
          })
          .error(function (err) {
            console.error(err);
          });
      }

      attrs.$observe('name', function (value) {
        $scope.listingName = value;
        $scope.searchStores($scope.listingName, $scope.listingZipcode);
      })

      attrs.$observe('zipcode', function (value) {
        $scope.listingZipcode = value;
        $scope.searchStores($scope.listingName, $scope.listingZipcode);
      })

      $scope.updateSearchTerm = function (searchTermName, searchTermVal) {
        var model = $parse(searchTermName);
        // Assigns a value to it
        model.assign($scope, searchTermVal);
        // Apply it to the scope
        $scope.$apply();
      }

    }
  };
}

export default angular
  .module('select_listings', [])
  .directive('selectListing', function () {
    return {
      restrict: 'E',
      template: "<button class='_secondary' ng-click='open()'>{{'Select Listing'|translate}}</button>",
      transclude: true,
      scope: {
        onClose: '=',
        selectedIds: '=?',
        storeId: '=?',
        parent: '=?',
      },
      controller: function (ngDialog, $scope) {
        'ngInject';

        $scope.open = function () {

          ngDialog.open({
            template: 'app/shared/directive/select_listings/select_listings.html',
            className: 'ngdialog-theme-default ngdialog-theme-mega',
            controller: 'SelectListing',
            scope: $scope,

          }).closePromise.then(function (response) {
            if (!response.value || response.value === "$closeButton" || response.value === "$document") {
              return
            }
            $scope.selectedIds = response.value; // will use in formatter
            $scope.onClose({ parent: $scope.parent, selectedIds: $scope.selectedIds });

          });

        };
      }
    };
  })
  .controller('SelectListing', function (messageFactory, DashboardFactory, $scope) {
    'ngInject';
    var storeId = DashboardFactory.getStoreId();
    var selectedIds = $scope.$parent.selectedIds || [];

    $scope.isEnablingSaveButton = function () {
      return _cookSelected($scope.selectableListings).length > 0;
    };

    $scope.searchListings = function (keyword) {
      $scope.searching = true;
      $scope.addErrorMessage = '';
      DashboardFactory.searchListings(keyword, storeId)
        .success(function (data) {
          $scope.selectableListings = data.data.listings;
          $scope.searching = false;
        })
        .error(function (err) {
          $scope.addErrorMessage = err.message;
          $scope.searching = false
        });
    };

    $scope.select = function () {
      var resultListings = _cookSelected($scope.selectableListings);
      $scope.closeThisDialog(resultListings);
    };

    var _formatter = function (listing, selectedIds) {
      if (_.includes(selectedIds, listing.id)) {
        listing.checked = true;
      }
      return listing
    };

    var _cookSelected = function (lisings) {
      return _.compact(_.map($scope.selectableListings, function (listing) {
        return listing.checked ? listing.id : null;
      }));
    };
  })


export function addListings() {
  return {
    restrict: 'E',
    template: "<button class='_add' ng-click='open()'>{{'Add New Items'|translate}}</button>",
    transclude: true,
    scope: {
      onClose: '=',
      takenIds: '=?',
      storeId: '=',
      singleSelect: '=',
      oneItemSelect: '=',
      callbackItem: '='
    },
    controller: function(ngDialog, $scope) {
      'ngInject';

      $scope.open = function() {

        ngDialog.open({
          templateUrl: 'app/shared/directive/add_listings/add_listings.html',
          className: 'ngdialog-theme-default ngdialog-theme-mega',
          controller: 'AddListings',
          scope: $scope,

        }).closePromise.then(function (response) {
          if ( $scope.onClose ) {
            $scope.onClose(response, $scope.callbackItem);
          }

        });

      };
    }
  };
}
export class AddListings {
  constructor(messageFactory, AddListingFactory, DashboardFactory, $scope) {
    'ngInject';
    $scope.takenIds = $scope.$parent.takenIds || [];
    var storeId = $scope.$parent.storeId;

    $scope.isEnablingSaveButton = function() {
      return _cookSelected($scope.selectableListings).length > 0;
    };
    $scope.page = 1;
    $scope.totalPages = 0;
    $scope.keyword = '';
    $scope.keywordb = '';
    $scope.test = function(){

    };
    $scope.filters = [
      {name:'Product Name contains',value:'name__contain__',keys:1},
      {name:'UPC/EAN/PLU/SKU contains',value:'UPC/EAN/PLU/SKU',keys:1},
      {name:'Product ID is',value:'product_id__equal__',keys:1},
      {name:'Quantity between',value:'quantity__between__',keys:2},
      {name:'Price between',value:'price__between__',keys:2}
    ];
    $scope.filter = $scope.filters[0];

    $scope.previous = function(){
      if ( $scope.page > 1 ){
        $scope.page --;
        $scope.searchListings($scope.keyword,$scope.keywordb, true);
      }
    };
    $scope.searched = false;
    $scope.next = function(){
      if ( $scope.page < $scope.totalPages ){
        $scope.page ++;
        $scope.searchListings($scope.keyword,$scope.keywordb, true);
      }
    };

    $scope.searchListings = function(keyword,keywordb,continued) {
      if ( !keyword ){
        return;
      }
      if ( !continued ) {
        $scope.searched = false;
      }
      $scope.searching = true;
      $scope.addErrorMessage = '';
      var enterKeyword = keyword;
      if ( $scope.filter.keys === 2 ){
        enterKeyword = keyword+'__'+keywordb;
      }

      if ( $scope.filter.value !== 'UPC/EAN/PLU/SKU') {
        AddListingFactory.getInventory(enterKeyword, $scope.filter.value, $scope.page, storeId).success(function (data, status, headers, config) {
          $scope.selectableListings = _.map(data, function (value) {
            return value.listing;
          });
          var linkHeader = JSON.parse(headers('Link'));
          $scope.totalPages = linkHeader.total_pages;
          $scope.searching = false;
          $scope.searched = true;
        })
          .error(function (err) {
            console.error(err);
            $scope.addErrorMessage = err.message;
            $scope.searching = false;
          })
      }
      else {
        DashboardFactory.searchListingsByBarcode( enterKeyword, null, $scope.page ).then(function (data, status, headers, config) {
          $scope.selectableListings = _.map(data, function (value) {
            return value.listing;
          });

          $scope.totalPages = 1;
          $scope.searching = false;
          $scope.searched = true;
        });
      }


      /*
       DashboardFactory.searchListings(keyword, storeId)
       .success(function(data) {


       $scope.selectableListings = data.data.listings;
       $scope.searching = false;
       })
       .error(function(err) {
       console.error(err);
       $scope.addErrorMessage = err.message;
       $scope.searching = false
       });*/
    };

    $scope.add = function() {
      var resultListings = _cookSelected($scope.selectableListings);

      $scope.closeThisDialog(resultListings);
    };

    $scope.select = function(listing) {
      if ( $scope.oneItemSelect ){
        if (listing.qtyRequested === 0 || !listing.qtyRequested) {
          listing.qtyRequested = 1;
        }
        return _.each($scope.selectableListings, function(otherlisting) {
          if ( otherlisting !== listing ) {
            otherlisting.qtyRequested = 0;
          }
        });
      }
      else {
        if (listing.qtyRequested === 0 || !listing.qtyRequested) {
          listing.qtyRequested = 1;
        }
        else {
          listing.qtyRequested = 0;
        }
      }
      $scope.isEnablingSaveButton = true;
    };


    var _cookSelected = function(lisings) {
      return _.compact(_.map($scope.selectableListings, function(listing) {
        return listing.qtyRequested > 0 ?  listing : null ;
      }));
    };
  }
}

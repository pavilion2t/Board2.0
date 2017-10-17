export function addListingsByBarcode(DashboardFactory, $timeout) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/shared/directive/add_listings/add_listings_by_barcode.html',
    transclude: true,
    scope: {
      items: '=lineItems',
      addItems: '=addItems',
      storeId: '=storeId'
    },
    link: function(scope, elem, attrs) {
      scope.isDisabled = false;

      scope.searchBarcodes = function(bcode){
         if(typeof bcode === "undefined" || bcode === "") return;

         scope.isDisabled = true;
         DashboardFactory.searchListingsByBarcode(bcode, scope.storeId).then(function(data){
          if(data.length !== 0){


            var listings = _.map(data, function(listing) {
              listing.listing.qtyRequested = 1;
              return listing.listing;
            });

            var res = {
              value: listings
            };

            scope.addItems(res);



          }else{
            alert("Barcode not exist");
          }

          scope.keyword = "";



          $timeout(function(){
            angular.element(elem).find('input').focus();
          }, 1)


           scope.isDisabled = false;
        });
      };

      scope.searchBarcodesKeyUp = function(keyCode, bcode){
        if(keyCode === 13 && scope.isReady){
          scope.searchBarcodes(bcode);
        }
      };

    }
  };
}

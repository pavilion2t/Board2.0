export function inputListing() {
  return {
    restrict: 'E',
    scope: {
      title: '@title',
      listings: '=listings',
      items: '=items',
      newItem: '=newItem',
      disabled: '=ngDisabled',
      isShowing: '=isShowing'
    },
    templateUrl: 'app/shared/directive/inputs/input-listing.html',
    link: function(scope, elem, attrs) {
      // focus on input on show
      scope.$watch('isShowing', function(newVal, old) {
        if(newVal) {
          elem.find('.input-listing__input').focus();
        }
      });
      scope.selectedItemIndex = 0;
      scope.generateDisplayListings = function(listings, keyword) {
        keyword = keyword || '';
        scope.displayedListings = _.filter(scope.listings, function(listing, i) {
          var isInItems = _.reduce(scope.items, function(memo, item) {
            return memo || (item.product_id === listing.product_id);
          }, false);
          return !isInItems && listing.name.toLowerCase().search(keyword.toLowerCase()) !== -1;
        });
      };
      scope.$watch('keyword', function(newVal, old) {
        scope.generateDisplayListings(scope.listings, newVal);
      });
      scope.$watchCollection('listings', function(newObj, old) {
        scope.generateDisplayListings(newObj, scope.keyword);
      });
      scope.$watchCollection('items', function(newObj, old) {
        scope.generateDisplayListings(scope.listings, scope.keyword);
      });

      scope.pressInput = function(event) {
        var k = event.keyCode;
        if(k === 40) {
          // up
          scope.selectedItemIndex++;
        } else if(k === 38) {
          // down
          if(scope.selectedItemIndex > 0) {
            scope.selectedItemIndex--;
          }
        } else if(k === 13) {
          // enter
          scope.newItem = scope.displayedListings[scope.selectedItemIndex];
        } else if(k === 27) {
          scope.keyword = '';
          scope.isShowing = false;
        }
      };
      scope.addNewItem = function(listing) {
        scope.newItem = listing;
      };
      scope.hoverOverItem = function(i) {
        scope.selectedItemIndex = i;
      };
    }
  };
}

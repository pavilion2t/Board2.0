export function headerStoreSelectorItem(RecursionHelper, NavigationMenuFactory, messageFactory, $stateParams, $rootScope, $state, $timeout, AuthFactory, DashboardFactory) {
  'ngInject';
  return {
    restrict: 'E',
    scope: {
      store: "="
    },
    templateUrl: 'app/shared/directive/header/store-selector/header-store-selector-item.html',
    compile: function(elem){
      return RecursionHelper.compile(elem, function link(scope, elem, attrs) {

        elem.on('click', function(event) {
          event.stopPropagation();
        });
        elem.find('.store__checkbox').on('click', function(event) {
          event.stopPropagation();
        });

        scope.updatedStore = null;

        scope.clickStore = function(event, store, checkboxOnly){

          // Update current stores
          if ( !checkboxOnly ) {
            _.each($rootScope.rawStores, function (s) {
              $rootScope.updatedStores[s.id] = false;
            });
            $rootScope.updatedStores[store.id] = true;
            scope.updateCurrentStore();

          } else if((event.target.tagName||'').toUpperCase() === 'INPUT') {
            // checking the checkbox on store selector
            _.each($rootScope.rawStores, function (s) {
              if(s.id !== store.id){
                if(store.chain){
                  // deselected all other chains & stores
                  $rootScope.updatedStores[s.id] = false;
                } else if(s.chain){
                  // deselected all other chain
                  $rootScope.updatedStores[s.id] = false;
                }
              }
            });
          }
          event.stopPropagation();
        };

        scope.updateCurrentStore = function() {
          $rootScope.isSelectingStores = false;
          var selectedStoresId = _.compact(_.map($rootScope.updatedStores, function(value, key) {
            return value ? key : "";
          }));

          $rootScope.selectedStoresId = selectedStoresId;

          if(selectedStoresId.length < 1) {
            messageFactory.add('No Store Selected');
            return
          }

          $stateParams.store_id = selectedStoresId.join(',');

          NavigationMenuFactory.reload();

          //if swtich from item-master
          if("app.dashboard.item-master.index" === $state.current.name){
            $state.go('app.dashboard.summary');
            return;
          }

          $state.go($state.current, $stateParams, { reload: true });

          return
        };

      });
    },
  };
}



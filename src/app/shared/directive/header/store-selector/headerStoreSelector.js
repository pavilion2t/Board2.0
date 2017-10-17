export function headerStoreSelector( NavigationMenuFactory, messageFactory, $stateParams, $rootScope, $state) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: 'app/shared/directive/header/store-selector/header-store-selector.html',
    link: function(scope, elem, attrs) {

      elem.on('click', function(event) {
        event.stopPropagation();
      });
      elem.find('.store__checkbox').on('click', function(event) {
        event.stopPropagation();
      });

      scope.updatedStore = null;

      scope.startUpdatingCurrentStore = function() {
        if ( $rootScope.isSelectingStores ){

          scope.updateCurrentStore();
          return;
        }
        $rootScope.isSelectingStores = !$rootScope.isSelectingStores;
        $rootScope.updatedStore = $rootScope.currentStores[0];

        $rootScope.updatedStores = {};

        _.each($rootScope.currentStores, function(store) {
          $rootScope.updatedStores[store.id] = true;
        });
      };
      scope.cancelUpdatingCurrentStore = function() {
        scope.isSelectingStores = false;
        $rootScope.updatedStores = {};
      };
      scope.selectAllStores = function() {
        let hasStoreSelected = false;
        // select all non-chain store
        _.each($rootScope.rawStores, function(store) {
          $rootScope.updatedStores[store.id] = !store.chain;
          if(!store.chain){ hasStoreSelected = true; }
        });
        if(!hasStoreSelected && $rootScope.rawStores && $rootScope.rawStores[0]){
          // fallback case
          $rootScope.updatedStores[$rootScope.rawStores[0].id] = true;
        }
      };
      scope.deselectAllStores = function() {
        $rootScope.updatedStores = {};
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

    }
  };
}

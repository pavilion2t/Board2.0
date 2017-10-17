export class DashboardController {
  constructor(getStores, AuthFactory, $rootScope, $stateParams, $state) {
    'ngInject';

    // [0] Welcome new user (don't have any store)
    if ($state.current.name === 'app.dashboard.welcome') {
      return
    }

    if (getStores.data.length === 0) {
      $state.go('app.dashboard.welcome', { store_id: 'new' });
      return
    }

    var rawStores = _.map(getStores.data, function (item) {
      return item.store;
    });
    var stores = AuthFactory.buildStoreTree(rawStores);

    // [0] Go to first Store if store not selected
    if (!$stateParams.store_id) {
      var firstStore = rawStores[0];
      $state.go('app.dashboard.summary', { store_id: firstStore.id });

      return
    }

    // [1] set current store
    var storeIds = $stateParams.store_id.toString().split(',');
    var targetStores = _.map(storeIds, function (id) {
      var targetStore = _.find(rawStores, function (store) {
        return store.id === Number(id);
      });
      return targetStore || null;
    });

    $rootScope.currentStores = targetStores; // treed store

    /*
    if (targetStores[0].associate_type === "CHAIN_MASTER") {
      $state.go('app.dashboard.item-master.index');
    }*/

    $rootScope.rawStores = rawStores; // the one that is not build to tree
    $rootScope.stores = stores; // all stores


    // [2] check activated
    /*
    if (targetStores[0].associate_type !== "CHAIN_MASTER" && !targetStores[0].pos_active) {
      $state.go('app.dashboard.activating', { store_id: targetStores[0].id }, { location: 'replace' });
    }*/

    // [3] go to summary
    if ($state.current.name === "dashboard" || $state.current.name === "app.dashboard.summary") {
      if (targetStores[0].associate_type !== "CHAIN_MASTER") {
        $state.go('app.dashboard.summary');
      }
      else{
        $state.go('app.dashboard.item-master.index');
      }
    }
    $rootScope.globalClick = function (event) {
      if ($rootScope.isSelectingStores) {
        $rootScope.isSelectingStores = false;
        $rootScope.$broadcast('apply-select-store');
      }
    };
  }
}

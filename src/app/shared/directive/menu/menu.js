import { DEFAULT, CHAIN_MASTER_MENUS } from '../../../../../common/config/menu.js';

export function NavigationMenuFactory($cookies, $stateParams, $rootScope, DashboardFactory, $q, $state) {
  'ngInject';
  var factory = {};
  const isInternalUser = $cookies.user_type == 'ADMIN';
  // const isInternalUser = true

  factory.reload = function () {

    factory.store_id = $stateParams.store_id;
    factory.associateType = null;


    var pStores = $q.defer();

    DashboardFactory.getStores().success(function (res) {

      factory.stores = res;
      if (factory.stores.length === 0) return;

      if (!factory.store_id) {
        factory.store_id = factory.stores[0].store.id;
        factory.associateType = factory.stores[0].store.associate_type;
      }
      else {
        for (var i = 0; i < factory.stores.length; i++) {
          if (factory.stores[i].store.id === parseInt(factory.store_id)) {
            factory.associateType = factory.stores[i].store.associate_type;
            continue;
          }
        }
      }
      pStores.resolve();
    });

    var pStoreSetting = $q.defer();
    var pChainInfo = $q.defer();
    var pPermission = $q.defer();
    var pChainModule = $q.defer();
    var pWaitAll = $q.defer();


    pStores.promise.then(function () {
      const currentStore = _.find(factory.stores, s => s.store.id == factory.store_id);

      DashboardFactory.getStoreSetting(factory.store_id).success(function (res) {
        factory.module = res.module;
        pStoreSetting.resolve();
      });
      DashboardFactory.getChainInfo(factory.store_id).success(function (res) {
        factory.chainInfo = res;
        try {
          factory.isAllowStoreTransfer = (res.chain_info.allow_store_transfer.current.length > 0);
          pChainInfo.resolve();
        } catch (e) {
          factory.isAllowStoreTransfer = false;
          pChainInfo.resolve();
        }
      });
      DashboardFactory.setupPermission(factory.store_id).then(function (res) {
        factory.store_permissions = res;
        pPermission.resolve();
      });

      // fetch chain module setting for chain store
      $rootScope.chainModule = factory.chainModule = {};
      if (currentStore && currentStore.store && currentStore.store.chain){
        DashboardFactory.getChainModule(factory.store_id).then(function (res) {
          $rootScope.chainModule = factory.chainModule = res.data.chain_module || {};
          pChainModule.resolve();
        });
      } else {
        pChainModule.resolve();
      }

      $q.all([pStoreSetting.promise, pChainInfo.promise, pPermission.promise, pChainModule.promise]).then(function (data) {
        return pWaitAll.resolve();
      });
    });
    pWaitAll.promise.then(function () {

      var menu = factory.menu;
      menu.clear();

      if (factory.associateType === 'CHAIN_MASTER') {
        CHAIN_MASTER_MENUS.forEach(item => {
          if (!item.internal || isInternalUser) {
            menu.add(item.name, item.route, item.state || item.route, ['CHAIN_MASTER'], item.module, item.multiStore, item.prefix, item.indexRedirect, item.label, item.internal);
          }
        });

      } else {
        DEFAULT.forEach(item => {
          if (item.type === 'group') {
            menu.section(item.name);
          }
          if (item.type === 'link') {
            if (item.internal) {
              if (isInternalUser) {
                menu.add(item.name, item.route, item.state || item.route, DashboardFactory.getCurrentPermission(item.permission), item.module, item.multiStore, item.prefix, item.indexRedirect, item.label, item.internal);
              }
            } else {
              menu.add(item.name, item.route, item.route, DashboardFactory.getCurrentPermission(item.permission), item.module, item.multiStore, item.prefix, item.indexRedirect, item.label,);
            }
          }
          if (item.type === 'menu') {
            var subMenus = item.children.map(subMenuItem => {
              var subMenu = new MenuSubitem(subMenuItem.name, DashboardFactory.getCurrentPermission(subMenuItem.permission));
              subMenuItem.children.forEach(child => {
                subMenu.add(child.name, child.state || child.route, undefined, child.prefix, child.indexRedirect);
              });
              return subMenu;
            });
            menu.addExpandItem(item.name, item.route, item.route, DashboardFactory.getCurrentPermission(item.permission), null, false, subMenus);
          }
        });
      }


      var constructMenu = function () {
        var isMultiStore = DashboardFactory.isMultiStore();
        var menu = factory.menu;

        // Global Rules
        _.each(menu.list, function (menu, index) {
          menu.check(factory.associateType, factory.module, isMultiStore);

          if (menu.child) {
            // Sub-menu
            _.each(menu.child, function (submenuGroup) {
              submenuGroup.check(factory.associateType, factory.module, isMultiStore);

              // Sub-menu item
              _.each(submenuGroup.child, function (submenu) {
                submenu.check(factory.associateType, factory.module, isMultiStore);
              });
            });
          }
        });

        // Specific Rules
        if (menu.map['Stock Transfers']) {
          menu.map['Stock Transfers'].hidden = !factory.isAllowStoreTransfer;
        }
      };

      if (!DashboardFactory.getCurrentPermission('dashboard:access') && factory.associateType !== 'CHAIN_MASTER') {
        factory.menu.clear();
        if ($state.current.name !== 'dashboard') {
          $state.go('app.dashboard');
        }
      } else {
        constructMenu();
        if ($state.current.name === 'app.dashboard') {
          $state.go('app.dashboard.summary');
        }
      }
    });
  };


  var MenuItem = function (title, route, icon, associates, module, multiStore, isLink, prefix, indexRedirect, label, internal) {
    let href = $state.href('app.dashboard');
    // FIXME: directly route to D2, make cookies user_type change from ADMIN to USER unexpectedly
    // let computedRoute = internal && prefix ? `/${prefix}${href}/${route}` : route;
    let computedRoute = route;
    if (indexRedirect) computedRoute = `${computedRoute}.${indexRedirect}`;
    var item = {
      title: title,
      route: computedRoute,
      icon: icon,
      associates: associates, // list of accosiate_type that must match
      module: module,         // module that must enable
      multiStore: multiStore, // support multi store
      disabled: true,
      hidden: true,
      isLink: isLink,
      isMenu: false,
      child: null,
      hideOnProduction: false,
      label,
      internal
    };
    item.check = function (associateType, storeModule, multiStore) {
      this.hidden = true;
      this.disabled = false;

      if (storeModule.permission_enabled) {
        // check for associate is in associates list
        if (typeof this.associates === 'boolean') {
          this.hidden = !this.associates;
        }
        else {
          if (this.associates != null && Array.isArray(this.associates) && this.associates.indexOf(associateType) > -1) {
            this.hidden = false;
          }
        }
      } else {
        this.hidden = false;
      }

      if (multiStore && !this.multiStore) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }

      // check for module only module is set
      if (this.module) {
        if (!storeModule[this.module]) {
          this.hidden = true;
        }
      }

      if (this.route === null && this.child === null) {
        this.disabled = true;
      }
    };

    return item;
  };

  var MenuSubitem = function (title, associates) {
    var groupAssociates = associates;
    var list = new MenuItem(title, null, null, groupAssociates);
    list.child = [];
    list.add = function (title, route, associates, prefix, indexRedirect) {
      var item = new MenuItem(title, route, null, associates ? associates : groupAssociates, null, null, false, prefix, indexRedirect);
      list.child.push(item);
    };
    list.addDevelopmentItem = function (title, route, icon, associates, prefix, indexRedirect) {
      var item = new MenuItem(title, route, null, associates ? associates : groupAssociates, null, null, false, prefix, indexRedirect);
      item.hideOnProduction = true;
      list.child.push(item);
    };
    return list;
  };


  var MenuLinkedList = function () {
    var list = {
      list: [],
      map: {}
    };
    list.add = function (title, route, icon, associates, module, multiStore, prefix, indexRedirect, label, internal) {
      var item = new MenuItem(title, route, icon, associates, module, multiStore, true, prefix, indexRedirect, label, internal);
      list.list.push(item);
      list.map[title] = item;
    };

    list.addExpandItem = function (title, route, icon, associates, module, multiStore, listOfItems) {
      var item = new MenuItem(title, null, icon, associates, module, multiStore, true);
      list.list.push(item);
      list.map[title] = item;
      item.isMenu = true;
      item.isLink = false;
      item.child = listOfItems;
    };

    list.addDevelopmentItem = function (title, route, icon, associates, module, multiStore, prefix, indexRedirect, label, internal) {
      var item = new MenuItem(title, route, icon, associates, module, multiStore, true, prefix, indexRedirect, label, internal);
      list.list.push(item);
      list.map[title] = item;
      item.hideOnProduction = true;
    };

    list.section = function (title) {
      var item = new MenuItem(title, '', '', true, null, true, false);
      list.list.push(item);
      list.map[title] = item;
    };

    list.clear = function () {
      list.map = {};
      list.list.length = 0;
    };
    return list;
  };


  factory.menu = new MenuLinkedList();
  factory.reload();
  return factory;
}

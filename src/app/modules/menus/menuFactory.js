export function MenuFactory($rootScope, $http, DashboardFactory) {
  'ngInject';

  // MENUS
  var getMenus = function () {
	  return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorite_tabs?page=1&per_page=9999');
  };

  var getMenu = function (id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorite_tabs?id=' + id);
  };
  var createMenu = function (menu) {
    var menuData = _.cloneDeep(menu);
    delete menuData.available_every_day;
    var days = _.map(menuData.available_days, function (value, day) {
      return value ? Number(day) : null;
    });
    menuData.available_days = _.filter(days, function (day) {
      return day !== null;
    });
    if (menuData.available_days.length===7){
      menuData.available_days.unshift(0)
    }
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorite_tabs', { favorite_tab: menuData });
  };
  var updateMenu = function (id, menu) {
    var menuData = {};
    if (menu.name) menuData.name = menu.name;
    if (menu.position) menuData.position = menu.position;
    if (menu.available_time_from) menuData.available_time_from = menu.available_time_from;
    if (menu.available_time_to) menuData.available_time_to = menu.available_time_to;
    if (menu.available_days) {
      var days = _.map(menu.available_days, function (value, day) {
        return value ? Number(day) : null;
      });
      menuData.available_days = _.filter(days, function (day) {
        return day !== null;
      });
    }
    if (menuData.available_days.length===7){
      menuData.available_days.unshift(0)
    }
    return $http.put($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorite_tabs/' + id, { favorite_tab: menuData });
  };
  var deleteMenu = function (id) {
    return $http.delete($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorite_tabs/' + id);
  };

  // MENU SECTIONS
  var getMenuSections = function (id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorite_tabs/' + id + '/favorite_sections?with_details=true');
  };
  var createMenuSection = function (menu_id, section) {
    // ughhhh
    section.store_id = DashboardFactory.getStoreId();
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorite_tabs/' + menu_id + '/favorite_sections', { favorite_section: section });
  };
  var updateMenuSection = function (menu_id, id, section) {
    var sectionData = {
      name: section.name,
      position: section.position
    };
    return $http.put($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorite_tabs/' + menu_id + '/favorite_sections/' + id, { favorite_section: sectionData });
  };
  var deleteMenuSection = function (menu_id, id) {
    return $http.delete($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorite_tabs/' + menu_id + '/favorite_sections/' + id);
  };

  // MENU ITEMS
  var createMenuItem = function (item) {
    delete item.id;
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorites', { favorite: item });
  };
  var deleteMenuItem = function (id) {
    return $http.delete($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/favorites/' + id);
  };

  return {
    getMenus: getMenus,
    getMenu: getMenu,
    createMenu: createMenu,
    updateMenu: updateMenu,
    deleteMenu: deleteMenu,
    getMenuSections: getMenuSections,
    createMenuSection: createMenuSection,
    updateMenuSection: updateMenuSection,
    deleteMenuSection: deleteMenuSection,
    createMenuItem: createMenuItem,
    deleteMenuItem: deleteMenuItem
  };
}

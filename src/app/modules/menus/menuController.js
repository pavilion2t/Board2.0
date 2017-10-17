export class MenuController {
  constructor($scope, $state, $timeout, $q, MenuFactory) {
    'ngInject';


    $scope.goToMenu = function(menu) {
        $state.go('app.dashboard.menus.view', { id: menu.id });
      };
      // CREATING NEW MENU
      var oldAvailableDays = null;
      $scope.startCreatingNewMenu = function() {
        $scope.isCreatingNewMenu = true;
        $scope.newMenu = { available_days: {}, position: $scope.menus.length + 1 };
      };
      $scope.$watch('newMenu.available_every_day', function(newValue, old) {
        if($scope.isCreatingNewMenu) {
          if(newValue) {
            oldAvailableDays = _.cloneDeep($scope.newMenu.available_days);
            $scope.newMenu.available_days = {
              1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true
            };
          } else {
            $scope.newMenu.available_days = _.cloneDeep(oldAvailableDays);
            oldAvailableDays = null;
          }
        }
      });
      $scope.cancelCreatingNewMenu = function() {
        $scope.isCreatingNewMenu = false;
        $scope.newMenu = null;
        oldAvailableDays = null;
      }
      $scope.saveNewMenu = function() {
        MenuFactory.createMenu($scope.newMenu)
          .success(function(data) {
            console.log(data);
            $state.go('app.dashboard.menus.index', {}, { reload: true });
          })
          .error(function(err) {
            $scope.createErrorMessage = err.message;
          });
      };

      function everyday(days) {
        return _.values(days).filter(v=>v).length === 7
      }

      // EDITING MENU
      $scope.startEditingMenu = function(menu) {
        $scope.editedMenu = _.cloneDeep(menu);
        $scope.editedMenu.available_days = {};
        _.each(menu.available_days, function(day) {
          if (day !== 0)
            $scope.editedMenu.available_days[day] = true;
        });
        $scope.editedMenu.everyday = function(newValue) {
          if (arguments.length){
            if (newValue){
              $scope.editedMenu.available_days = {
                1: true,
                2: true,
                3: true,
                4: true,
                5: true,
                6: true,
                7: true,
              }
            } else {
              $scope.editedMenu.available_days = {}
            }
          } else {
            return everyday($scope.editedMenu.available_days)
          }
        }
        // ugly hack
        $timeout(function() {
          $scope.isEditingMenu = true;
        }, 1);
      };


      $scope.cancelEditingMenu = function() {
        $scope.isEditingMenu = false;
        $scope.editedMenu = null;
        oldAvailableDays = null;
      }
      $scope.updateMenu = function() {
        MenuFactory.updateMenu($scope.editedMenu.id, $scope.editedMenu)
          .success(function(data) {
            console.log(data);
            $state.go('app.dashboard.menus.index', {}, { reload: true });
          })
          .error(function(err) {
            $scope.editErrorMessage = err.message;
          });
      };

      $scope.removeMenu = function(menu) {
        if(confirm('Are you sure?')) {
          MenuFactory.deleteMenu(menu.id)
            .success(function(data) {
              console.log(data);
              $state.go('app.dashboard.menus.index', {}, { reload: true });
            })
            .error(function(err) {
              $scope.errorMessage = err.message;
            });
        }
      };

      // SORTING POSITIONS
      $scope.menuSortingOptions = {
        start: function(e, ui) {
          ui.item.startPos = ui.item.index();
        },
        stop: function(e, ui) {
          // reorder menu
          $scope.$apply(function() {
            var item = $scope.menus.splice(ui.item.startPos, 1)[0];
            $scope.menus.splice(ui.item.index(), 0, item);
          });
        }
      };

      // BOTTOM ACTIONS
      $scope.getMenusToUpdate = function(menus) {
        if(!menus) return [];
        var changedMenus = _.map(menus, function(menu, i) {
          if(menu.position !== (i + 1)) {
            menu.newPosition = i + 1;
            return menu;
          } else {
            return null;
          }
        });
        return _.filter(changedMenus, function(menu) { return menu !== null; });
      };
      $scope.saveChanges = function() {
        var promises = _.map($scope.getMenusToUpdate($scope.menus), function(menu) {
          return MenuFactory.updateMenu(menu.id, { position: menu.newPosition });
        });
        $q.all(promises)
          .then(function() {
            $state.go('app.dashboard.menus.index', {}, { reload: true });
          }, function(err) {
            $scope.errorMessage = err.message;
          })
      };
      $scope.discardChanges = function() {
        $state.go('app.dashboard.menus.index', {}, { reload: true });
      };

      MenuFactory.getMenus()
        .success(function(data) {
          console.log(data);
          $scope.menus = _.map(data, function(tab) { return tab.favorite_tab; });
          $scope.menus.sort(function(m1, m2) {
            return m1.position - m2.position;
          });
        });

  }
}

export class MenuViewController {
  constructor($scope, $state, $stateParams, $q, DashboardFactory, MenuFactory) {
    'ngInject';
    $scope.editPermission = DashboardFactory.getCurrentEditPermission('menu_setup');



    MenuFactory.getMenus()
      .success(function(data) {
        console.log(data);
        // ugh
        var menus = _.map(data, function(tab) {
          return tab.favorite_tab;
        });
        $scope.menu = _.find(menus, function(menu) {
          return menu.id === Number($stateParams.id);
        })
        // $scope.menu = data.favorite_tab;
      })
      .error(function(err) {
        $scope.errorMessage = err.message;
      });

    MenuFactory.getMenuSections($stateParams.id)
      .success(function(data) {
        console.log(data);
        // ugh
        var menuSections = _.map(data, function(section) { return section.favorite_section; });
        menuSections.sort(function(s1, s2) { return s1.position - s2.position; });
        _.each(menuSections, function(section) {
          section.favorites.sort(function(s1, s2) { return s1.position - s2.position; });
        });
        $scope.menuSections = menuSections;
      });

    // CREATING NEW MENU SECTION
    $scope.startCreatingNewMenuSection = function() {
      $scope.isCreatingNewMenuSection = true;
      $scope.newMenuSection = { position: $scope.menuSections.length + 1 };
    };
    $scope.cancelCreatingNewMenuSection = function() {
      $scope.isCreatingNewMenuSection = false;
      $scope.newMenuSection = null;
    };
    $scope.saveNewMenuSection = function() {
      MenuFactory.createMenuSection($stateParams.id, $scope.newMenuSection)
        .success(function(data) {
          console.log(data);
          $state.go('app.dashboard.menus.view', $stateParams, { reload: true });
        })
        .error(function(err) {
          $scope.createErrorMessage = err.message;
        });
    };

    // EDITING MENU SECTION
    $scope.startEditingMenuSection = function(section) {
      //$scope.isEditingMenuSection = true;
      //$scope.editedMenuSection = _.cloneDeep(section);

    	section._editing = true;
    	section._editingTitle = section.name;
    };
    $scope.saveSectionChanges = function(section){
    	section.name = section._editingTitle;
    	$scope.editedMenuSection = section;
    	$scope.updateMenuSection();
    };
    $scope.discardSectionChanges = function(section){
    	section._editing = false;
    };
    $scope.cancelEditingMenuSection = function() {
      $scope.isEditingMenuSection = false;
      $scope.editedMenuSection = null;
    };
    $scope.updateMenuSection = function() {
      MenuFactory.updateMenuSection($stateParams.id, $scope.editedMenuSection.id, $scope.editedMenuSection)
        .success(function(data) {
          console.log(data);
          $state.go('app.dashboard.menus.view', $stateParams, { reload: true });
        })
        .error(function(err) {
          $scope.editErrorMessage = err.message;
        });
    };

    // CREATING NEW MENU ITEM
    $scope.startCreatingNewMenuItem = function(section) {
      $scope.isCreatingNewMenuItem = true;
      // box id wtf?
      $scope.newMenuItem = { favorite_section_id: section.id, position: section.favorites.length + 1, box_id: 0 };
    };
    $scope.cancelCreatingNewMenuItem = function() {
      $scope.isCreatingNewMenuItem = false;
      $scope.newMenuItem = null;
      $scope.selectableListings = null;
    };
    $scope.searchListings = function(keyword) {
      DashboardFactory.searchListings(keyword)
        .success(function(data) {
          $scope.selectableListings = data.data.listings;
          $scope.isAddingNewItems = true;
        })
        .error(function(err) {
          console.error(err);
          $scope.addErrorMessage = err.message;
        });
    };
    /*
    $scope.saveNewMenuItem = function() {
      MenuFactory.createMenuItem($scope.newMenuItem)
        .success(function(data) {
          console.log(data);
          $state.go('app.dashboard.menus.view', $stateParams, { reload: true });
        })
        .error(function(err) {
          $scope.createErrorMessage = err.message;
        });
    };*/

    $scope.saveNewMenuItem = function() {
        MenuFactory.createMenuItem($scope.newMenuItem)
          .success(function(data) {
            console.log(data);
            $state.go('app.dashboard.menus.view', $stateParams, { reload: true });
          })
          .error(function(err) {
            $scope.createErrorMessage = err.message;
          });
    };

    $scope.saveNewAddItem = function(newMenuItem) {
    	var deferred = $q.defer();

        MenuFactory.createMenuItem(newMenuItem)
          .success(function(data) {
        	  deferred.resolve();
          })
          .error(function(err) {
        	  deferred.reject(err.message);
          });

        return deferred.promise;
    };

    $scope.addItems = function(data, section){
    	console.log(data);
    	var deferredList = [];
    	if ( data.value && data.value.length > 0 ){
    		for ( var i = 0; i < data.value.length; i ++ ){
    			var item = data.value[i];
    			var newMenuItem = { favorite_section_id: section.id, position: section.favorites.length + 1 + i, box_id: 0, listing_id: item.id };
    			var deferred = $scope.saveNewAddItem(newMenuItem);
    			deferredList.push(deferred);
    		}
    	}
    	$q.all(deferredList).then(function(){$state.go('app.dashboard.menus.view', $stateParams, { reload: true });});
    };


    // EDITING MENU ITEM
    $scope.startEditingMenuItem = function(item) {
      $scope.isEditingMenuItem = true;
      $scope.editedMenuItem = _.cloneDeep(item);
    };
    $scope.cancelEditingMenuItem = function() {
      $scope.isEditingMenuItem = false;
      $scope.editedMenuItem = null;
      $scope.selectableListings = null;
    };
    $scope.updateMenuItem = function() {
      // hack: overwrite existing favorite by posting a new favorite
      MenuFactory.createMenuItem($scope.editedMenuItem)
        .success(function(data) {
          console.log(data);
          $state.go('app.dashboard.menus.view', $stateParams, { reload: true });
        })
        .error(function(err) {
          $scope.editErrorMessage = err.message;
        });
    };

    $scope.removeMenuSection = function(section) {
      if(confirm('Are you sure?')) {
        MenuFactory.deleteMenuSection($stateParams.id, section.id)
          .success(function(data) {
            console.log(data);
            $state.go('app.dashboard.menus.view', $stateParams, { reload: true });
          })
          .error(function(err) {
            $scope.errorMessage = err.message;
          });
      }
    };
    $scope.removeMenuItem = function(section) {
      if(confirm('Are you sure?')) {
        MenuFactory.deleteMenuItem(section.id)
          .success(function(data) {
            console.log(data);
            $state.go('app.dashboard.menus.view', $stateParams, { reload: true });
          })
          .error(function(err) {
            $scope.errorMessage = err.message;
          });
      }
    };

    // MENU SECTION SORT
    $scope.menuSectionSortingOptions = {
      start: function(e, ui) {
        ui.item.startPos = ui.item.index();
      },
      stop: function(e, ui) {
        // reorder menu
        $scope.$apply(function() {
          var item = $scope.menuSections.splice(ui.item.startPos, 1)[0];
          $scope.menuSections.splice(ui.item.index(), 0, item);
        });
      }
    };

    $scope.menuItemSortingOptions = {
      start: function(e, ui) {
        ui.item.startPos = ui.item.index();
      },
      stop: function(e, ui) {
        // reorder menu
        var section = ui.item.scope().section;
        $scope.$apply(function() {
          var item = section.favorites.splice(ui.item.startPos, 1)[0];
          section.favorites.splice(ui.item.index(), 0, item);
        });
      }
    };

    // BOTTOM ACTIONS
    var getSectionsToUpdate = function(sections) {
      if(!sections) return [];
      var changedMenuSections = _.map(sections, function(section, i) {
        if(section.position !== (i + 1)) {
          section.newPosition = i + 1;
          section.type = 'menu_section';
          return section;
        } else {
          return null;
        }
      });
      return _.filter(changedMenuSections, function(section) { return section !== null; });
    };
    var getItemsToUpdate = function(sections) {
      if(!sections) return [];
      var changedMenuItems = [];
      _.each(sections, function(section, i) {
        _.each(section.favorites, function(item, i) {

          if ( item._deleting ){
            item.newPosition = -1;
            item.type = 'menu_item';
            changedMenuItems.push(item);
          }
          else if(item.position !== (i + 1)) {
            item.newPosition = i + 1;
            item.type = 'menu_item';
            changedMenuItems.push(item);
          }


        });
      });

      return changedMenuItems;
    };
    $scope.getObjectsToUpdate = function(sections) {
      return getSectionsToUpdate(sections).concat(getItemsToUpdate(sections));
    };
    $scope.saveChanges = function() {
      var deletePromises = [];
      var list = $scope.getObjectsToUpdate($scope.menuSections);
      var promises = _.map(list, function(obj) {
        if(obj.type === 'menu_section') {
          return MenuFactory.updateMenuSection($stateParams.id, obj.id, { position: obj.newPosition });
        }
        else if(obj.type === 'menu_item') {
          obj.position = obj.newPosition;
          obj.listing_id = obj.listing.id;

          deletePromises.push(MenuFactory.deleteMenuItem(obj.id));
          //delete obj.listing;
          //delete obj.newPosition;
          //delete obj.id;
          //delete obj.type;
          if ( obj.position !== -1 ){
        	  return MenuFactory.createMenuItem(obj);
          }
          else {
        	  return null;
          }
        }
      });


      $q.all(deletePromises)
        .then(function() {
          $q.all(promises)
            .then(function() {
              $state.go('app.dashboard.menus.view', $stateParams, { reload: true });
            }, function(err) {
              $scope.errorMessage = err.message;
            });

        }, function(err) {
          // super hack - continue to create new favorites even if DELETE returns error
          $q.all(promises)
            .then(function() {
              $state.go('app.dashboard.menus.view', $stateParams, { reload: true });
            }, function(err) {
              $scope.errorMessage = err.message;
            });
        })
    };
    $scope.discardChanges = function() {
      $state.go('app.dashboard.menus.view', $stateParams, { reload: true });
    };

  }
}

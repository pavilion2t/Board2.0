export class ModifiersSetController {
  constructor($scope, $rootScope, $http, $state, $stateParams, FormatterFactory, DashboardFactory, ModifierFactory, gettextCatalog, InventoryFactory) {
    'ngInject';

    $scope.title = 'Modifiers';
    $scope.editPermission = DashboardFactory.getCurrentEditPermission('modifier_set');

    // ROUTE
    var store_id = DashboardFactory.getStoreId();
    $scope.route = $rootScope.api + '/api/v2/stores/' + store_id + '/modifier_sets';

    var numberOfItemsFormatter = function (row, column, value, columnDef, dataContext) {
      return dataContext.modifier_set_options.length;
    };

    var numberOfItemsExportFormatter = function (row, column, value, columnDef, dataContext) {
      return column.modifier_set_options.length;
    };

    var chooseTypeFormatter = function (row, column, value, columnDef, dataContext) {
      if (value === 1) {
        return 'Single';
      }
      else {
        return 'Multiple';
      }
    };

    var titleFormatter = function (row, cell, value, columnDef, dataContext) {
      var title = '<a href="' + store_id + '/modifiers/' + dataContext.id + '">' + dataContext.title + '</a>';
      return title;
    };


    $scope.columns = [
      { field: 'title', name: gettextCatalog.getString('Group Name'), ratio: '30%', formatter: titleFormatter, pdfFormatter: 'raw' },
      { field: 'choose_type', name: gettextCatalog.getString('Type'), ratio: '30%', formatter: chooseTypeFormatter },
      {
        field: 'listing_ids',
        name: gettextCatalog.getString('# of Items'),
        ratio: '10%',
        formatter: numberOfItemsFormatter,
        exportFormatter: numberOfItemsExportFormatter,
        pdfFormatter: numberOfItemsFormatter
      },
      {
        field: 'store_id',
        name: gettextCatalog.getString('Store ID'),
        ratio: '10%'
      },
      {
        field: 'updated_at',
        name: gettextCatalog.getString('Last Updated'),
        ratio: '20%',
        formatter: FormatterFactory.dateFormatter
      }
    ];
    $scope.actions = [
      ['View', function (item) {
        $state.go('app.dashboard.modifiers.view', { store_id: store_id, modifier_set_id: item.id });
      }],
      ['Delete', function (item) {
        if (!confirm('Are you sure you want to delete this modifier group?')) {
          return false;
        }
        ModifierFactory.deleteModifierSet(item.id)
          .success(function (data) {
            $state.go('app.dashboard.modifiers.index', $stateParams, { reload: true });
          })
          .error(function (err) {
            console.error(err);
            $scope.errorMessage = err.message;
          });
      }]
    ];
  }
}

export class ModifierSetViewController {
  constructor($scope, $state, $stateParams, ModifierFactory, departments, CommonFactory, DashboardFactory, InventoryFactory) {


    var store_id = DashboardFactory.getStoreId();
    var _modifierSetCache = {};
    $scope.editPermission = DashboardFactory.getCurrentEditPermission('modifier_set');


    $scope.section = 'overview';

    $scope.departments = departments;
    $scope.departmentsSorted = CommonFactory.sortAndTreeDepartment($scope.departments);

    $scope.addDepartment = function () {
      $scope.modifierSet.departmentset.push({ id: 0 });
      $scope.modifierSet.department_ids.push(0);
    };

    $scope.deleteDepartment = function (index) {
      $scope.modifierSet.departmentset.splice(index, 1);
      $scope.modifierSet.department_ids.splice(index, 1);
    };
    $scope.changeDepartment = function (dep, index) {
      $scope.modifierSet.departmentset[index].id = dep.id;
      $scope.modifierSet.department_ids[index] = dep.id;
    };


    var selectableList = function (data) {
      $scope.selectableListings = _.map(data, function (item) {

        if ($scope.modifierSet.searchItemIdMap[item.listing.product_id]) {
          item.listing.selected = true;
        }
        else {
          item.listing.selected = false;
        }
        return item.listing;
      });
    };


    $scope.searchItem = function () {
      if ($scope.modifierSet.searchItemId !== '') {
        DashboardFactory.searchListingID($scope.modifierSet.searchItemId).then(selectableList);
      }
      else if ($scope.modifierSet.searchItemName !== '') {
        DashboardFactory.searchListingsOld($scope.modifierSet.searchItemName).then(function (data) {
          selectableList(data.data)
        });
      }
    };

    $scope.removeProduct = function (option) {
      delete option._product;
      option.product_id = 0;
    };


    $scope.toggleItem = function (item) {
      console.log('item', item);
      if (item.selected) {
        item.selected = false;
        $scope.modifierSet.searchItemIdMap[item.product_id] = false;
        for (var i = $scope.modifierSet.product_ids.length - 1; i >= 0; i--) {
          if ($scope.modifierSet.product_ids[i] === item.product_id) {
            $scope.modifierSet.product_ids.splice(i, 1);
          }
        }
      }
      else {
        item.selected = true;
        $scope.modifierSet.searchItemIdMap[item.product_id] = true;
        $scope.modifierSet.product_ids.push(item.product_id);
      }
    };

    $scope.enableEditMode = function () {
      $scope.editMode = true;
      angular.copy($scope.modifierSet, _modifierSetCache);
    };

    var init = function (data) {
      if (data) {
        $scope.modifierSet = data.data.modifier_set;
      }
      else {
        $scope.editMode = true;
        $scope.modifierSet = {};
        $scope.modifierSet.department_ids = [];
        $scope.modifierSet.product_ids = [];
        $scope.modifierSet.modifier_set_options = [];
      }

      $scope.modifierSet.departmentset = [];
      $scope.modifierSet.searchItemName = '';
      $scope.modifierSet.searchItemId = '';
      $scope.modifierSet.searchItemIdMap = {};

      for (var i = 0; i < $scope.modifierSet.department_ids.length; i++) {
        $scope.modifierSet.departmentset[i] = { id: $scope.modifierSet.department_ids[i] };
      }

      $scope.modifierSet._product = [];
      var callbackItem = function (data) {
        if (data.data.length >= 1) {
          $scope.modifierSet._product[Number(this)] = data.data[0].listing;
        }
      };
      for (var i = 0; i < $scope.modifierSet.product_ids.length; i++) {
        $scope.modifierSet.searchItemIdMap[$scope.modifierSet.product_ids[i]] = true;
        var product_id = $scope.modifierSet.product_ids[i];
        var thisIndex = i;

        DashboardFactory.searchProductsById(product_id, store_id).then(callbackItem.bind(thisIndex));
      }
      var callbackOptions = function (data) {
        if (data.data.length >= 1) {
          $scope.modifierSet.modifier_set_options[Number(this)]._product = data.data[0].listing;
        }
      };
      for (var i = 0; i < $scope.modifierSet.modifier_set_options.length; i++) {

        if ($scope.modifierSet.modifier_set_options[i].product_id) {
          var product_id = $scope.modifierSet.modifier_set_options[i].product_id;
          var thisIndex = i;


          DashboardFactory.searchProductsById(product_id, store_id).then(callbackOptions.bind(thisIndex));
        }

      }


    };
    if ($stateParams.modifier_set_id) {
      ModifierFactory.getModifierSet($stateParams.modifier_set_id).then(init);
    }
    else {
      init(null);
    }


    $scope.removeProductTab = function (product, index) {
      $scope.modifierSet._product.splice(index, 1);
      $scope.modifierSet.product_ids.splice(index, 1);
    };
    $scope.currentStore = parseInt($stateParams.store_id);

    function Option() {
      var obj = {};
      obj.name = '';
      obj.quantity = 1;
      obj.change_in_price = 0;
      obj.enable_credit_pool = false;
      return obj;
    }

    $scope.addItems = function (data) {

    };

    $scope.addItems2 = function (data) {
      if (data && data.value && data.value.length >= 1) {


        var newids = _.map(data.value, function (value) {
          return value.product_id;
        });
        $scope.modifierSet.product_ids = $scope.modifierSet.product_ids.concat(newids);

        $scope.modifierSet._product = $scope.modifierSet._product.concat(data.value);
      }

    };

    $scope.add = function (collection) {
      collection.push(new Option());
    };

    $scope.delete = function (option, index, collection) {
      option.deleted = true;
    };

    $scope.bottomActions = [
      ['Cancel', function () {
        if (confirm('Discard all changes?')) {
          $scope.modifierSet = angular.copy(_modifierSetCache, $scope.modifierSet);
          $scope.editMode = false;
        }
      }, false],
      ['Save', function () {
        if ($scope.myForm.$invalid) {
          alert('Some values are invalid. Please check again.');
          return
        }

        for (var i = 0; i < $scope.modifierSet.departmentset.length; i++) {
          $scope.modifierSet.department_ids[i] = $scope.modifierSet.departmentset[i].id;
        }
        var submitSet = angular.copy($scope.modifierSet, submitSet);
        delete submitSet.departmentset;
        delete submitSet.searchItemName;
        delete submitSet.searchItemId;
        delete submitSet.searchItemIdMap;

        if ($stateParams.modifier_set_id) {
          ModifierFactory.updateModifierSet($stateParams.modifier_set_id, submitSet)
            .success(function (data) {
              console.log(data);
              $state.go('app.dashboard.modifiers.index');
            })
            .error(function (err) {
              console.error(err);
              $scope.errorMessage = err.message || 'Error when saving';
            });
        }
        else {
          ModifierFactory.createModifierSet(submitSet)
            .success(function (data) {
              console.log(data);
              $state.go('app.dashboard.modifiers.index');
            })
            .error(function (err) {
              console.error(err);
              $scope.errorMessage = err.message || 'Error when saving';
            });
        }
      }, true],
    ];


  }
}

export function modifierSetForm() {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'app/modules/modifiers/setform.html',
    link: function (scope, elem, attrs) {

      scope.addModifier = function (modifierSubgroup, type) {
        modifierSubgroup.push({
          modifier_type: type,
          modifier_options: [{}]
        });
      };
      scope.removeModifier = function (modifierSubgroup, i) {
        modifierSubgroup.splice(i, 1);
      };

      scope.addNewOptionToModifier = function (modifier) {
        modifier.modifier_options.push({});
      };
      scope.removeOptionFromModifier = function (i, modifier) {
        modifier.modifier_options.splice(i, 1);
      };

      scope.resetDefault = function (modifier_options, option, disabled) {
        // Way of angular radio works make it possble have options in same name seleced
        // So we have to loop through modifier_options and set only one option.default = true

        if (disabled) {
          return false;
        }
        _.each(modifier_options, function (otheroption) {
          if (otheroption !== option) {
            otheroption.default = false;
          }
        });


      };
      scope.addItems = function (data, option) {
        if (data && data.value && data.value.length >= 1) {
          option.product_id = data.value[0].product_id;
          option._product = data.value[0];
        }
      };


    }
  };
}

export class InventoryController{
  constructor($scope, $rootScope, $state, departments, brands, $stateParams, DashboardFactory, FormatterFactory, InventoryFactory, gettextCatalog, suppliers) {
    'ngInject';

    $scope.title = 'Inventory';

    var inventoryFormatter = function (row, cell, value, columnDef, dataContext) {
      var imgHTML = '<img placeholder-src="inventory" class="item__image" src="' + _.get(dataContext, 'image_urls[0]', '') + '">';
      var nameHTML = '<p><a href="' + store_id + '/inventory/' + dataContext.id + '">' + dataContext.name + '</a></p>';
      var upc;
      if (dataContext.gtid) {
        upc = dataContext.gtid;
      }
      else if (dataContext.upc) {
        upc = dataContext.upc;
      }
      else if (dataContext.upc_e) {
        upc = dataContext.upc_e;
      }
      else if (dataContext.ean13) {
        upc = dataContext.ean13;
      }

      var barcode;
      if (dataContext.barcode){
        barcode = dataContext.barcode;
      }
      else if (dataContext.listing_barcode){
        barcode = dataContext.listing_barcode;
      }

      var codeHTML = upc ? '<p class="thumbnail-text">UPC/EAN: ' + upc + '</p>' : '<p class="thumbnail-text">UPC/EAN: N/A</p>';
      var barcodeHTML = barcode ? '<p class="thumbnail-text">PLU/SKU: ' + barcode + '</p>' : '<p class="thumbnail-text">PLU/SKU: N/A</p>';

      var inventoryHTML = '<div class="_inventory-item _compile">' + imgHTML + '<div class="inventory-name">' +nameHTML + codeHTML + barcodeHTML + '</div>'+ '</div>';
      return inventoryHTML;
    };

    var quantityFormatter = function (row, cell, value, columnDef, dataContext) {
      if (dataContext.track_quantity) {
        return value < 1 ? '<span style="color: red">' + value + '</span>' : value;
      } else {
        return 'Unlimited';
      }
    };
    var quantityFormatterLite = function (row, cell, value, columnDef, dataContext) {
      if (dataContext.track_quantity) {
        return value;
      } else {
        return 'Unlimited';
      }
    };

    var multiStoreProductFormatter = function (row, cell, value, columnDef, dataContext) {
      var imgHTML = '<img placeholder-src="inventory" class="item__image" src="' + dataContext.image_url + '">';
      var nameHTML = '<p>' + dataContext.name + '</p>';
      var codeHTML = dataContext.upc ? '<p>Code: ' + dataContext.upc + '</p>' : '<p>Code: N/A</p>';
      var inventoryHTML = '<div class="_inventory-item _compile">' + imgHTML + nameHTML + codeHTML + '</div>';
      return inventoryHTML;
    };
    var multiStoreNamesFormatter = function (row, cell, value, columnDef, dataContext) {
      var storeNamesHTML = '<div class="_inventory-item">';
      _.each(dataContext.individual_listings, function (listing, i) {
        var storeName = _.reduce(DashboardFactory.getCurrentStores(), function (memo, store) {
          return listing.store_id === store.id ? store.title : memo;
        }, null);
        storeNamesHTML += '<p>' + storeName + '</p>';
      });
      storeNamesHTML += '</div>';
      return storeNamesHTML;
    };
    var multiStoreQuantitiesFormatter = function (row, cell, value, columnDef, dataContext) {
      var storeQuantitiesHTML = '<div class="_inventory-item">';
      _.each(dataContext.individual_listings, function (listing, i) {
        var storeQuantity = _.reduce(DashboardFactory.getCurrentStores(), function (memo, store) {
          if (dataContext.individual_listings.track_quantity) {
            return listing.store_id === store.id ? listing.quantity : memo;
          } else {
            return 'Unlimited';
          }
        }, null);
        if (storeQuantity != 'Unlimited' && storeQuantity < 1) {
          storeQuantitiesHTML += '<p style="color: red">' + storeQuantity + '</p>';
        } else {
          storeQuantitiesHTML += '<p>' + storeQuantity + '</p>';
        }
      });
      storeQuantitiesHTML += '</div>';
      return storeQuantitiesHTML;
    };
    var multiStorePricesFormatter = function (row, cell, value, columnDef, dataContext) {
      var storePricesHTML = '<div class="_inventory-item">';
      _.each(dataContext.individual_listings, function (listing, i) {
        var storePrice = _.reduce(DashboardFactory.getCurrentStores(), function (memo, store) {
          return listing.store_id === store.id ? (listing.price ? '$' + Number(listing.price).toFixed(2) : '$0.00') : memo;
        }, null);
        storePricesHTML += '<p>' + storePrice + '</p>';
      });
      storePricesHTML += '</div>';
      return storePricesHTML;
    };

    var departmentMap = {};
    _.each(departments, function (value) {
        departmentMap[value.id] = value.name;
    });

    var departmentFormatter = function (row, cell, value, columnDef, dataContext) {
        return departmentMap[value];
    };
    $scope.editPermission = DashboardFactory.getCurrentEditPermission('inventory');


    $scope.isMultiStore = DashboardFactory.isMultiStore();
    if ($scope.isMultiStore) {
      var storeIds = DashboardFactory.getStoreIds();
      $scope.route = _.reduce(storeIds, function (memo, id) {
        return memo + 'store_ids[]=' + id + '&';
      }, $rootScope.api + '/api/v2/stores/' + storeIds[0] + '/multiple_store_products?');
      $scope.columns = [
        {field: null, name: gettextCatalog.getString("Product"), ratio: '55%', formatter: multiStoreProductFormatter},
        {field: null, name: gettextCatalog.getString("Store"), ratio: '20%', formatter: multiStoreNamesFormatter},
        {field: null, name: gettextCatalog.getString("In Stock"), ratio: '10%', formatter: multiStoreQuantitiesFormatter},
        {field: null, name: gettextCatalog.getString("Price"), ratio: '15%', formatter: multiStorePricesFormatter},
      ];
      $scope.actions = [
        ['View', function (item) {
          $state.go('app.dashboard.inventory.view', { store_id: $stateParams.store_id, listing_id: item.individual_listings[0].id, selected_store_id: item.individual_listings[0].store_id });
        }],
      ];
      $scope.rowHeight = 75;

    } else {
      var store_id = DashboardFactory.getStoreId();


      $scope.columns = [
        {field: "name", name: gettextCatalog.getString("Product Name"), ratio: '60%', formatter: inventoryFormatter, pdfFormatter: 'raw'},

        {field: "brand_name", name: gettextCatalog.getString("Brand"), ratio: '12%'},
        //{field: "department_name", name: gettextCatalog.getString("Department"), ratio: '12%'},
        {field: "department_id", name: gettextCatalog.getString("Department"), ratio: '12%',formatter: departmentFormatter},
        //{field: "category_name", name: gettextCatalog.getString("Category"), ratio: '12%'},
        {field: "qty_on_shelf", name: gettextCatalog.getString("QTY on shelf"), ratio: '8%', formatter: quantityFormatter, pdfFormatter: quantityFormatterLite},
        {field: "price", name: gettextCatalog.getString("Price"), ratio: '8%', formatter: FormatterFactory.dollarFormatter}

      ];

      var departmentOptions = [];
      _.each(departments, function (value) {
        departmentOptions.push({value:value.id,label:value.name});
      });
      var brandOptions = [];
      _.each(brands, function (value) {
        brandOptions.push({value:value.id,label:value.name});
      });
      var suppliersOptions = [];
      _.each(suppliers, function (value) {
    	  suppliersOptions.push({value:value.id,label:value.name});
      });

      const soldOutOptions = [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ];

      const discontinuedOutOptions = [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ];

      $scope.filterColumns = [
        {field: "name", name: gettextCatalog.getString("Product Name"), defaultFilter: true, types: ['contain']},
        {field: "ean13", name: gettextCatalog.getString("UPC/EAN"), types: ['contain', 'equal']},
        {field: "listing_barcode", name: gettextCatalog.getString("PLU/SKU"), types: ['contain', 'equal']},
        {field: 'listing_reference_codes.code', name: gettextCatalog.getString("Reference Code"), types: ['equal', 'contain']},
        // Brand isn't working in API level
        {field: "brand_id", name: gettextCatalog.getString("Brand"), types: ['equal'], selectOptions:brandOptions},
        {field: "department_id", name: gettextCatalog.getString("Department"), types: ['equal'], selectOptions:departmentOptions},
        {field: "supplier_id", name: gettextCatalog.getString("Supplier"), types: ['equal'], selectOptions:suppliersOptions},
        {field: "product_id", name: gettextCatalog.getString("Product ID"), types: ['equal']},
        {field: "quantity", name: gettextCatalog.getString("Quantity"), types: ['equal', 'between']},
        {field: "qty_on_shelf", name: gettextCatalog.getString("QTY on shelf"), types: ['equal', 'between']},
        {field: "price", name: gettextCatalog.getString("Price"), types: ['equal', 'between']},
        {field: "updated_at", name: gettextCatalog.getString("Updated At"), types: ['between'], isDate: true},
        {field: 'sold_out', name: gettextCatalog.getString('Sold Out'), types: ['equal'], selectOptions: soldOutOptions},
        {field: 'discontinued', name: gettextCatalog.getString('Discontinued'), types: ['equal'], selectOptions: discontinuedOutOptions},
      ];

      //ORIGINAL
      //$scope.route = $rootScope.api + '/api/v2/stores/' + store_id + '/listings';
      //$scope.objectWrap = 'listing';

      //NEW
      $scope.filterMode = 'advanced';
      $scope.route = $rootScope.api + '/api/v2/listings/search';

      $scope.actions = [
        ['View', function (item) {
          $state.go('app.dashboard.inventory.view', { store_id: store_id, listing_id: item.id });
        }],
        ['Delete', function (item) {
          if (!confirm('Do you really want to delete this item?')) return false;
          $scope.loadingGrid = true;
          InventoryFactory.deleteInventory(item.id)
            .success(function (data) {
              console.log(data);
              $state.go($state.current.name, $stateParams, { reload: true });
            })
            .error(function (err) {
              console.error(err);
              $scope.loadingGrid = false;
              $scope.errorMessage = err.message;
            });
        },
          function () {
            return $scope.editPermission;
          }],
      ];

      // BOTTOM ACTIONS
      $scope.createNewGtidItem = function () {
        $state.go('app.dashboard.inventory.new-item');
      };
      $scope.createNewCustomItem = function () {
        $state.go('app.dashboard.inventory.new-custom-item');
      };

      // HACKS

      $scope.isShowingFilters = true;
      $scope.rowHeight = 75;
    }

  }
}

export class InventoryViewController{
  constructor(locales, messageFactory, attributes, suppliers, categories, departments, taxOptions, ngDialog, $scope, $rootScope, $http, $q, $timeout, $state, $stateParams, DashboardFactory, InventoryFactory, CommonFactory, gettextCatalog, $filter, unit_groups) {
    'ngInject';

    /************************
     * Setting up variables
     ************************/
    $scope.title = 'Inventory';


    var isMaterialPage = $state.includes('app.dashboard.material');
    var modules =  DashboardFactory.getStoreModules() || {};
    $scope.kitchenAliasEnabled = modules.kitchen_alias_enabled;
    var bomModuleEnabled = modules.bill_of_material_enabled;
    $scope.editPermission = DashboardFactory.getCurrentEditPermission(isMaterialPage ? 'material' : 'inventory');
    $scope.viewCostPermission = isMaterialPage ? DashboardFactory.getCurrentPermission('material:view_cost') : true;
    $scope.bomViewCostPermission = bomModuleEnabled && DashboardFactory.getCurrentPermission('bom:view_cost');
    $scope.bomViewPermission = bomModuleEnabled && DashboardFactory.getCurrentViewPermission('bom');
    $scope.bomEditPermission = bomModuleEnabled && DashboardFactory.getCurrentEditPermission('bom');
    $scope.suppliersTab = DashboardFactory.getCurrentPermission('inventory:supplier_tab');

    $scope.locales = locales;
    $scope.unit_groups = unit_groups;
    var store_id = $stateParams.selected_store_id || DashboardFactory.getStoreId();
    $scope.isMultiStore = DashboardFactory.isMultiStore();
    $scope.section = 'overview';
    $scope.productImages = [];
    $scope.newProductImages = [];
    $scope.attributes = angular.copy(attributes);
    $scope.attributesMap = {};
    $scope.hideEditBtn = function () {
      return $scope.editMode || $scope.section === "bom" && !$scope.bomEditPermission;
    };

    _.each($scope.attributes,function (attribute){
      attribute.value = null;
      attribute.custom_field_id = attribute.id;
      attribute.custom_field_name = attribute.name;
      delete attribute.id;
      delete attribute.name;
      $scope.attributesMap[attribute.custom_field_name] = attribute;
    });
    $scope.taxOptions = taxOptions;
    $scope.departments = departments;
    $scope.costingMethodOptions = [
      { id: 0, name: 'Market to market' },
      { id: 1, name: 'Weighted average cost' },
      // { id: 2, name: 'Fixed price' },
      // { id: 4, name: 'First in first out' }
    ];
    $scope.departmentsSorted = CommonFactory.sortAndTreeDepartment($scope.departments);
    $scope.categories = categories;
    $scope.suppliers = suppliers;

    $scope.storeLevelCostingMethod = modules.costing_method;
    $scope.quantityAndCostEditable = Number($scope.storeLevelCostingMethod) != 1;


    $scope.resetDefault = function (suppliers_options, option, disabled) {
      if (disabled) {
        return false;
      }
      _.each(suppliers_options, function (otheroption){
        if (otheroption !== option) {
          otheroption.default = false;
        }
      });
    };

    /* Listing Reference Codes */
    let referenceCodesToRemove = [];

    $scope.addReferenceCode = function () {
      $scope.listing.listing_reference_codes.push({ code: null });
    };

    $scope.removeReferenceCode = function (idx) {
      let toRemove = _.first($scope.listing.listing_reference_codes.splice(idx, 1));
      if (toRemove.id) {
        toRemove.deleted = true;
        referenceCodesToRemove.push(toRemove);
      }
      if (!$scope.listing.listing_reference_codes.length) {
        $scope.listing.listing_reference_codes = [{ code: null }];
      }
    };

    const checkReferenceCode = function (idx) {
      let currentValue = _.get($scope, `listing.listing_reference_codes[${idx}].code`);
      return _.isString(currentValue) && currentValue.length ? null: 'Required';
    };

    const checkReferenceCodeRepetition = function (idx) {
      let currentCode = _.get($scope, `listing.listing_reference_codes[${idx}].code`);
      let allCodes = _.map($scope.listing.listing_reference_codes, 'code');
      return _.lastIndexOf(allCodes, currentCode) === _.indexOf(allCodes, currentCode) ? null: 'Reference has been repeated';
    };

    $scope.validateReferenceCode = function (idx) {
      $scope.listing.listing_reference_codes[idx].error = checkReferenceCode(idx) || checkReferenceCodeRepetition(idx);
    };

    const validateAllReferenceCodes = function () {
      let size = _.size($scope.listing.listing_reference_codes);
      if (size > 1) {
        return _.reduce(_.range(size), (acc, idx) => {
          let valueError = checkReferenceCode(idx);
          let repetitionError = checkReferenceCodeRepetition(idx);
          $scope.listing.listing_reference_codes[idx].error = valueError || repetitionError;
          return acc || valueError || repetitionError;
        }, null);
      } else if (size === 1) {
        if (_.isString($scope.listing.listing_reference_codes[0].code)) {
          let valueError = checkReferenceCode(0);
          $scope.listing.listing_reference_codes[0].error = valueError;
          return valueError;
        } else {
          return null;
        }
      } else {
        return null;
      }
    };

    const getReferenceCodePatch = function (listingId) {
      let ret = referenceCodesToRemove;
      if (Array.isArray($scope.listing.listing_reference_codes) && $scope.listing.listing_reference_codes.length) {
        if ($scope.listing.listing_reference_codes.length == 1 && $scope.listing.listing_reference_codes[0].code == null) {
        } else {
          ret = $scope.listing.listing_reference_codes.concat(ret);
        }
      }
      ret.forEach(c => c.listing_id = listingId);
      return _.map(ret, c => _.pick(c, ["id", "listing_id", "deleted", "code", "created_by_id"]));
    };

    /********************************
     * Ingredient Tracking functions
     ********************************/

    $scope.assignUnit = function (){
      for (var i = 0; i < $scope.unit_groups.length; i ++){
        var unitGroup = $scope.unit_groups[i];
        if ($scope.listing.unit_group_id === unitGroup.id){
          $scope.listing.unit_group = unitGroup;
          for (var k = 0; k < unitGroup.units.length; k ++){
            var unit = $scope.listing.unit_group.units[k];

            if ($scope.listing.default_purchase_order_unit_id === unit.id){
              $scope.listing.default_purchase_order_unit = unit;
            }
            if ($scope.listing.default_order_unit_id === unit.id){
              $scope.listing.default_order_unit = unit;
            }
          }
        }
      }
    };

    $scope.changeUnit = function (unit_group) {
      if (unit_group === null) {
        $scope.listing.unit_group_id = null;
      }
      else {
        $scope.listing.unit_group_id = unit_group.id;
      }
      $scope.listing.default_purchase_order_unit = null;
      $scope.listing.default_order_unit = null;

      $scope.listing.default_purchase_order_unit_id = null;
      $scope.listing.default_order_unit_id = null;
    };


    $scope.changeCostingMethod = function () {
      $scope.quantityAndCostEditable = Number($scope.listing.costing_method) !== 1 && Number($scope.storeLevelCostingMethod) != 1;
    };

    /************************
     * Setting up Grid View
     ************************/

    var salesPoFormatter = function (value, item) {
      var subtext = (item.source_type === 'Order') ? item.order_number :
        ('user_display_name' in item) && item.user_display_name ? ('Adjusted by: ' + item.user_display_name) : '';
      var html = '<div className="nowrap">' +
        $filter('moment')(item.created_at) +
        '</div>' +
        '<span className="text-muted small">' +
        subtext +
        '</span>' +
        '</div>' +
        '</div>';
      return html;
    };

    var qtyDeltaFormatter = function (value, item) {
      var quantity_after = new BigNumber(item.quantity_after);
      var num = Number(quantity_after.minus(item.quantity_before));
      var str = '';
      str = num + '';
      if (num > 0) str = '+' + num;
      return '<div class="_align-center">' + str + '</div>';
    };

    var profitFormatter = function (value, item) {
      return $filter('myCurrency')(item.price - item.cost);
    };
    var costFormatter = function (value, item) {
      return $filter('myCurrency')(item.cost);
    };
    var priceFormatter = function (value, item) {
      return $filter('myCurrency')(item.price);
    };

    var timeFormater = function (value, item) {
      var html = '<div class="_align-center">' + $filter('momentDate')(value) + '<br>' + $filter('momentTime')(value) + '</div>';
      return html;
    };

    var sourceFormatter = function (value, item) {
      let orderNum = item.order_number || '';
      var html = '<div class="_align-center">' + item.source_type + '<br>' + orderNum + '</div>';
      return html;
    };

    // name: column header, ratio: width percentage; field: the field name in array
    // formatter: field data will be formatted by formatter; pattern: input to match this pattern
    var editSalesColumns = [];
    if (DashboardFactory.getStoreModules().qty_and_cost_up_enabled){
      editSalesColumns.push(
        { field: 'origin_store_name', name: gettextCatalog.getString('Origin Store'), ratio: '10%' }
      );
    }

    editSalesColumns = editSalesColumns.concat([
      { field: null, name: gettextCatalog.getString('Effective Date'), ratio: '5%' },
      { field: 'created_at', name: gettextCatalog.getString('Action Date'), ratio: '5%', bindHtml: true, formatter: timeFormater },
      { field: 'user_display_name', name: gettextCatalog.getString('User'), ratio: '5%' },
      { field: null, name: gettextCatalog.getString('Source'), ratio: '5%', bindHtml: true, formatter: sourceFormatter },
      { field: 'action_type', name: gettextCatalog.getString('Action'), ratio: '5%' },
      // { field: null, name: gettextCatalog.getString('Sales/Purchase Order'), ratio: '20%', bindHtml: true, formatter: salesPoFormatter, pattern: /^\S\s$/ },
      { field: null, name: gettextCatalog.getString('QTY Delta'), ratio: '5%', formatter: qtyDeltaFormatter, bindHtml: true, pattern: /^\S\s$/ },
      { field: 'cost_on_order', name: gettextCatalog.getString('Cost on Order'), ratio: '5%' },
      { field: 'cost_after', name: gettextCatalog.getString('Cost After'), ratio: '5%' },
      { field: 'quantity_after', name: gettextCatalog.getString('Available Quantity'), ratio: '5%', pattern: /^\S\s$/ },
      // { field: 'qty_stockroom_after', name: gettextCatalog.getString('Latest Qty Stockroom'), ratio: '5%', pattern: /^\S\s$/ },
      { field: 'qty_reserved_for_invoice_after', name: gettextCatalog.getString('Reserved for Invoice'), ratio: '5%' },
      { field: 'qty_reserved_for_transfer_after', name: gettextCatalog.getString('Reserved for Transfer'), ratio: '5%' },
      { field: 'qty_in_transit_from_supplier_after', name: gettextCatalog.getString('In Transit from Supplier'), ratio: '5%' },
      { field: 'qty_in_transit_from_transfer_after', name: gettextCatalog.getString('In Transit from Transfer'), ratio: '5%' },
    ]);
    $scope.editSalesColumns = editSalesColumns;

    $scope.storeLevelColumns = [
      { field: 'store_name', name: gettextCatalog.getString('Store Name'), ratio: '14%' },
      { field: 'qty_on_shelf', name: gettextCatalog.getString('On Shelf'), ratio: '14%' },
      { field: 'qty_stockroom', name: gettextCatalog.getString('Stockroom'), ratio: '14%' },
      { field: 'qty_reserved_for_invoice', name: gettextCatalog.getString('Reserved for Invoice'), ratio: '14%' },
      { field: 'qty_reserved_for_transfer', name: gettextCatalog.getString('Reserved for Transfer'), ratio: '14%' },
      { field: 'qty_in_transit_from_supplier', name: gettextCatalog.getString('In Transit from Supplier'), ratio: '14%' },
      { field: 'qty_in_transit_from_transfer', name: gettextCatalog.getString('In Transit from Transfer'), ratio: '14%' },
    ];


    /************************
     * Cache and Edit Mode
     ************************/

    var _listingCache = {};
    var _quantityHistoryCache = [];
    var _modifierGroupsCache = [];
    var _bomCache = [];

    $scope.enableEditMode = function () {
      $scope.editMode = true;
      angular.copy($scope.listing, _listingCache);
      angular.copy($scope.quantityHistory, _quantityHistoryCache);
      angular.copy($scope.modifierGroups, _modifierGroupsCache);
      angular.copy($scope.bom, _bomCache);
      $scope.quantityAndCostEditable = Number($scope.listing.costing_method) != 1 && Number($scope.storeLevelCostingMethod) != 1;
      if (!Array.isArray($scope.listing.listing_reference_codes) || !$scope.listing.listing_reference_codes.length) {
        $scope.listing.listing_reference_codes = [{ code: null }];
      }
    };
    $scope.showTranslationEnabled = false;
    $scope.showTranslation = function (){
      $scope.showTranslationEnabled = !$scope.showTranslationEnabled;
    };
    var productTranslation = function (newListing){
      for (var key in newListing._product_translation_map) {
        var item = newListing._product_translation_map[key];
        if (typeof item.name === 'string' && item.name.length > 0) {
          item.locale = key;
          newListing.product_translations.push(item);
        }
      }
      //delete newListing._product_translation_map;
    };
    var productTranslationMap = function (newListing){
      newListing._product_translation_map = {};
      for (var i = 0; i < newListing.product_translations.length; i ++) {
        var item = newListing.product_translations[i];
        newListing._product_translation_map[item.locale] = item;
      }
    };

    /**
     * Actions - create or update item functions
     */
    $scope.bottomActions = [
      ['Cancel', function () {
        if (confirm('Discard all changes?')) {
          if ($state.is('app.dashboard.inventory.new-custom-item') || $state.is('app.dashboard.inventory.new-item')) {
            $state.go('app.dashboard.inventory.index', { store_id: DashboardFactory.getStoreId() });
          }
          else {
            angular.copy(_listingCache, $scope.listing);
            angular.copy(_quantityHistoryCache, $scope.quantityHistory);
            angular.copy(_modifierGroupsCache, $scope.modifierGroups);
            angular.copy(_bomCache, $scope.bom);
            $scope.editMode = false;
          }
        }
      }, false],
      ['Save', function () {
        if (validateAllReferenceCodes()) return;
        if ($state.is('app.dashboard.inventory.new-custom-item') || $state.is('app.dashboard.inventory.new-item') || $state.is('app.dashboard.material.new')) {
          $scope.createItemInitial();
        }
        else {
          $scope.updateItem();
        }
      }, true]
    ];
    if ($state.is('app.dashboard.material.view')) {
      $scope.title = 'Material';
    }

    $scope.getInventoryRequests = function (){
      var promises = [
        InventoryFactory.getInventory($stateParams.listing_id, store_id),
        DashboardFactory.getModifierGroups(),
        InventoryFactory.getQuantityHistory($stateParams.listing_id),
        InventoryFactory.getBOM($stateParams.listing_id,store_id),
        InventoryFactory.getStoreLevel($stateParams.listing_id,store_id)
      ];
      $q.all(promises)
        .then(function (res) {
          $scope.res0(res[0]);
          $scope.res1(res[1]);
          $scope.res2(res[2]);
          $scope.res3(res[3]);
          $scope.res5(res[4]);

        });
    };

    if ($state.is('app.dashboard.inventory.new-custom-item')) {
      $scope.listing = { suppliers: [], listing_reference_codes: [{ code: null}] };
      $scope.editMode = true;
      $scope.listing.customized = true; // customized is also in listing whet GET
      $scope.createItem = InventoryFactory.createCustomItem;

    } else if ($state.is('app.dashboard.inventory.new-item')) {
      $scope.listing = { suppliers: [], listing_reference_codes: [{ code: null}] };
      $scope.editMode = true;
      $scope.isEnteringGtid = true;
      $scope.createItem = InventoryFactory.createItem;
    }
    else if ($state.is('app.dashboard.material.new')) {
      $scope.title = 'Material';
      $scope.editMode = true;
      $scope.listing = {};
      $scope.listing.customized = true;
      $scope.listing.unit_group_id = '';
      $scope.listing.bom_type = 1;
      $scope.createItem = InventoryFactory.createCustomItem;
    }
    else {
      /*
       InventoryFactory.getInventory($stateParams.listing_id, store_id)
       .then(function(res) {
       var data = res.data;
       $scope.unlimited = 'unlimted';
       $scope.listing = data.listing;
       $scope.assignUnit();
       // check tax options
       taxOptions.forEach( function (option) {
       option.checked = _.includes( $scope.listing.tax_option_ids, option.id );
       });

       $scope.oldListing = _.cloneDeep($scope.listing);
       productTranslationMap($scope.listing);
       if ( !$scope.listing.tax_option_id ){
       $scope.listing.tax_option_id = '';
       }
       if ( !$scope.listing.department_id ){
       $scope.listing.department_id = '';
       }


       _.each( $scope.listing.custom_field_values, function(value){
       var key = value.custom_field_name;

       if ( $scope.attributesMap[value.custom_field_name] ){
       $scope.attributesMap[value.custom_field_name].value = value.value;
       }
       });


       return InventoryFactory.getProductImage(data.listing.product_id);


       }).then(function(res){
       $scope.productImages = _.map(res.data, function(d) { return d.product_graphic; });
       return DashboardFactory.getModifierGroups();

       }).then(function(res) {
       var data = res.data;
       data.modifier_groups.forEach(function(item) {
       item.selected = _.includes(item.listing_ids, $scope.listing.id);
       });
       $scope.modifierGroups = data.modifier_groups;

       return InventoryFactory.getQuantityHistory($stateParams.listing_id);

       }).then(function(res) {
       $scope.quantityHistory = res.data;

       return InventoryFactory.getBOM($stateParams.listing_id,store_id);
       }).then(function(res){
       $scope.bom = res.data.bill_of_materials;
       _.each($scope.bom,function(item){
       item.unit_cost = Number(item.cost);
       item.quantity = Number(item.quantity_in_display_unit);
       item.name = item.name_of_material;
       $scope.bomAssignUnit(item);
       $scope.bomChangeUnit(item);
       });

       })
       .catch(function(err) {
       console.error(err);
       });*/
      $scope.getInventoryRequests();
    }



    $scope.res0 = function (res){
      var data = res.data;
      $scope.unlimited = 'unlimted';
      $scope.listing = data.listing;
      // if ($scope.listing.costing_method && !_.isString($scope.listing.costing_method)) {
      //   $scope.listing.costing_method = `${$scope.listing.costing_method}`;
      // }
      // else {
      //   $scope.listing.costing_method = '';
      // }
      $scope.quantityAndCostEditable = Number($scope.listing.costing_method) != 1 && Number($scope.storeLevelCostingMethod) != 1;
      $scope.assignUnit();
      // check tax options
      taxOptions.forEach(function (option) {
        option.checked = _.includes($scope.listing.tax_option_ids, option.id);
      });

      $scope.oldListing = _.cloneDeep($scope.listing);
      productTranslationMap($scope.listing);
      if (!$scope.listing.tax_option_id){
        $scope.listing.tax_option_id = '';
      }
      if (!$scope.listing.department_id){
        $scope.listing.department_id = '';
      }
      if (!$scope.listing.category_name){
        $scope.listing.category_name = '';
      }

      if (!Array.isArray($scope.listing.listing_reference_codes) || !$scope.listing.listing_reference_codes.length) {
        $scope.listing.listing_reference_codes = [{ code: null }];
      }

      _.each($scope.listing.custom_field_values, function (value){
        var key = value.custom_field_name;

        if ($scope.attributesMap[value.custom_field_name]){
          $scope.attributesMap[value.custom_field_name].value = value.value;
        }
      });
      InventoryFactory.getProductImage(data.listing.product_id).then($scope.res4);

    };
    $scope.res4 = function (res){
      $scope.productImages = _.map(res.data, function (d) { return d.product_graphic; });
    };
    $scope.res1 = function (res){
      var data = res.data;
      data.modifier_groups.forEach(function (item) {
        item.selected = _.includes(item.listing_ids, $scope.listing.id);
      });
      $scope.modifierGroups = data.modifier_groups;
    };
    $scope.res2 = function (res){
      $scope.quantityHistory = (res.data||[]).sort((a,b) => {
        const createAtDiff = new Date(b.create_at) - new Date(a.create_at); // desc order
        const idDiff = b.id - a.id; // desc order
        return createAtDiff || idDiff;
      });
    };
    $scope.res3 = function (res){
      $scope.bom = res.data.bill_of_materials;
      _.each($scope.bom,function (item){
        item.unit_cost = Number(item.cost);
        item.quantity = Number(item.quantity_in_display_unit);
        item.name = item.name_of_material;
        $scope.bomAssignUnit(item);
        $scope.bomChangeUnit(item);
      });
    };

    $scope.res5 = function (res) {
      $scope.storeLevelListings = _.map(res.data, 'listing');
    };


    $scope.createItemInitial = function (){
      if (!$scope.myForm.$valid){
        alert('Some values are invalid. Please check again.');
        return;
      }
      if (!$scope.quantityAndCostEditable) {
        $scope.listing.quantity = 0;
      }

      if (!$scope.listing.default_purchase_order_unit){
        $scope.listing.default_purchase_order_unit_id = null;
      }
      if (!$scope.listing.default_order_unit){
        $scope.listing.default_order_unit_id = null;
      }
      productTranslation($scope.listing);
      $scope.createItem($scope.listing)
        .success(function (data) {
          var productId = data[0].listing.product_id; // API always return array
          var listingId = data[0].listing.id; // API always return array
          if (Array.isArray($scope.listing.listing_reference_codes) && $scope.listing.listing_reference_codes.length) {
            InventoryFactory.updateReferenceCodes(listingId, DashboardFactory.getStoreId(), getReferenceCodePatch(listingId));
          }
          if ($scope.productImages.length) {
            // upload inventory images
            _.each($scope.productImages, function (file, i) {
              InventoryFactory.uploadProductImage(productId, file)
                .success(function (data) {
                  if (i === $scope.productImages.length - 1) {

                    if ($state.is('app.dashboard.inventory.new-custom-item') || $state.is('app.dashboard.inventory.new-item')) {
                      $state.go('app.dashboard.inventory.index', {store_id: DashboardFactory.getStoreId()});
                    }
                    else if ($state.is('app.dashboard.material.new')) {
                      $state.go('app.dashboard.material.index', {store_id: DashboardFactory.getStoreId()});
                    }
                  }
                })
                .error(function (err) {
                  console.error(err);
                });
            });
          } else {
            if ($state.is('app.dashboard.inventory.new-custom-item') || $state.is('app.dashboard.inventory.new-item')) {
              $state.go('app.dashboard.inventory.view', { store_id: DashboardFactory.getStoreId(), listing_id: listingId });
            }
            else if ($state.is('app.dashboard.material.new')) {
              $state.go('app.dashboard.material.view', { store_id: DashboardFactory.getStoreId(), listing_id: listingId });
            }

          }
        })
        .error(function (err) {
          $scope.errorMessage = err.message || 'Error when saving';
        });
    };
    $scope.updateItem = function (){
      if (!$scope.myForm.$valid){
        alert('Some values are invalid. Please check again.');
        return;
      }

      if (!$scope.listing.default_purchase_order_unit){
        $scope.listing.default_purchase_order_unit_id = null;
      }
      if (!$scope.listing.default_order_unit){
        $scope.listing.default_order_unit_id = null;
      }

      var newListing = $scope.listing;

   if (newListing.costing_method && !_.isNumber(newListing.costing_method)) newListing.costing_method = Number(newListing.costing_method);
      $scope.listing.custom_field_values = [];

      _.each($scope.attributes,function (attribute) {
        if (typeof attribute.value === 'string'){
          if (attribute.value.length >= 1) {
            $scope.listing.custom_field_values.push(attribute);
          }
          else {
            attribute.delete = true;
            $scope.listing.custom_field_values.push(attribute);
          }
        }
      });



      newListing.tax_option_ids = taxOptionsToIds($scope.taxOptions);
      productTranslation(newListing);

      var bomFormatted = [];
      for (var i = 0; i < $scope.bom.length; i ++){
        var bom = $scope.bom[i];
        var obj = {};
        if (!bom.deleted) {
          obj.listing_id = Number($stateParams.listing_id);
          obj.quantity_in_display_unit = bom.quantity;
          if (bom.default_order_unit) {
            obj.display_unit_id = bom.default_order_unit.id;
          }
          obj.material_id = bom.material_id;
          obj.deleted = bom.deleted;
          if (!bom._isNew) {
            obj.id = bom.id;
          }

          bomFormatted.push(obj);
        }
        else {
          InventoryFactory.deleteBOM($stateParams.listing_id, store_id, bom.id);
        }
      }

      var promises = [
        InventoryFactory.updateInventory($stateParams.listing_id, newListing, $scope.oldListing, $scope.modifierGroups),
        InventoryFactory.updateBOM($stateParams.listing_id, store_id, bomFormatted),
        InventoryFactory.updateReferenceCodes($stateParams.listing_id, store_id, getReferenceCodePatch($stateParams.listing_id))
        // $scope.updateTaxOptions()
      ];


      $q.all(promises)
        .then(function () {
            if ($scope.newProductImages.length) {
              // upload inventory images
              _.each($scope.newProductImages, function (file, i) {
                InventoryFactory.uploadProductImage($scope.listing.product_id, file)
                  .success(function (data) {
                    if (i === $scope.productImages.length - 1) {
                      $state.go($state.current.name, $stateParams, { reload: true });
                    }
                  })
                  .error(function (err) {
                    console.error(err);
                  });
              });
            } else {
              $state.go($state.current.name, $stateParams, { reload: true });
            }
          },
          function (err) {
            $scope.errorMessage = err.message || 'Error when saving';
          });
    };



    $scope.selectNewItemGtid = function () {
      InventoryFactory.checkProduct($scope.gtid).success(function (data) {
        if (data.length > 0) {
          $scope.selectItemMessage = 'Already have a listing with same code in your inventory.';
        } else {
          InventoryFactory.getProduct($scope.gtid)
            .success(function (data) {
              if (Object.keys(data).length === 10) {
                $scope.listing = {
                  gtid: $scope.gtid,
                  upc: $scope.gtid,  // tempoary UPC, will not POST to API.
                  name: data.name,
                  description: data.description,
                  brand_name: data.brand_name
                };
                $scope.isEnteringGtid = false;
              } else {
                $scope.selectItemMessage = 'Item not found.';
              }
            })
            .error(function (err) {
              $scope.selectItemMessage = 'Item not found.';
            });
        }
      }).error(function () {
        $scope.selectItemMessage = 'Check item failed, please try again.';
      });
    };

    $scope.cancelAddingNewItem = function () {
      $state.go('app.dashboard.inventory.index', { store_id: DashboardFactory.getStoreId() });
    };

    $scope.addSupplier = function () {
      $scope.listing.suppliers.push({});
    };
    $scope.removeSupplier = function (supplier) {
      _.pull($scope.listing.suppliers, supplier);
    };
    $scope.addImage = function (file, allFiles) {
      $scope.newProductImages = allFiles;
    };
    $scope.removePhoto = function (image) {
      if (confirm('Are you sure you want to delete this image?')) {
        InventoryFactory.deleteProductImage($scope.listing.product_id, image.id).success(function (){
        });
        _.pull($scope.productImages, image);
      }
    };
    $scope.showQuantityDetail = function () {
      ngDialog.open({
        template: 'app/modules/inventory/quantity_detail.html',
        scope: $scope,
        className: 'ngdialog-theme-default'
      });
    };
    $scope.validateTaxOptions = function (taxOptions, taxOption) {
      if (taxOption.included_in_price && !taxOption.checked) {
        taxOptions.forEach(function (option) {
          if (option.included_in_price) {
            option.checked = false;
          }
        });
        messageFactory.add('only one Included in price tax can enable', 'normal');
      }
    };

    $scope.openQuantityDetail = function () {
      var modules =  DashboardFactory.getStoreModules() || {};
      var template = modules.unit_of_measure_enabled ? 'app/modules/inventory/quantity_detail_with_unit.html' : 'app/modules/inventory/quantity_detail.html';

      ngDialog.open({
        template: template,
        className: 'ngdialog-theme-default',
        scope: $scope,
        controller: 'InventoryQuantityDetailController'
      }).closePromise.then(function (response) {
        if ($scope.onClose) {
          $scope.onClose(response);
        }
      });
    };

    $scope.setImageAsDefault = function (image){
      InventoryFactory.defaultProductImage($scope.listing.product_id, image.id).success(function (){
        $state.go($state.current.name, $stateParams, { reload: true });
      });
    };


    /***************************
     * BOM functions
     ***************************/

    var currencyFormatter = function (value) {
      var defaultCurrency = DashboardFactory.getCurrentStore().currency;
      return $filter('myCurrency')(value, defaultCurrency);
    };
    var totalCostFormatter = function (value, item) {
      var original = item.quantity * item.unit_cost;
      var defaultCurrency = DashboardFactory.getCurrentStore().currency;
      return $filter('myCurrency')(original, defaultCurrency);
    };
    $scope.bom = [];
    $scope.auto_assembly_values = [{value:true,name:'Inventory Item'},{value:false,name:'Non-inventory Item'}];
    $scope.sellable_values = [{value:true,name:'Sellable Item'},{value:false,name:'Non-sellable Item'}];


    $scope.bomColumn =
      [
        {field: 'name', name: 'Material', ratio: '20%'},
        {field: 'type', name: 'Type', ratio: '15%', type: 'number'},
        {field: 'quantity', name: 'QTY To Order', ratio: '15%', editable: true, type: 'number', pattern:/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/},
        {field: 'display_unit_name', name: 'Unit', ratio: '10%', editable: false, type: 'text'},
        {field: 'unit_cost', name: 'Unit Cost', ratio: '20%', editable: false, type: 'text', formatter: currencyFormatter, pattern:/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/},
        {field: 'total_cost', name: 'Total Cost', ratio: '20%', editable: false, type: 'text', formatter: totalCostFormatter, pattern:/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/},
      ];

    $scope.bomAssignUnit = function (item){
      for (var j = 0; j < $scope.unit_groups.length; j ++){
        var unitGroup = $scope.unit_groups[j];
        if (item.unit_group_id === unitGroup.id){
          item.unit_group = unitGroup;
          item.unit_group_name = unitGroup.name;
          for (var k = 0; k < unitGroup.units.length; k ++){
            var unit = item.unit_group.units[k];
            if (item.default_order_unit_id === unit.id){
              item.default_order_unit = unit;
            }
            else if (item.display_unit_id === unit.id){
              item.default_order_unit = unit;
            }
          }
        }
      }
    };

    $scope.removeBOM = function (item){
      item.deleted = true;
      $scope.bomChangeUnit(item);
    };

    $scope.onclose = function (data){
      if (data.value && data.value !== '$closeButton') {
        for (var i = 0; i < data.value.length; i++) {
          var item = data.value[i];

          item.unit_cost = Number(data.value[i].cost);
          item.material_id = Number(data.value[i].id);
          item.material_bom_type = data.value[i].bom_type;
          item.quantity = 0;
          item._isNew = true;
          $scope.bomAssignUnit(item);
          $scope.bomChangeUnit(item);

        }
        if (data.value.length > 0) {
          $scope.bom = $scope.bom.concat(data.value);
        }
      }
    };
    $scope.bomTotalCost = 0;
    $scope.bomChangeUnit = function (item){
      if (item.default_order_unit) {
        item.total_cost = item.quantity * Number(item.default_order_unit.ratio) * item.cost;
      }
      else {
        item.total_cost = item.quantity * item.cost;
      }
      $scope.bomTotalCost = 0;
      for (var i = 0; i <  $scope.bom.length; i ++){
        if (!$scope.bom[i].deleted) {
          $scope.bomTotalCost += $scope.bom[i].total_cost;
        }
      }
    };
  }
}

export class InventoryQuantityDetailController {
  constructor($scope) {
    'ngInject';

    $scope.precision = $scope.listing.quantity_allow_decimal ? 2 : 0;
    $scope.ratio = _.get($scope.listing, 'default_purchase_order_unit.ratio', 1);
    $scope.quantity = _.get($scope.listing, 'qty_on_shelf', 0);
    var units = _.get($scope.listing, 'unit_group.units', []);
    var reference_unit = _.first(_.filter(units, 'is_base_unit'));
    $scope.reference_unit_name = _.get(reference_unit, 'name', 'Reference Unit');
    $scope.selected_unit_name = _.get($scope.listing, 'default_purchase_order_unit.name', 'Selected Unit');
  }
}

function taxOptionsToIds(taxOptions) {
    return _.compact(_.map(taxOptions, function (option) {
        if (option.checked) {
          return option.id;
        }
      }));
}

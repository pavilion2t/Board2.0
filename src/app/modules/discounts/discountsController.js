export class DiscountsController {
  constructor ($rootScope, $scope, $state, $filter, DashboardFactory, gettextCatalog, DiscountFactory, $stateParams) {
    'ngInject';

    $scope.title = 'Discounts';

    $scope.editPermission = DashboardFactory.getCurrentEditPermission('discount');

    // ROUTE
    var store_id = DashboardFactory.getStoreId();
    $scope.route = $rootScope.gateway + '/v2/stores/' + store_id + '/discounts';

    // GRID
    var titleFormatter = function(row, cell, value, columnDef, dataContext) {
      if(dataContext.is_advance_discount) {
        return '<a href="' + store_id + '/discounts/view/advanced/' + dataContext.id + '">' + value + '</a>';
      } else{
        return '<a href="' + store_id + '/discounts/' + dataContext.id + '">' + value + '</a>';
      }

    };
    var typeFormatter = function(row, cell, value, columnDef, dataContext) {
      if( dataContext.mix_and_match ) {
        return gettextCatalog.getString('Mix and Match');
      } else if(dataContext.is_advance_discount){
        return gettextCatalog.getString('Advanced');
      } else{
        return gettextCatalog.getString('Regular');
      }
    };
    var discountFormatter = function(row, cell, value, columnDef, dataContext) {
      if(dataContext.percentage) {
        return (Number(dataContext.percentage) * 100).toFixed(2) + '%';
      } else if(dataContext.amount) {
        return $filter('myCurrency')(dataContext.amount);
      }
    };

    var styleFormatter = function(row, cell, value, columnDef, dataContext) {
      if( dataContext.mix_and_match ) {
        return gettextCatalog.getString('Mix and Match');
      } else {
        return gettextCatalog.getString('Regular');
      }
    };

    $scope.columns = [
      {field: 'name', name: gettextCatalog.getString('Title'), ratio: '50%', formatter: titleFormatter},
      {field: null, name: gettextCatalog.getString('Type'), ratio: '35%', formatter: typeFormatter},
      {field: null, name: gettextCatalog.getString('Discount'), ratio: '15%', formatter: discountFormatter},
    ];
    $scope.actions = [
      ['View', function(item) {
        if(item.is_advance_discount){
          $state.go('app.dashboard.discounts.view_advanced', { store_id: store_id, discount_id: item.id });
        }else{
          $state.go('app.dashboard.discounts.view', { store_id: store_id, discount_id: item.id });
        }
      }],

      ['Delete', function(item) {
        if(!confirm('Do you really want to delete this item?')) return false;
        $scope.loadingGrid = true;
        DiscountFactory.deleteDiscount(item.id)
          .success(function(data) {
            console.log(data);
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function(err) {
            console.error(err);
            $scope.loadingGrid = false;
            $scope.errorMessage = err.message;
          });
      },
        function() {
          return DashboardFactory.getCurrentStore().associate_type === 'MANAGER';
        }]




    ];

    // FILTERS
    var percentageFilterFormatter = function(value, item) {
      return value ? value / 100 : 0;
    };
    var percentageFilterUnformatter = function(value) {
      return value ? value * 100 : 0;
    };
    $scope.filterColumns = [
      {field: 'name', name: 'Title', defaultFilter: true, types: ['contain', 'equal']},
      {field: 'percentage', name: 'Percentage', types: ['equal', 'between'], formatter: percentageFilterFormatter, unformatter: percentageFilterUnformatter},
      {field: 'amount', name: 'Amount', types: ['equal', 'between']},
    ];

    // EXPORTER
    var typeExportFormatter = function(value, item) {
      if(item.percentage) {
        return 'Percentage Off';
      } else if(item.amount) {
        return 'Amount Off';
      }
    };
    var discountExportFormatter = function(value, item) {
      if(item.percentage) {
        return (Number(item.percentage) * 100).toFixed(2) + '%';
      } else if(item.amount) {
        return $filter('myCurrency')(item.amount);
      }
    };
    $scope.exportColumns = [
      {field: 'name', name: gettextCatalog.getString('Title')},
      {field: null, name: gettextCatalog.getString('Type'), exportFormatter: typeExportFormatter},
      {field: null, name: gettextCatalog.getString('Discount'), exportFormatter: discountExportFormatter},
      {field: 'deduct_tax_base', name: gettextCatalog.getString('Deduct Tax Base')},
      {field: 'auto_apply', name: gettextCatalog.getString('Auto Apply Discount')},
      {field: 'notes', name: gettextCatalog.getString('Notes')}
    ];

    // HACKS
    $scope.createNewAdvanced = function(){
      $state.go('^.new_advanced');
    };

    $scope.editDiscountOrder = function(){
      $state.go('^.edit_order');
    };

    $scope.createNew = function(){
      $state.go('^.new');
    };
    $scope.objectWrap = 'discount';
    $scope.isShowingFilters = true;
  }
}

export function DiscountFormItemFactory(GENERAL_DISCOUNT_TYPE){
  'ngInject';

  var factory = {};
  factory.items = [];
  factory.allitems = false;

  factory.departments = [];
  factory.departmentsMap = {};
  factory.alldepartments = false;

  factory.getDiscountedItems = function( discountid ){
    var array = [];
    if ( !factory.allitems ) {
      _.each(factory.items, function (value, i) {
        if (value) {
          var addItem = {};
          addItem.discount_id = discountid;
          addItem.item_id = value.item_id;
          addItem.item_type = GENERAL_DISCOUNT_TYPE.ITEM;
          addItem.deleted = false;
          array.push(addItem);
        }
      });
    }
    else {
      var addItem = {};
      addItem.discount_id = discountid;
      addItem.item_id = null;
      addItem.item_type = GENERAL_DISCOUNT_TYPE.ALL_ITEMS;
      addItem.deleted = false;
      array.push(addItem);
    }

    if ( !factory.alldepartments ){
      _.each(factory.departments, function (value, i) {
        if (value.selected) {
          var addItem = {};
          addItem.discount_id = discountid;
          addItem.item_id = value.id;
          addItem.item_type = GENERAL_DISCOUNT_TYPE.DEPARTMENT;
          addItem.deleted = false;
          array.push(addItem);
        }
      });
    }
    else {
      var addItem = {};
      addItem.discount_id = discountid;
      addItem.item_id = null;
      addItem.item_type = GENERAL_DISCOUNT_TYPE.ALL_DEPARTMENTS;
      addItem.deleted = false;
      array.push(addItem);
    }
    return array;
  };
  return factory;
}

export class DiscountFormController {
  constructor($rootScope, $scope, $state, $stateParams, DashboardFactory, DiscountFactory, DiscountFormItemFactory, PurchaseOrderFormatter, CommonFactory, GENERAL_DISCOUNT_TYPE) {
    'ngInject';

    $scope.newListingsToAdd = [];

    $scope.itemFactory = DiscountFormItemFactory;

    $scope.departmentsSorted = CommonFactory.sortAndTreeDepartment( $scope.itemFactory.departments );
    $scope.itemFactory.departments.length = 0;

    _.each($scope.departmentsSorted, function(value, i) {
      $scope.itemFactory.departments.push(value);
    });

    $scope.parent = $scope.$parent.$parent;



    $scope.editColumns = [
      {field: 'name', name: 'Name', ratio: '25%', formatter: PurchaseOrderFormatter.nameFormatter, bindHtml: true},
      {field: 'price', name: 'Price', ratio: '15%', editable: false, type: 'number', formatter: PurchaseOrderFormatter.dollarFormatter},
      {field: 'cost', name: 'Total Cost', ratio: '15%', formatter: PurchaseOrderFormatter.dollarFormatter}
    ];

    $scope.isEnablingSaveButton = function(){
      return true;
    };
    $scope.startAddingListings = function() {
      $scope.isAddingListings = true;
      $scope.hideQuantity = true;
      $scope.takenIds = _.map($scope.itemFactory.items, function(item) {
        return item.item_id;
      });
    };
    $scope.cancelAddingListings = function() {
      $scope.isAddingListings = false;
      $scope.addErrorMessage = null;
    };
    $scope.searchListings = function(keyword) {
      DashboardFactory.searchListings(keyword)
        .success(function(data) {
          $scope.selectableListings = data.data.listings;
          $scope.isAddingNewItems = true;
          console.log(' $scope.selectableListings',  $scope);
        })
        .error(function(err) {
          console.error(err);
          $scope.addErrorMessage = err.message;
        });
    };

    $scope.addToListings = function() {
      var listingsToAdd = [];
      var error;

      _.each($scope.newListingsToAdd, function(value, i) {
        if(value) {
          var listing = $scope.selectableListings[i];

          var item = {
            item_id: listing.id,
            name: listing.name,
            product_id: listing.product_id,
            price: listing.price,
            retail_price : listing.retail_price,
            cost: listing.cost
          };
          listingsToAdd.push(item);
        }
      });

      if(error) {
        $scope.addErrorMessage = error;
      } else {
        $scope.itemFactory.items = $scope.itemFactory.items.concat(listingsToAdd);
        $scope.isAddingListings = false;
        $scope.newListingsToAdd = [];
        $scope.addErrorMessage = null;
      }
    };

  }
}

export class DiscountViewController {
  constructor(departments, $rootScope, $scope, $state, $stateParams, DashboardFactory, DiscountFactory, DiscountFormItemFactory, PurchaseOrderFormatter, InventoryFactory, GENERAL_DISCOUNT_TYPE) {
    'ngInject';

    var _discountCache = {};
    var _discountFactoryCache = {};

    $scope.editPermission = DashboardFactory.getCurrentEditPermission('discount');

    $scope.discountTypes = [{name:'Percentage Off',value:'percentage'},{name:'Amount Off',value:'amount'}];
    $scope.itemFactory = DiscountFormItemFactory;
    $scope.itemFactory.items.length = 0;
    $scope.itemFactory.allitems = false;
    $scope.itemFactory.departments.length = 0;
    $scope.itemFactory.departmentsMap = [];

    _.each(departments, function(value, i) {
      $scope.itemFactory.departments.push(value);
    });



    $scope.itemFactory.alldepartments = false;

    $scope.enableEditMode = function() {
      $scope.editMode = true;
      angular.copy($scope.discount, _discountCache);
      angular.copy($scope.itemFactory, _discountFactoryCache);
    };

    $scope.bottomActions = [
      ['Cancel', function() {
        if(confirm('Discard all changes?')) {
          $scope.discount = angular.copy(_discountCache, $scope.discount);
          $scope.itemFactory = angular.copy(_discountFactoryCache, $scope.itemFactory);
          $scope.editMode = false;
        }
      }, false],
      ['Save', function() {
        $scope.discount.discountable_items = $scope.itemFactory.getDiscountedItems($scope.discount.id);

        if( $scope.discountType === 'percentage' ){
          $scope.discount.amount = null;
        }
        if( $scope.discountType === 'amount' ){
          $scope.discount.percentage = null;
        }

        DiscountFactory.updateDiscount($stateParams.discount_id, $scope.discount)
          .success(function(data) {
            console.log(data);
            $state.go('app.dashboard.discounts.index', { store_id: DashboardFactory.getStoreId() });
          })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });
      }, true],
    ];


    // load discounts
    DiscountFactory.getDiscount($stateParams.discount_id)
      .success(function(data) {
        console.log(data);
        $scope.discount = data.discount;

        var tz = DashboardFactory.getCurrentStore().timezone;
        $scope.discount.start_from  = moment($scope.discount.start_from).tz(tz).format('YYYY-MM-DD');
        $scope.discount.end_at =  moment($scope.discount.end_at).tz(tz).format('YYYY-MM-DD');




        _.each($scope.discount.discountable_items, function(value, i) {


          if ( value.item_type === GENERAL_DISCOUNT_TYPE.DEPARTMENT ) {
            $scope.itemFactory.departmentsMap[value.item_id] = true;
          }
          else if ( value.item_type === GENERAL_DISCOUNT_TYPE.ITEM ) {
            $scope.itemFactory.items.push(value);
          }
          else if ( value.item_type === GENERAL_DISCOUNT_TYPE.ALL_DEPARTMENTS ) {
            $scope.itemFactory.alldepartments = true;
          }
          else if ( value.item_type === GENERAL_DISCOUNT_TYPE.ALL_ITEMS ) {
            $scope.itemFactory.allitems = true;
          }
        });
        _.each( $scope.itemFactory.departments, function(depValue, i) {
          if ( $scope.itemFactory.departmentsMap[depValue.id] ){
            depValue.selected = true;
          }
        });
        _.each($scope.itemFactory.items, function(value, i) {


          InventoryFactory.getInventory(value.item_id, DashboardFactory.getStoreId())
            .success(function(data) {
              value.name = data.listing.name;
              value.price = data.listing.price;
              value.cost = data.listing.cost;
              value.product_id = data.listing.product_id;
              value.retail_price = data.listing.retail_price;
              value.item_id = data.listing.id;
              InventoryFactory.getProductImage(data.listing.product_id).success(function(data){
                console.log('data', data);
                $scope.productImages = _.map(data, function(d) { return d.product_graphic; });
              });
            })
            .error(function(err) {
              console.error(err);
            });


        });


        $scope.oldDiscount = _.cloneDeep($scope.discount);

        if($scope.discount.amount) {
          $scope.discountType = $scope.discountTypes[1].value;
        } else if($scope.discount.percentage) {
          $scope.discountType = $scope.discountTypes[0].value;
        }
      })
      .error(function(err) {
        console.error(err);
      });
  }
}

export class DiscountNewController {
  constructor(departments,$rootScope, $scope, $state, DashboardFactory, DiscountFactory, DiscountFormItemFactory, GENERAL_DISCOUNT_TYPE) {
    'ngInject';

    $scope.itemFactory = DiscountFormItemFactory;
    $scope.itemFactory.items.length = 0;
    $scope.itemFactory.allitems = false;
    $scope.itemFactory.departments.length = 0;
    $scope.itemFactory.departmentsMap = [];
    $scope.discountTypes = [{name:'Percentage Off',value:'percentage'},{name:'Amount Off',value:'amount'}];

    _.each(departments, function(value, i) {
      $scope.itemFactory.departments.push(value);
    });



    $scope.itemFactory.alldepartments = false;
    $scope.editMode = true;
    $scope.discount = {};
    $scope.bottomActions = [
      ['Cancel', function() {
        $state.go('app.dashboard.discounts.index', { store_id: DashboardFactory.getStoreId() });
      }, false],
      ['Save', function() {

        $scope.discount.discountable_items = $scope.itemFactory.getDiscountedItems($scope.discount.id);
        if( $scope.discountType === 'percentage' ){
          $scope.discount.amount = null;
        }
        if( $scope.discountType === 'amount' ){
          $scope.discount.percentage = null;
        }

        DiscountFactory.createDiscount($scope.discount)
          .success(function(data) {
            console.log(data);
            $state.go('app.dashboard.discounts.index', { store_id: DashboardFactory.getStoreId() });
          })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });
      }, true],
    ];
    $scope.discountType = $scope.discountTypes[1].value;


  }
}

export const GENERAL_DISCOUNT_TYPE = {
  "DEPARTMENT": 1,
  "ITEM": 2,
  "ALL_DEPARTMENTS": 3,
  "ALL_ITEMS": 4
}

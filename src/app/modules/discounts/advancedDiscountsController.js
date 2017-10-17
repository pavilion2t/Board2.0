export class advancedDiscountFormController {
  constructor($rootScope, $scope, $state, $stateParams, DashboardFactory, DiscountFactory, PurchaseOrderFormatter, DISCOUNT_TYPE, ngDialog, $q, TRIGGER, TIME_RANGE_TYPE, DATE_RANGE_EXCLUDE_TYPE, DiscountOptionsFactory, SHIP_METHOD, OUTCOMES, AdvancedDiscountNewItemFactory, DepartmentFactory, CommonFactory, STACKTABLE) {
    'ngInject';

    AdvancedDiscountNewItemFactory.setItems($scope);
    //wait fo customer group api done.
    $scope.hideCustomerGroup = true;
    $scope.hideTiers = false;
    $scope.isChain = DashboardFactory.getCurrentStore().chain;

    //only for UI's data or setting.
    $scope.TRIGGER = TRIGGER;
    $scope.OUTCOMES = OUTCOMES;
    $scope.STACKTABLE = STACKTABLE;

    $scope.dateOptions = {
      dateFormat: 'yy-mm-dd',
      changeMonth: true,
      changeYear: true
    };
    $scope.variableOutcome = false;

    $scope.criteria = {
      isAnyProducts: true,
      isOnlyDepartments: false,
      isExceptDepartments: false,
      isOnlyProducts: false,
      isExceptProducts: false,
      isAnyCustomers: true,
      isOnlyCustomers: false,
      isExceptCustomers: false,
      isOnlyCustomerGroup: false,
      isExceptCustomerGroup: false,
      isAnyMembership: true,
      isOnlyMembership: false,
      isExceptMembership: false,
    };

    AdvancedDiscountNewItemFactory.selectedStores = [];
    $scope.factory = AdvancedDiscountNewItemFactory;

    $scope.$watch('criteria', function(newValues, oldValues) {
      if($scope.criteria.isAnyProducts && !$scope.criteria.isOnlyDepartments &&
        !$scope.criteria.isExceptDepartments && !$scope.criteria.isOnlyProducts && !$scope.criteria.isExceptProducts){
        $scope.criteria.isOnlyDepartments = false;
        $scope.criteria.isExceptDepartments = false;
        $scope.criteria.isOnlyProducts = false;
        $scope.criteria.isExceptProducts = false;
        $scope.exceptDepartments = [];
        $scope.onlyDepartments = [];
        $scope.exceptProducts = [];
        $scope.onlyProducts = [];
      }

      if($scope.criteria.isOnlyDepartments){
        $scope.criteria.isAnyProducts = false;
        $scope.criteria.isExceptDepartments = false;
        $scope.exceptDepartments = [];
      }

      if($scope.criteria.isExceptDepartments){
        $scope.criteria.isAnyProducts = false;
        $scope.criteria.isOnlyDepartments = false;
        $scope.onlyDepartments = [];
      }

      if($scope.criteria.isOnlyCustomers){
        $scope.criteria.isAnyCustomers = false;
        $scope.criteria.isExceptCustomers = false;
        $scope.exceptCustomers = [];
      }

      if($scope.criteria.isExceptCustomers){
        $scope.criteria.isAnyCustomers = false;
        $scope.criteria.isOnlyCustomers = false;
        $scope.onlyCustomers = [];
      }

      if($scope.criteria.isExceptProducts){
        $scope.criteria.isAnyProducts = false;
        $scope.criteria.isOnlyProducts = false;
        $scope.onlyProducts = [];
      }

      if($scope.criteria.isOnlyProducts){
        $scope.criteria.isAnyProducts = false;
        $scope.criteria.isExceptProducts = false;
        $scope.exceptProducts = [];
      }

      if($scope.criteria.isOnlyMembership){
        $scope.criteria.isAnyMembership = false;
        $scope.criteria.isExceptMembership = false;
        $scope.exceptMembership = [];
      }


      if($scope.criteria.isExceptMembership){
        $scope.criteria.isAnyMembership = false;
        $scope.criteria.isOnlyMembership = false;
        $scope.onlyMembership = [];
      }


      if(!$scope.criteria.isOnlyDepartments && !$scope.criteria.isExceptDepartments &&
        !$scope.criteria.isOnlyProducts && !$scope.criteria.isExceptProducts){
        $scope.criteria.isAnyProducts = true;
      }
      if(!$scope.criteria.isOnlyCustomers && !$scope.criteria.isExceptCustomers &&
        !$scope.criteria.isOnlyCustomerGroup && !$scope.criteria.isExceptCustomerGroup){
        $scope.criteria.isAnyCustomers = true;
      }
    }, true);

    $scope.exceptCustomers = [];
    $scope.onlyCustomers = [];
    $scope.exceptCustomerGroup = [];
    $scope.onlyCustomerGroup = [];

    $scope.exceptDepartments = [];
    $scope.onlyDepartments = [];
    $scope.exceptProducts = [];
    $scope.onlyProducts = [];

    $scope.exceptMembership = [];
    $scope.onlyMembership = [];


    $scope.membershipLists = [];
    $scope.discountLists = [];

    $scope.outcomes = [DiscountOptionsFactory.getDefalutOutcomes()];


    //for create a discount. its name as same as the json we ready to post.
    //will pick them from $scope later and post to server.
    $scope.is_advance_discount = true;
    $scope.auto_apply = false;
    $scope.name = "";
    $scope.notes = "";
    $scope.trigger_type = TRIGGER.COMPARATOR_ANY;
    $scope.trigger_by = TRIGGER.TRIGGER_BY_ORDER;
    $scope.trigger_amount = 0;
    $scope.party_size_type = TRIGGER.COMPARATOR_ANY;
    $scope.party_size = null;
    $scope.channels = [];
    $scope.time_range_type = TIME_RANGE_TYPE.INCLUDE;
    $scope.shipping_methods = [];
    $scope.start_from = "";
    $scope.end_at = "";
    $scope.time_range = "";
    $scope.days_of_week = [];
    $scope.deduct_tax_base = false;
    $scope.discountable_items = [];
    $scope.is_tier = false;
    $scope.include_service_fee = false;
    $scope.stackability = STACKTABLE.STACKTABLE_ALL;
    $scope.stackability_selectedIds = [];
    $scope.stackable_discounts = [{
      stackable_type: STACKTABLE.STACKTABLE_ALL
    }];

    // Hack
    $scope.$watch('loaded', function(newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        try {
          $scope.stackability = $scope.stackable_discounts[0].stackable_type;
        } catch (e) {
          $scope.stackability = STACKTABLE.STACKTABLE_ALL;
        }
        if ($scope.stackability === STACKTABLE.STACKTABLE_TO || $scope.stackability === STACKTABLE.NOT_STACKTABLE_TO) {
          $scope.stackability_selectedIds = $scope.stackable_discounts.map(d => d.to_discount_id);
        } else {
          $scope.stackability_selectedIds = []
        }
      }
    }, true);

    // More hack
    $scope.$watch('stackability', function (newVal, oldVal) {
      if ($scope.loaded !== true && $scope.loaded !== undefined) return;
      if (!$scope.editMode) return;
      $scope.stackability_selectedIds = [];
      $scope.stackable_discounts = [{
        stackable_type: newVal
      }];
    });

    $scope.$watchCollection('stackability_selectedIds', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        if ($scope.stackability === STACKTABLE.STACKTABLE_TO || STACKTABLE.NOT_STACKTABLE_TO) {
          if ($scope.stackability_selectedIds.length) {
            $scope.stackable_discounts = $scope.stackability_selectedIds.map(d => ({
              stackable_type: $scope.stackability,
              to_discount_id: d
            }))
          }
        } else {
          $scope.stackable_discounts = [{
            stackable_type: $scope.stackability
          }];
        }
      }
    }, true);

    $scope.$watch(function() {
      var types;
      try{
        types = $scope.outcome_set.outcomes.map(outcome => outcome.value_type)
      } catch(e){
        types = [];
      }
      return types;
    }, function(newVal) {
      $scope.variableOutcome = false;
      newVal.forEach((type, i) => {
        if (type === $scope.OUTCOMES.VARIABLE_PERCENTAGE || type === $scope.OUTCOMES.VARIABLE_ABSOLUTE) {
          $scope.variableOutcome = true;
          $scope.outcome_set.outcomes[i].value = 0;
        } else {
          $scope.outcome_set.outcomes[i].value = $scope.outcome_set.outcomes[i].value || 1;
        }
      });
      if ($scope.variableOutcome === true && $scope.outcome_set.outcomes.length > 1){
        alert('Advance Discount only allow one variable outcome.');
        $scope.variableOutcome = false;
        $scope.outcome_set.outcomes = $scope.outcome_set.outcomes.filter(outcome => outcome.value_type!== $scope.OUTCOMES.VARIABLE_PERCENTAGE && outcome.value_type !== $scope.OUTCOMES.VARIABLE_ABSOLUTE)
      }
    }, true);

    $scope.handleOutcomeMaxInput = function(event, outcome) {
      var value = event.target.value;
      var numVal = parseInt(value);
      if (Number.isFinite(numVal) && numVal > 0) {
        outcome.quantity = numVal;
      } else {
        outcome.quantity = 0;
        event.target.value= 'Unlimited'
      }
    };

    $scope.tiers = [];


    $scope.outcome_set = {
      operator: "and",
      outcomes: $scope.outcomes,
      "k":0
    };

    $scope.sortableOptions = {
      items: '.sortable-items',
      handle: '.drag-anchor',
      stop: function(event, ui){

        console.log('update', $scope.outcome_set.outcomes);
      }
    }

    $scope.sortableOptions2 = {

      handle: '.drag-anchor',
      stop: function(event, ui){

        console.log('update', $scope.outcome_set.outcomes);
      }
    }

    //for <select/> options
    $scope.partysize_equations = DiscountOptionsFactory.getPartySizeOptions();
    $scope.channel_options = DiscountOptionsFactory.getChannelsOpts();
    $scope.trigger_options = DiscountOptionsFactory.getTrigger();
    $scope.ship_method_options = DiscountOptionsFactory.getShipMethodOptions();
    $scope.time_range_options = DiscountOptionsFactory.getTimeRangeOptions();
    $scope.date_range_exclude_options = DiscountOptionsFactory.getDateRangeExcludeOptions();
    $scope.dayOfWeek =  DiscountOptionsFactory.getDayOfWeeks();
    $scope.trigger_type_options = DiscountOptionsFactory.getTriggerType();

    $scope.$watch('trigger_by', function(newValues, oldValues) {
      $scope.outcomes_options = DiscountOptionsFactory.getOutcomesOptions(newValues);
      $scope.trigger_placeholder = newValues === 1 ? "Qty" : "Amount";
      $scope.tiers_trigger_placeholder = newValues === 1 ? "Trigger Qty" : "Trigger Amount";

    });

    $scope.$watch('deduct_tax_base', function(newValues, oldValues) {
      if(newValues === true){
        $scope.include_service_fee = false;
      }
    });

    $scope.$watch('trigger_type', function(newValues, oldValues) {
      if($scope.trigger_type === TRIGGER.COMPARATOR_ANY){
        $scope.trigger_amount = $scope.trigger_amount !== null ? $scope.trigger_amount : null;
      }
      if(newValues === TRIGGER.COMPARATOR_RECURSIVE){
        $scope.hideTiers = true;
        $scope.tiers = [];
      } else{
        $scope.hideTiers = false;
      }

    });

    $scope.value_type_options = DiscountOptionsFactory.getUnitType();

    $scope.$watch('auto_apply', function(newVal, oldVal) {
      $scope.value_type_options = newVal ? DiscountOptionsFactory.getUnitTypeAutoApplied() : DiscountOptionsFactory.getUnitType();
      if (newVal === true) {
        $scope.outcome_set.outcomes.forEach(outcome => {
          if (outcome.value_type === $scope.OUTCOMES.VARIABLE_PERCENTAGE) {
            outcome.value_type = $scope.OUTCOMES.PERCENTAGE;
            outcome.value = 1;
          }
          if (outcome.value_type === $scope.OUTCOMES.VARIABLE_ABSOLUTE) {
            outcome.value_type = $scope.OUTCOMES.ABSOLUTE
            outcome.value = 1;
          }
        });
      }
    });

    //other data for ui, not for data of post directy, need to parse it.
    $scope.effectiveDay = {
      date_start_from: "Invalid date",
      date_end_at: "Invalid date",
      time_start_from: "",
      time_end_at: "",
      date_ranges: []
    };


    $scope.$watch('effectiveDay', function(newValues, oldValues) {
      var tz = DashboardFactory.getCurrentStore().timezone;

      _.forEach(newValues.date_ranges, function(date_range, i){
        if (date_range.date_start_from === "Invalid date" || date_range.date_end_at === "Invalid date") {
          return;
        }

        var start_date = date_range.date_start_from + ' ' + newValues.time_start_from;
        var end_date = date_range.date_end_at + ' ' + newValues.time_end_at;

        $scope.effectiveDay.date_ranges[i].start_from = moment.tz(start_date, tz).format();
        $scope.effectiveDay.date_ranges[i].end_at = moment.tz(end_date, tz).format();
      });
    }, true);

    $scope.addDateRange = function(){
      $scope.effectiveDay.date_ranges.push(DiscountOptionsFactory.getDefaultDateRange());
    };

    $scope.removeDateRange = function(i){
      $scope.effectiveDay.date_ranges.splice(i, 1);
    };

    $scope.addOutcome = function(){
      $scope.outcome_set.outcomes.push(DiscountOptionsFactory.getDefalutOutcomes());
    };

    $scope.removeOutcome = function(i){
      if($scope.outcome_set.outcomes.length > 1){
        $scope.outcome_set.outcomes.splice(i, 1);
      }
    };

    $scope.addTierOutcome = function(outcome){
      outcome.push(DiscountOptionsFactory.getDefalutOutcomes());
    };

    $scope.removeTierOutcome = function(i, outcomes){
      if(outcomes.length > 1){
        outcomes.splice(i, 1);
      }
    };

    $scope.addTier = function(){
      $scope.is_tier = true;
      $scope.tiers.push({
        trigger_amount: 1,
        outcome_set: {
          operator: "and",
          outcomes: [
            DiscountOptionsFactory.getDefalutOutcomes()
          ]
        }
      });
    };

    $scope.removeTier = function(i){

      $scope.tiers.splice(i, 1);

    };

    $scope.searchProducts = function(key){
      return DashboardFactory.searchProductsByName(key, DashboardFactory.getStoreId())
        .then(function(data){
          var items = _.map(data.data, function(item){
            return item.listing;
          });
          return items;
        });
    };

    $scope.fetchedCustomers = false;
    $scope.fetchCustomers = function(){
      if ( !$scope.fetchedCustomers ) {
        DashboardFactory.getCustomers(DashboardFactory.getStoreId()).then(function (data) {
          $scope.customerLists = data;
          $scope.fetchedCustomers = true;
        });
      }
    };

    var promises = [
      DashboardFactory.getDepartments(DashboardFactory.getStoreId()),
      DashboardFactory.getMembership_level(DashboardFactory.getStoreId()),
      DepartmentFactory.get(),
      DashboardFactory.getDiscounts(DashboardFactory.getStoreId())

    ];

    //init input select
    $q.all(promises)
      .then(function(data) {
        var depts = data[0];
        var membership_levels = data[1].data.membership_levels;
        var departments = _.map(data[2].data, function(item){
          return item.department;
        });
        $scope.discountLists = data[3];
        var _depts = _.sortBy(_.cloneDeep(departments), function(dept) {
          return dept.depth;
        });

        // New Tree Node Simple Walk
        // 1. 2 loops to walk through the list, set up children relationship
        _.each(departments, function(dept) {
          dept._children = [];
          _.each(departments, function(dept2) {
            if ( dept.id === dept2.parent_id ) {
              dept._children.push(dept2);
            }
          });
        });

        // 2. If node is not on top level, remove it, push to new array.
        var newDeptments = [];
        _.each(departments, function(dept, i) {
          if ( dept.parent_id === null ){
            newDeptments.push(dept);
          }
        });



        // $scope.departments for <select>
        $scope.departments = CommonFactory.sortAndTreeDepartment(departments);



        membership_levels =_.map(membership_levels, function(item){
          item.name = item.title;
          return item;
        })

        $scope.membershipLists = membership_levels;
        // $scope.departmentLists = angular.copy(departments);
        $scope.departmentLists = angular.copy(newDeptments);
        $scope.exceptDepartmentLists = angular.copy(depts);

      });

    $scope.productLists = [];
    $scope.outcomeProductLists = {};
    $scope.outcomeInExProductLists = {};
    $scope.tiersOutcomeProductLists = {};
    $scope.tiersOutcomeInExProductLists = {};
  }
}

export class advancedDiscountNewController {
  constructor($rootScope, $scope, $state, $stateParams, DashboardFactory, DiscountFactory, DiscountFormItemFactory, PurchaseOrderFormatter, CommonFactory, DISCOUNT_TYPE, ngDialog, $q, TRIGGER, TIME_RANGE_TYPE, DATE_RANGE_EXCLUDE_TYPE, DiscountOptionsFactory, SHIP_METHOD, OUTCOMES, AdvancedDiscountNewItemFactory) {
    'ngInject';

    $scope.editMode = true;
    $scope.isSubmitting = false;
    $scope.bottomActions = [
      ['Cancel', function() {
        $state.go('app.dashboard.discounts.index', { store_id: DashboardFactory.getStoreId() });

      }, false],
      ['Save', function() {
        $scope.isSubmitting = true;
        var items = AdvancedDiscountNewItemFactory.getItems();
        if(items.effectiveDay.time_start_from === "" && items.effectiveDay.time_end_at === ""){
          items.time_range = null;
        } else {
          items.effectiveDay.time_start_from = items.effectiveDay.time_start_from === "" ? "0000" : items.effectiveDay.time_start_from;
          items.effectiveDay.time_end_at = items.effectiveDay.time_end_at === "" ? "2359" : items.effectiveDay.time_end_at;
          items.time_range = items.effectiveDay.time_start_from.split(":").join("") + items.effectiveDay.time_end_at.split(":").join("");
        }
        items.date_ranges = _.map(items.effectiveDay.date_ranges, function(date_range, i){
          return _.pick(date_range, ['id', 'discount_id', 'start_from', 'end_at', 'exclude']);
        });

        var discounts = _.pick(items, ['name', 'notes', 'trigger_type', 'trigger_by', 'party_size',
          'trigger_amount', 'party_size_type', 'channels', 'time_range_type', 'shipping_methods',
          'start_from', 'end_at', 'date_ranges', 'days_of_week', 'deduct_tax_base', 'discountable_items', 'tiers',
          'outcome_set', 'is_advance_discount', 'is_tier', 'time_range', 'include_service_fee', 'auto_apply', 'stackable_discounts', 'code']);

        DiscountFactory.transferDiscountItems(items, discounts);

        discounts = DiscountFactory.transferDecimalPercentage(discounts, true);
        if(discounts.tiers.length === 0){
          discounts.is_tier = false;
        }

        discounts.blacklist_stores = [];
        $scope.factory = AdvancedDiscountNewItemFactory;
        for ( var i = 0; i < $scope.factory.selectedStores.length; i++ ){
          discounts.blacklist_stores.push( { 'store_id':$scope.factory.selectedStores[i] } );
        }


        console.log("discounts", discounts);
        DiscountFactory.createDiscount(discounts)
          .success(function(data) {
            $scope.isSubmitting = false;
            $state.go('app.dashboard.discounts.index', { store_id: DashboardFactory.getStoreId() });
          })
          .error(function(err) {
            console.error(err);
            $scope.isSubmitting = false;
            $scope.errorMessage = err.message || 'Error when saving';
          });


      }, true],
    ];

  }
}

export class advancedDiscountViewController{
  constructor($rootScope, $scope, $state, $stateParams, DashboardFactory, DiscountFactory, DiscountFormItemFactory, PurchaseOrderFormatter, CommonFactory, DISCOUNT_TYPE, ngDialog, $q, TRIGGER, TIME_RANGE_TYPE, DiscountOptionsFactory, SHIP_METHOD, OUTCOMES, AdvancedDiscountNewItemFactory) {
    'ngInject';

    $scope.editMode = false;
    $scope.factory = AdvancedDiscountNewItemFactory;

    var promises = [
      DashboardFactory.getDepartments(DashboardFactory.getStoreId()),
      DiscountFactory.getDiscount($stateParams.discount_id),
      DashboardFactory.getMembership_level(DashboardFactory.getStoreId()),
      DiscountFactory.getBlacklist($stateParams.discount_id)
    ];


    $scope.fetchedCustomers = false;
    $scope.fetchCustomers = function(){
      if ( !$scope.fetchedCustomers ) {
        DashboardFactory.getCustomers(DashboardFactory.getStoreId()).then(function (data) {
          $scope.customerLists = data;
          $scope.fetchedCustomers = true;
        });
      }
    };

    //init input select

    $q.all(promises)
      .then(function(data) {
        //var customers = data[0];
        var depts = data[0];
        var discounts = data[1].data.discount;
        var membership_levels = data[2].data.membership_levels;
        membership_levels =_.map(membership_levels, function(item){
          item.name = item.title;
          return item;
        });

        var blacklist = data[3].data.blacklist_stores;
        for ( var i = 0; i < blacklist.length; i ++ ){
          $scope.factory.selectedStores.push(blacklist[i].store_id);
        }

        var scope = AdvancedDiscountNewItemFactory.getItems();
        scope.membershipLists = membership_levels;
        scope.departmentLists = angular.copy(depts);
        scope.exceptDepartmentLists = angular.copy(depts);

        //init data..
        for(var key in discounts){
          scope[key] = discounts[key];
        }
        scope['loaded'] = true;

        //type parse for UI..

        scope.trigger_amount = parseFloat(scope.trigger_amount);

        // date ranges
        var tz = DashboardFactory.getCurrentStore().timezone;
        var formatDate = function(date){
          return moment(date).tz(tz).format('YYYY-MM-DD');
        };
        scope.effectiveDay.date_ranges = [];
        // convert depracate data to date_ranges
        if(scope.start_from || scope.end_at){
          scope.effectiveDay.date_ranges.push({
            start_from: scope.start_from,
            end_at: scope.end_at,
            date_start_from: formatDate(scope.start_from),
            date_end_at: formatDate(scope.end_at),
            exclude: scope.time_range_type === TIME_RANGE_TYPE.EXCLUDE
          });
          scope.start_from = null;
          scope.end_at = null;
        }
        // map date_ranges
        _.forEach(scope.date_ranges, function(item, i){
          scope.effectiveDay.date_ranges.push({
            id: item.id,
            discount_id: item.discount_id,
            start_from: item.start_from,
            end_at: item.end_at,
            date_start_from: formatDate(item.start_from),
            date_end_at: formatDate(item.end_at),
            exclude: item.exclude
          });
        });

        if(scope.time_range !== null){
          //parse time.

          var start_time = scope.time_range.slice(0, 4);
          var end_time = scope.time_range.slice(4, 8);

          scope.effectiveDay.time_start_from = moment(start_time, 'HH:mm').format('HH:mm');
          scope.effectiveDay.time_end_at = moment(end_time, 'HH:mm').format('HH:mm');
        }

        _.forEach(scope.outcome_set.outcomes, function(item, i){

          var reqs = [];
          var reqs2 = [];
          _.forEach(item.product_ids, function(pid){
            reqs.push(DashboardFactory.searchProductsById(pid));
          });



          _.forEach(item.exlcude_product_ids, function(pid){
            reqs2.push(DashboardFactory.searchProductsById(pid));
          });



          $q.all(reqs).then(function(data){

            var items = [];
            _.forEach(data, function(d){
              _.forEach(d.data, function(item){
                items.push(item.listing);
              });
            });
            items = _.uniq(items, 'product_id');

            var ids = _.map(items, function(item){
              return item.product_id;
            })

            scope.outcomeProductLists[i] = items;



          });

          $q.all(reqs2).then(function(data){

            var items = [];
            _.forEach(data, function(d){
              _.forEach(d.data, function(item){
                items.push(item.listing);
              });
            });

            items = _.uniq(items, 'product_id');

            var ids = _.map(items, function(item){
              return item.product_id;
            })



            scope.outcomeInExProductLists[i] = items;


          });
        });

        //for tiers oucome
        _.forEach(scope.tiers, function(tier, i){
          _.forEach(tier.outcome_set.outcomes, function(item){
            var reqs = [];
            _.forEach(item.product_ids, function(pid){
              reqs.push(DashboardFactory.searchProductsById(pid));
            });

            $q.all(reqs).then(function(data){

              var items = [];
              _.forEach(data, function(d){
                _.forEach(d.data, function(item){
                  items.push(item.listing);
                });
              });


              var ids = _.map(items, function(item){
                return item.product_id;
              })

              console.log('item', items);
              scope.tiersOutcomeProductLists[i] = items;
              scope.tiersOutcomeInExProductLists[i] = items;

            });
          });
        });


        //parse json data for UI.
        _.forEach(scope.discountable_items, function(item){

          switch(item.item_type) {
            case DISCOUNT_TYPE.ITEM_TYPE_CUSTOMER:
              _.forEach(scope.customerLists, function(c){
                if(c.id === item.item_id){
                  scope.onlyCustomers.push(c.id);
                  scope.criteria.isOnlyCustomers = true;
                }
              });
              break;

            case DISCOUNT_TYPE.ITEM_TYPE_EXCEPT_CUSTOMER:
              _.forEach(scope.customerLists, function(c){
                if(c.id === item.item_id){
                  scope.exceptCustomers.push(c.id);
                  scope.criteria.isExceptCustomers = true;
                }
              });
              break;

            case DISCOUNT_TYPE.ITEM_TYPE_DEPARTMENT:
              _.forEach(scope.departmentLists, function(c){
                if(c.id === item.item_id){
                  scope.onlyDepartments.push(item.item_id);
                  scope.criteria.isOnlyDepartments = true;
                }
              });
              break;

            case DISCOUNT_TYPE.ITEM_TYPE_EXCEPT_DEPARTMENT:

              _.forEach(scope.departmentLists, function(c){
                if(c.id === item.item_id){
                  scope.exceptDepartments.push(c.id);
                  scope.criteria.isExceptDepartments = true;
                }
              });
              break;

            case DISCOUNT_TYPE.ITEM_TYPE_MEMBERSHIP_LEVEL:
              _.forEach(scope.membershipLists, function(c){
                if(c.id === item.item_id){
                  scope.onlyMembership.push(c.id);
                  scope.criteria.isOnlyMembership = true;
                }
              });
              break;

            case DISCOUNT_TYPE.ITEM_TYPE_EXCEPT_MEMBERSHIP_LEVEL:
              _.forEach(scope.membershipLists, function(c){
                if(c.id === item.item_id){
                  scope.exceptMembership.push(c.id);
                  scope.criteria.isExceptMembership = true;
                }
              });
              break;


            case DISCOUNT_TYPE.ITEM_TYPE_PRODUCT:
              DashboardFactory.searchProductsById(item.item_id).then(function(data){
                try {
                  data = data.data;
                  scope.productLists.push(data[0].listing);
                  scope.onlyProducts.push(data[0].listing.product_id);
                  scope.criteria.isOnlyProducts = true;
                } catch(e) {
                  console.error('exception', e);
                }

              });

              break;

            case DISCOUNT_TYPE.ITEM_TYPE_EXCEPT_PRODUCT:
              DashboardFactory.searchProductsById(item.item_id).then(function(data){
                try {
                  data = data.data;
                  scope.productLists.push(data[0].listing);
                  scope.exceptProducts.push(data[0].listing.product_id);
                  scope.criteria.isExceptProducts = true;
                } catch(e) {
                  console.error('exception', e);
                }

              });

              break;

          }
        });




        DiscountFactory.transferDecimalPercentage(scope, false);

      });


    $scope.bottomActions = [
      ['Cancel', function() {
        $state.go('app.dashboard.discounts.index', { store_id: DashboardFactory.getStoreId() });
      }, false],
      ['Save', function() {


        var items = AdvancedDiscountNewItemFactory.getItems();

        if(items.effectiveDay.time_start_from === "" && items.effectiveDay.time_end_at === ""){
          items.time_range = null;
        } else {
          items.effectiveDay.time_start_from = items.effectiveDay.time_start_from === "" ? "0000" : items.effectiveDay.time_start_from;
          items.effectiveDay.time_end_at = items.effectiveDay.time_end_at === "" ? "2359" : items.effectiveDay.time_end_at;
          items.time_range = items.effectiveDay.time_start_from.split(":").join("") + items.effectiveDay.time_end_at.split(":").join("");
        }
        items.date_ranges = _.map(items.effectiveDay.date_ranges, function(date_range, i){
          return _.pick(date_range, ['id', 'discount_id', 'start_from', 'end_at', 'exclude']);
        });

        var discounts = _.pick(items, ['name', 'notes', 'trigger_type', 'trigger_by', 'party_size',
          'trigger_amount', 'party_size_type', 'channels', 'time_range_type', 'shipping_methods',
          'start_from', 'end_at', 'date_ranges', 'days_of_week', 'deduct_tax_base', 'discountable_items', 'tiers',
          'outcome_set', 'is_advance_discount', 'is_tier', 'time_range', 'include_service_fee', 'auto_apply', 'stackable_discounts', 'code']);

        discounts = DiscountFactory.transferDecimalPercentage(discounts, true);

        console.log("discounts", discounts);

        discounts.blacklist_stores = [];

        for ( var i = 0; i < $scope.factory.selectedStores.length; i++ ){
          discounts.blacklist_stores.push( { 'store_id':$scope.factory.selectedStores[i] } );
        }


        DiscountFactory.transferDiscountItems(items, discounts);
        if(discounts.tiers.length === 0){
          discounts.is_tier = false;
        }

        DiscountFactory.updateDiscount($stateParams.discount_id, discounts)
          .success(function(data) {
            $state.go('app.dashboard.discounts.index', { store_id: DashboardFactory.getStoreId() });
          })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });

      }, true],
    ];
  }
}

export function AdvancedDiscountNewItemFactory(DISCOUNT_TYPE){
  'ngInject';

  var factory = {};
  factory.setItems = function(discounts){
    factory.items = discounts;
  };

  factory.getItems = function( discountid ){
    return factory.items;
  };
  return factory;
}

export const DISCOUNT_TYPE = {
  "ITEM_TYPE_PRODUCT": 0,
  "ITEM_TYPE_DEPARTMENT": 1,
  "ITEM_TYPE_ALL_DEPARTMENT": 3, // discount for all depts, exclude items has no dept
  "ITEM_TYPE_ALL_PRODUCT": 4,
  "ITEM_TYPE_EXCEPT_DEPARTMENT": 5, // all depts except specific depts offered
  "ITEM_TYPE_EXCEPT_PRODUCT": 6,
  "ITEM_TYPE_CUSTOMER": 7,
  "ITEM_TYPE_MEMBERSHIP_LEVEL": 8,
  "ITEM_TYPE_EXCEPT_CUSTOMER": 9,
  "ITEM_TYPE_EXCEPT_MEMBERSHIP_LEVEL": 10
}

export const TRIGGER = {
  "TRIGGER_BY_ORDER": 0,
  "TRIGGER_BY_PRODUCT": 1,
  "COMPARATOR_ANY": 0,
  "COMPARATOR_EQ": 1,
  "COMPARATOR_GT": 2,
  "COMPARATOR_GTE": 3,
  "COMPARATOR_LT": 4,
  "COMPARATOR_LTE": 5,
  "COMPARATOR_RECURSIVE": 6
}

export const TIME_RANGE_TYPE = {
  "INCLUDE": 1,
  "EXCLUDE": 2
}

export const DATE_RANGE_EXCLUDE_TYPE = {
  "INCLUDE": false,
  "EXCLUDE": true
}

export const CHANNELS = {
  "CHANNEL_POS": 0,
  "CHANNEL_POS_CP": 1,
  "CHANNEL_POS_CNP": 2,
  "CHANNEL_WEB": 3,
  "CHANNEL_MOBILE": 4,
  "CHANNEL_MARKETPLACE": 5
}

export const SHIP_METHOD = {
  "PICK_UP": 0,
  "DELIVERY": 1,
  "SIT_IN": 2,
  "EAT_IN": 3
}

export const OUTCOMES = {
  "OFF_LOWEST": 'off_lowest_price_items',
  "OFF_DELIVERY": 'off_delivery',
  "OFF_SERVICE": 'off_service_fee',
  "OFF_SPECIFIC": 'off_specific',
  "OFF_ENTIRE": 'off_entire_order',
  "OFF_ANOTHER": 'off_another_items',
  "PERCENTAGE": 'percentage',
  "ABSOLUTE": 'absolute',
  "VARIABLE_PERCENTAGE": 'variable_percentage',
  "VARIABLE_ABSOLUTE": 'variable_absolute'
}

export const STACKTABLE = {
  "STACKTABLE_ALL": 0,
  "NOT_STACKTABLE_ALL": 1,
  "STACKTABLE_TO": 2,
  "NOT_STACKTABLE_TO": 3
}




export function DiscountOptionsFactory($rootScope, $http, CHANNELS, TRIGGER, SHIP_METHOD, TIME_RANGE_TYPE, DATE_RANGE_EXCLUDE_TYPE, OUTCOMES) {
  'ngInject';

  var getChannelsOpts = function(){
    return [{
      name: "POS",
      id: CHANNELS.CHANNEL_POS
    },{
      name: "WEB",
      id: CHANNELS.CHANNEL_WEB
    },{
      name: "MOBILE",
      id: CHANNELS.CHANNEL_MOBILE
    },{
      name: "MARKETPLACE",
      id: CHANNELS.CHANNEL_MARKETPLACE
    }];
  };

  var getTriggerType = function(){
    return [{
      name: "ANY",
      value: TRIGGER.COMPARATOR_ANY
    },{
      name: "Equal to",
      value: TRIGGER.COMPARATOR_EQ
    },{
      name: ">",
      value: TRIGGER.COMPARATOR_GT
    },
      {
        name: ">=",
        value: TRIGGER.COMPARATOR_GTE
      },
      {
        name: "<",
        value: TRIGGER.COMPARATOR_LT
      },
      {
        name: "<=",
        value: TRIGGER.COMPARATOR_LTE
      },
      {
        name: "Recursive",
        value: TRIGGER.COMPARATOR_RECURSIVE
      }];
  };

  var getTrigger = function(){
    return [
      {
        name: "Product",
        value: TRIGGER.TRIGGER_BY_PRODUCT
      },{
        name: "Order Total",
        value: TRIGGER.TRIGGER_BY_ORDER
      }
    ];

  };

  var getPartySizeOptions = function(){
    return [
      {
        name: "ANY",
        value: TRIGGER.COMPARATOR_ANY
      },{
        name: "Equal to",
        value: TRIGGER.COMPARATOR_EQ
      },{
        name: ">",
        value: TRIGGER.COMPARATOR_GT
      },{
        name: "<",
        value: TRIGGER.COMPARATOR_LT
      }
    ];
  };

  var getShipMethodOptions = function(){
    return [
      {
        name: "PICK UP",
        id: SHIP_METHOD.PICK_UP
      },{
        name: "DELIVERY",
        id: SHIP_METHOD.DELIVERY
      },{
        name: "DINE IN",
        id: SHIP_METHOD.SIT_IN
      },{
        name: "EAT IN",
        id: SHIP_METHOD.EAT_IN
      }
    ];
  };

  var getTimeRangeOptions = function(){
    return [
      {
        name: "Include",
        value: TIME_RANGE_TYPE.INCLUDE
      },{
        name: "Exclude",
        value: TIME_RANGE_TYPE.EXCLUDE
      }
    ];
  };

  var getDateRangeExcludeOptions = function(){
    return [
      {
        name: "Include",
        value: DATE_RANGE_EXCLUDE_TYPE.INCLUDE
      },{
        name: "Exclude",
        value: DATE_RANGE_EXCLUDE_TYPE.EXCLUDE
      }
    ];
  };

  var getDayOfWeeks = function(){
    return [{
      id: 1,
      name: "Mon"
    },{
      id: 2,
      name: "Tue"
    },{
      id: 3,
      name: "Wed"
    },{
      id: 4,
      name: "Thu"
    },{
      id: 5,
      name: "Fri"
    },{
      id: 6,
      name: "Sat"
    },{
      id: 0,
      name: "Sun"
    }];
  };

  var getOutcomesOptions = function(type){
    if(type === 1){
      return [{
        name: 'Off Lowest Price Items',
        value: OUTCOMES.OFF_LOWEST
      },
        {
          name: 'Off Delivery',
          value: OUTCOMES.OFF_DELIVERY
        },
        {
          name: 'Off Service Fee',
          value: OUTCOMES.OFF_SERVICE
        },
        {
          name: 'Off Specific',
          value: OUTCOMES.OFF_SPECIFIC
        },
        {
          name: 'Off Entire Order',
          value: OUTCOMES.OFF_ENTIRE
        },
        {
          name: 'Off Another Items',
          value: OUTCOMES.OFF_ANOTHER
        }];
    }else{
      return [{
        name: 'Off Delivery',
        value: OUTCOMES.OFF_DELIVERY
      },
        {
          name: 'Off Service Fee',
          value: OUTCOMES.OFF_SERVICE
        },
        {
          name: 'Off Specific',
          value: OUTCOMES.OFF_SPECIFIC
        },
        {
          name: 'Off Entire Order',
          value: OUTCOMES.OFF_ENTIRE
        },
        {
          name: 'Off Lowest Price Item',
          value: OUTCOMES.OFF_LOWEST
        }];
    }

  };

  var getUnitType = function(){
    return [{
      name: 'Percentage',
      value: OUTCOMES.PERCENTAGE
    },{
      name: 'Absolute',
      value: OUTCOMES.ABSOLUTE
    }, {
      name: 'Variable Percentage',
      value: OUTCOMES.VARIABLE_PERCENTAGE
    }, {
      name: 'Variable Absolute',
      value: OUTCOMES.VARIABLE_ABSOLUTE
    }];
  };

  var getUnitTypeAutoApplied = function(){
    return [{
      name: 'Percentage',
      value: OUTCOMES.PERCENTAGE
    },{
      name: 'Absolute',
      value: OUTCOMES.ABSOLUTE
    }];
  };

  var getDefalutOutcomes = function(){
    return {
      type: OUTCOMES.OFF_ENTIRE,
      quantity: 1,
      value: 1,
      value_type: OUTCOMES.PERCENTAGE,
      product_ids: [],
      department_ids: [],
      exlcude_product_ids: [],
      exclude_department_ids: [],
      exclude_department: true,
      exclude_product: true
    };
  };

  var getDefaultDateRange = function(){
    return {
      date_start_from: 'Invalid date',
      date_end_at: 'Invalid date',
      exclude: false,
    };
  };


  return {
    getTriggerType: getTriggerType,
    getChannelsOpts: getChannelsOpts,
    getPartySizeOptions: getPartySizeOptions,
    getTrigger: getTrigger,
    getShipMethodOptions: getShipMethodOptions,
    getTimeRangeOptions: getTimeRangeOptions,
    getDateRangeExcludeOptions: getDateRangeExcludeOptions,
    getDayOfWeeks: getDayOfWeeks,
    getOutcomesOptions: getOutcomesOptions,
    getUnitType: getUnitType,
    getUnitTypeAutoApplied: getUnitTypeAutoApplied,
    getDefalutOutcomes: getDefalutOutcomes,
    getDefaultDateRange: getDefaultDateRange
  };

}

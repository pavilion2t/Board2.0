export function DiscountFactory($rootScope, $http, DashboardFactory, DISCOUNT_TYPE) {
  'ngInject';

  var getDiscount = function (id) {
    return $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/discounts/' + id);
  };
  var createDiscount = function (discount) {
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/discounts', { discount: discount });
  };
  // not using diff due to backend quirks
  var updateDiscount = function (id, discount) {
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/discounts/' + id, { discount: discount });
  };
  var deleteDiscount = function (id) {
    return $http.delete($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/discounts/' + id);
  };
  var getBlacklist = function(id){
    return $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/discounts/' + id + '/blacklist_stores');
  };

  var makeDisountableItems = function (discountable_items, DISCOUNT_TYPE, values) {
    angular.forEach(values, function (value, key) {
      discountable_items.push({
        item_type: DISCOUNT_TYPE,
        item_id: value
      });
    });
  };

  var transferDiscountItems = function (items, discounts) {
    discounts.discountable_items = [];
    console.log('item', items);
    if (items.onlyDepartments.length) {
      makeDisountableItems(discounts.discountable_items, DISCOUNT_TYPE.ITEM_TYPE_DEPARTMENT, items.onlyDepartments);
    } else if (items.exceptDepartments.length) {
      makeDisountableItems(discounts.discountable_items, DISCOUNT_TYPE.ITEM_TYPE_EXCEPT_DEPARTMENT, items.exceptDepartments);
    }

    if (items.onlyProducts.length) {
      makeDisountableItems(discounts.discountable_items, DISCOUNT_TYPE.ITEM_TYPE_PRODUCT, items.onlyProducts);
    } else if (items.exceptProducts.length) {
      makeDisountableItems(discounts.discountable_items, DISCOUNT_TYPE.ITEM_TYPE_EXCEPT_PRODUCT, items.exceptProducts);
    }

    if (items.onlyMembership.length) {
      makeDisountableItems(discounts.discountable_items, DISCOUNT_TYPE.ITEM_TYPE_MEMBERSHIP_LEVEL, items.onlyMembership);
    } else if (items.exceptMembership.length) {
      makeDisountableItems(discounts.discountable_items, DISCOUNT_TYPE.ITEM_TYPE_EXCEPT_MEMBERSHIP_LEVEL, items.exceptMembership);
    }

    if (!items.onlyDepartments.length && !items.onlyProducts.length && !items.exceptProducts.length && !items.exceptDepartments.length) {
      discounts.discountable_items.push({
        item_type: DISCOUNT_TYPE.ITEM_TYPE_ALL_PRODUCT
      });

      discounts.discountable_items.push({
        item_type: DISCOUNT_TYPE.ITEM_TYPE_ALL_DEPARTMENT
      });
    }

    if (items.onlyCustomers.length) {
      makeDisountableItems(discounts.discountable_items, DISCOUNT_TYPE.ITEM_TYPE_CUSTOMER, items.onlyCustomers);
    } else if (items.exceptCustomers.length) {
      makeDisountableItems(discounts.discountable_items, DISCOUNT_TYPE.ITEM_TYPE_EXCEPT_CUSTOMER, items.exceptCustomers);
    } else {
      _.remove(discounts.discountable_items, function (item) {
        return item.item_type === DISCOUNT_TYPE.ITEM_TYPE_CUSTOMER || item.item_type === DISCOUNT_TYPE.ITEM_TYPE_EXCEPT_CUSTOMER;
      });

    }
  };

  var transferDecimalPercentage = function (discounts, isDecimalToPercentage) {
    if (isDecimalToPercentage) discounts = _.cloneDeep(discounts);

    _.map(discounts.outcome_set.outcomes, function (item) {
      if (item.value_type === 'percentage') {
        item.value = isDecimalToPercentage === true ? item.value /= 100 : parseInt(item.value *= 100);
      }
      return item;
    });

    _.map(discounts.tiers, function (item) {
      var ii = _.map(item.outcome_set.outcomes, function (outcome) {
        if (outcome.value_type === 'percentage') {
          outcome.value = isDecimalToPercentage === true ? outcome.value /= 100 : parseInt(outcome.value *= 100);
        }
        return outcome;
      });
      return item;
    });

    return discounts;
  };


  return {
    getDiscount: getDiscount,
    createDiscount: createDiscount,
    updateDiscount: updateDiscount,
    deleteDiscount: deleteDiscount,
    makeDisountableItems: makeDisountableItems,
    transferDiscountItems: transferDiscountItems,
    transferDecimalPercentage: transferDecimalPercentage,
    getBlacklist:getBlacklist
  };

}

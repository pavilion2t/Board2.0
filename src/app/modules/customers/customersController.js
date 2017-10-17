export class CustomersController {
  constructor($scope, $rootScope, $state, AuthFactory, DashboardFactory, FormatterFactory, gettextCatalog, CustomerFactory, $stateParams, messageFactory, membershipLevels) {
    'ngInject';

    $scope.title = 'Customers';

    $scope.membershipLevels = membershipLevels.data;
    $scope.editPermission = DashboardFactory.getCurrentEditPermission('customer');

    // ROUTE
    var store_id = DashboardFactory.getStoreId();
    $scope.route = $rootScope.goApi + '/api/v2/stores/' + store_id + '/customers';

    // GRID
    var customerFormatter = function(row, cell, value, columnDef, dataContext) {
      return '<a href="' + store_id + '/customers/'+ dataContext.id+'">' + dataContext.name + '</a>';
    };
    var genderFilterFormatter = function(row, cell, value) {
      return {1: 'Male', 2: 'Female'}[value]
    };
    $scope.columns = [
      {field: 'name', name: gettextCatalog.getString('Customer'), ratio: '25%', formatter: customerFormatter, pdfFormatter: 'raw'},
      {field: 'id', name: gettextCatalog.getString('Customer ID'), ratio: '10%'},
      {field: 'customer_code', name: gettextCatalog.getString('Customer Code'), ratio: '10%'},
      {field: 'gender', name: gettextCatalog.getString('Gender'), ratio: '5%', formatter: genderFilterFormatter},
      {field: 'phone', name: gettextCatalog.getString('Phone'), ratio: '10%'},
      {field: 'date_of_birth', name: gettextCatalog.getString('Birthday (MM-DD)'), ratio: '10%'},
      {field: 'membership_level_title', name: gettextCatalog.getString('Membership Level'), ratio: '10%'},
      {field: 'address', name: gettextCatalog.getString('Address'), ratio: '20%'},
    ];
    $scope.actions = [
      ['View', function(item) {
        return $state.go('app.dashboard.customers.view', { store_id: store_id, customer_id: item.id });
      }],
      ['Delete', function(item) {
        if(!confirm('Do you really want to delete this item?')) return false;
        $scope.loadingGrid = true;
        CustomerFactory.deleteCustomer(item.id)
          .success(function(data) {
            console.log(data);
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function(err) {
            console.error(err);
            $scope.loadingGrid = false;
            messageFactory.add(err.message, 'error');

          });
      },
        function() {
          return DashboardFactory.getCurrentStore().associate_type === 'MANAGER';
        }]

    ];

    $scope.importNewItem = function(){

    };

    // FILTERS
    var genderFilterFormatter = function(value, item) {
      if(value === 'M' || value === 'Male') return 1;
      if(value === 'F' || value === 'Female') return 2;
    };
    var genderFilterUnformatter = function(value) {
      if(value === '1') return 'M';
      if(value === '2') return 'F';
    };
    $scope.filterColumns = [
      {field: 'name', name: gettextCatalog.getString('Name'), defaultFilter: true, types: ['contain']},
      {field: 'email', name: gettextCatalog.getString('Email'), types: ['contain']},
      {field: 'gender', name: gettextCatalog.getString('Gender'), types: ['options'], options: { 'Male': '1', 'Female': '2'}},
      {field: 'phone', name: 'Phone', types: ['contain', 'equal']},
      {field: 'billing_address', name: gettextCatalog.getString('Address'), types: ['contain', 'equal']},
      {field: 'date_of_birth', name: gettextCatalog.getString('Date of Birth (MM-DD)'), types: ['between'], isDate: true},
      {field: 'created_at', name: gettextCatalog.getString('Date Created'), types: ['between'], isDate: true}
    ];

    // EXPORTER
    var genderExportFormatter = function(value) {
      if(value == 1) {
        return 'Male';
      } else if(value === 2) {
        return 'Female';
      }
    };
    $scope.exportColumns = [
      {field: 'name', name: gettextCatalog.getString('Name')},
      {field: 'email', name: gettextCatalog.getString('Email')},
      {field: 'gender', name: gettextCatalog.getString('Gender'), exportFormatter: genderExportFormatter},
      {field: 'phone', name: gettextCatalog.getString('Phone')},
      {field: 'billing_address', name: gettextCatalog.getString('Address')},
      {field: 'date_of_birth', name: gettextCatalog.getString('Date of Birth (MM-DD)')},
    ];

    // HACKS
    $scope.objectWrap = 'customer';
    $scope.uploadItemKey = 'customer';
    $scope.isShowingFilters = true;
  }
}

export class CustomerViewController {
  constructor(messageFactory, ngDialog, $filter, $rootScope, $scope, $state, $stateParams, CommonFactory, CustomerFactory, DashboardFactory, FormatterFactory) {
    'ngInject';

    var _customerCache = {};
    var _recentOrdersCache = [];
    var _purchasedItemsCache = [];
    var _storeCreditCache = [];
    var _loyaltyCache = [];
    var customerId = $stateParams.customer_id;

    $scope.editPermission = DashboardFactory.getCurrentEditPermission('customer');

    $scope.section = 'overview';
    $scope.newCustomer = false;
    var itemFormatter = function(value, item) {
      var imgHTML = '<img class="_size-60" src="' + item.image_url + '">';
      var nameHTML = '<span>' + item.name + '</span>';
      return '<div class="_compile">' + imgHTML + nameHTML + '</div>';
    };
    var dollarFormatter = function(value) {
      return $filter('myCurrency')(value);
    };

    var percentageFormatter = function(value, item) {
      if(value) {
        return value >= 0 ? (Number(value) * 100).toFixed(2) + '%' : 'Loss';
      } else {
        return '';
      }
    };
    var dateFormatter = function(value, item) {
      return FormatterFactory.dateFormatter(0, 0, value) ;
    };

    $scope.birthdayOptions = {
      dateFormat: 'mm-dd',
      changeMonth: true,
      changeYear: true,
      changeDate: true,
      yearRange: '2008:2016',
      beforeShow: function(input,inst){

        setTimeout(function(){$(inst.dpDiv).find('.ui-datepicker-year').val('2012');$(inst.dpDiv).find('.ui-datepicker-year').selectmenu("refresh");},1000);
        //setTimeout(function(){$(inst.dpDiv).addClass('hideYear');},0);

      }
    };

    var recentOrderFormatter = function(value, item)  {
      return '<a href="' + $stateParams.store_id + '/invoices/'+ item.number+'">' + item.number + '</a>';
    };
    //
    $scope.editRecentOrderColumns = [
      {field: 'number', name: 'Order Number', ratio: '25%', formatter: recentOrderFormatter, bindHtml: true},
      {field: 'created_at', name: 'Created At', ratio: '20%', formatter: dateFormatter},
      {field: 'qty', name: 'QTY', ratio: '10%'},
      {field: 'price', name: 'Price', ratio: '10%', formatter: dollarFormatter},
      {field: 'cost', name: 'Cost', ratio: '10%', formatter: dollarFormatter},
      {field: 'profit', name: 'Profit', ratio: '10%', formatter: dollarFormatter},
      {field: 'margin', name: 'Margin', ratio: '15%', formatter: percentageFormatter},
    ];
    //


    $scope.editPurchasedItemColumns = [
      {field: null, name: 'Item', ratio: '50%', formatter: itemFormatter, bindHtml: true},
      {field: 'created_at', name: 'Created At', ratio: '20%', formatter: dateFormatter},
      {field: 'qty', name: 'QTY', ratio: '10%'},
      {field: 'cost', name: 'Cost', ratio: '10%', formatter: dollarFormatter},
      {field: 'price', name: 'Price', ratio: '10%', formatter: dollarFormatter},
    ];
    //
    $scope.editStoreCreditColumns = [
      {field: 'created_at', name: 'Date', ratio: '20%', formatter: dateFormatter},
      {field: 'order_number', name: 'Order Number', ratio: '20%'},
      {field: 'type', name: 'Type', ratio: '20%'},
      {field: 'note', name: 'Note', ratio: '30%'},
      {field: 'amount', name: 'Amount', ratio: '10%', formatter: dollarFormatter},
    ];
    $scope.editLoyaltyColumns = [
      {field: 'created_at', name: 'Date', ratio: '20%', formatter: dateFormatter},
      {field: 'order_number', name: 'Order Number', ratio: '20%'},
      {field: 'order_total', name: 'Total', ratio: '20%', formatter: dollarFormatter},
      {field: 'note', name: 'Note', ratio: '30%'},
      {field: 'earn_stamp', name: 'Change in Points', ratio: '10%'},
    ];


    $scope.enableEditMode = function() {
      $scope.editMode = true;
      angular.copy($scope.customer, _customerCache);
      angular.copy($scope.recentOrders, _recentOrdersCache);
      angular.copy($scope.purchasedItems, _purchasedItemsCache);
      angular.copy($scope.storeCredit, _storeCreditCache);
      angular.copy($scope.loyalty, _loyaltyCache);
    };

    $scope.adjustLoyalty = function() {
      ngDialog.open({
        template: 'app/modules/customers/adjustLoyalty.html',
        className: 'ngdialog-theme-default'
      })
        .closePromise.then(function (response) {
        if(!response.value || !response.value.amount) {
          return
        }
        CustomerFactory
          .adjustLoyalty(customerId, response.value)
          .success(function(data) {
            $state.reload()
          })
          .error(function(res) {
            messageFactory.add(res.message)
          });

      });
    };

    $scope.adjustCredit = function() {
      ngDialog.open({
        template: 'app/modules/customers/adjustCredit.html',
        className: 'ngdialog-theme-default'
      })
        .closePromise.then(function (response) {
        if(!response.value || !response.value.amount) {
          return
        }
        CustomerFactory
          .adjustCredit(customerId, response.value)
          .success(function(data) {
            $state.reload()
          })
          .error(function(res) {
            messageFactory.add(res.message)
          });

      });
    };

    $scope.bottomActions = [
      ['Cancel', function() {
        if(confirm('Discard all changes?')) {
          $scope.customer = angular.copy(_customerCache, $scope.customer);
          $scope.recentOrders = angular.copy(_recentOrdersCache, $scope.recentOrders);
          $scope.purchasedItems = angular.copy(_purchasedItemsCache, $scope.purchasedItems);
          $scope.storeCredit = angular.copy(_storeCreditCache, $scope.storeCredit);
          $scope.loyalty = angular.copy(_loyaltyCache, $scope.loyalty);
          $scope.editMode = false;
        }
      }, false],
      ['Save', function() {
        if ( $scope.customer.gender === '' ){
          $scope.customer.gender = null;
        }
        if ( $scope.customer.discount_id !== null && $scope.customer.discount_id !== '' ){
          $scope.customer.discount_name = $scope.discountMap[$scope.customer.discount_id].name;
        }
        CustomerFactory.updateCustomer($stateParams.customer_id, $scope.customer, $scope.oldCustomer)
          .success(function(data) {
            $state.go('app.dashboard.customers.index', { store_id: DashboardFactory.getStoreId() });
          })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });
      }, true],
    ];

    // load customer
    CustomerFactory.getCustomer(customerId)
      .success(function(data) {
        $scope.customer = data.customer;
        if(!$scope.customer.gender) $scope.customer.gender = '';
        $scope.oldCustomer = _.clone($scope.customer);
      })
      .error(function(err) {
        console.error(err);
      });


    CustomerFactory.getMembershipLevels()
      .success(function(data) {
        $scope.membership_levels = data.membership_levels;

      })
      .error(function(err) {
        console.error(err);
      });

    CustomerFactory.getRecentOrders(customerId)
      .success(function(data) {
        $scope.recentOrders = _.map(data, function(item, i) {
          return _.extend(item, { id: i });
        });
      })
      .error(function(err) {
        console.error(err);
      });
    CustomerFactory.getPurchasedItems(customerId)
      .success(function(data) {
        // $scope.purchasedItems = _.map(data, function(item, i) {
        //   return _.extend(item, { id: i });
        // });
        $scope.purchasedItems = data;
      })
      .error(function(err) {
        console.error(err);
      });
    CustomerFactory.getLoyaltyStampHistory(customerId)
      .success(function(data) {
        $scope.loyalty = data;
      })
      .error(function(err) {
        console.error(err);
      });
    CustomerFactory.getStoreCreditHistory(customerId)
      .success(function(data) {
        $scope.storeCredit = _.map(data, function(item, i) {
          return _.extend(item, { id: i });
        });
      })
      .error(function(err) {
        console.error(err);
      });

    CustomerFactory.getDiscount()
      .success(function(data) {
        $scope.discountMap = {};
        $scope.discounts = _.map(data, function(item, i) {
          $scope.discountMap[item.discount.id] = item.discount;
          return item.discount;
        });
      })
      .error(function(err) {
        console.error(err);
      });

    $scope.setPhoto = function(file) {
      $scope.customer.avatar = file;
    };

  }
}

export class CustomerNewController {
  constructor($rootScope, $scope, $state, $stateParams, CustomerFactory, DashboardFactory) {
    'ngInject';

    $scope.section = 'overview';
    $scope.editMode = true;
    $scope.newCustomer = true;
    $scope.customer = {};
    $scope.birthdayOptions = {
      dateFormat: 'mm-dd',
      changeMonth: true,
      changeYear: false,
      changeDate: true,
      yearRange: '1900:-0'
    };
    $scope.bottomActions = [
      ['Cancel', function() {
        $state.go('app.dashboard.customers.index', { store_id: DashboardFactory.getStoreId() });
      }, false],
      ['Save', function() {
        if ( $scope.customer.gender === '' ){
          $scope.customer.gender = null;
        }
        CustomerFactory.createCustomer($scope.customer)
          .success(function(data) {
            $state.go('app.dashboard.customers.index', { store_id: DashboardFactory.getStoreId() });
          })
          .error(function(err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });
      }, true],
    ];

    CustomerFactory.getMembershipLevels()
      .success(function(data) {
        $scope.membership_levels = data.membership_levels;

      })
      .error(function(err) {
        console.error(err);
      });


    $scope.setPhoto = function(file) {
      $scope.customer.avatar = file;
    };
  }
}

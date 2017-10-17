export class PurchaseOrdersController {
  constructor($scope, $rootScope, $state, $stateParams, DashboardFactory, FormatterFactory, PurchaseOrderFactory, gettextCatalog, PurchaseOrderFormatter) {
    'ngInject';

    $scope.title = 'Purchase Order';
    // ROUTE
    var store_id = DashboardFactory.getStoreId();

    $scope.route = $rootScope.gateway + '/v2/purchase_orders?store_ids=' + $stateParams.store_id;

    // GRID
    var numberFormatter = function (row, column, value, columnDef, dataContext) {
      return '<a href="' + dataContext.store_id + '/purchase-orders/' + dataContext.id + '">' + value + '</a>';
    };

    var supplierFormatter = function (row, column, value, columnDef, dataContext) {
      return '<a href="' + store_id + '/suppliers/' + dataContext.supplier_id + '">' + value + '</a>';
    };
    var statusFn = function (value) {
      if (value === 'pending') {
        value = 'created';
      }
      if (value === 'pending') {
        value = 'created';
      }
      var text = value.replace('_', ' ');
      return text;
    };

    var statusFormatter = function (row, column, value, columnDef, dataContext) {
      var text = statusFn(value);
      return '<span class="_capitalize"><i class="status-icon ' + value + '"></i>' + text + '</span>';
    };
    var currencyFormatter = function (row, column, value, columnDef, dataContext) {

      if (value !== null) {
        return value.currency_to;
      } else {
        return DashboardFactory.getCurrentStore().currency;
      }
    };
    var statusFormatterLite = function (row, column, value, columnDef, dataContext) {
      return statusFn(value);
    };

    var storeNameFormatter = function (row, column, value, columnDef, dataContext) {
      var store = DashboardFactory.findById(value);
      if (store) {
        return store.title;
      }
      return '';
    };
    //findById
    $scope.columns = [
      { field: 'store_id', name: gettextCatalog.getString('Store'), ratio: '12%', formatter: storeNameFormatter },
      { field: 'number', name: gettextCatalog.getString('Order Number'), ratio: '13%', formatter: numberFormatter, pdfFormatter: 'raw' },
      { field: 'supplier_name', name: gettextCatalog.getString('Supplier'), ratio: '25%', formatter: supplierFormatter, pdfFormatter: 'raw' },
      { field: 'created_at', name: gettextCatalog.getString('Date'), ratio: '20%', formatter: FormatterFactory.dateFormatter },

      { field: 'total_amount', name: gettextCatalog.getString('Total'), ratio: '10%', formatter: PurchaseOrderFormatter.dollarTotalFormatter },
      { field: 'exchange_rate', name: gettextCatalog.getString('Currency'), ratio: '10%', formatter: currencyFormatter },
      { field: 'state', name: gettextCatalog.getString('Status'), ratio: '10%', formatter: statusFormatter, pdfFormatter: statusFormatterLite }

    ];
    $scope.actions = [
      ['View', function (item) {
        //because we use multi store_id to determin which multiple store is, which is on the web address,
        //so we use change position to determin which is the current store XD
        //ex: http://localhost:8001/4750,382/purchase-orders/14214  "4750" is current store
        var store_ids = $stateParams.store_id.split(',');
        var params;
        if (store_ids.length > 1) {
          var index = store_ids.indexOf(String(item.store_id));
          store_ids.unshift(store_ids.splice(index, 1)[0]);
          params = { id: item.id, store_id: store_ids };
        } else {
          params = { id: item.id };
        }
        $state.go('app.dashboard.purchase-orders.view', params);

      }],
      ['Mark as Submitted', function (item) {
        PurchaseOrderFactory.submitPurchaseOrderWithoutNotification(item.id)
          .success(function (data) {
            alert('Successfully Marked.');
            $state.go($state.current.name, $stateParams, { reload: true });
          });
      }, function (item) {
        return item.state === 'pending';
      }],
      ['Fulfill', function (item) {
        if (!confirm('Are you sure you want to fulfill this order?')) return;
        PurchaseOrderFactory.fulfillPurchaseOrder(item.id)
          .success(function (data) {
            alert('Successfully Fulfilled!');
            $state.go($state.current.name, $stateParams, { reload: true });
          });

      }, function (item) {
        return item.state === 'submitted';
      }],
      ['Void', function (item) {
        if (!confirm('Are you sure you want to void this order?')) return;
        PurchaseOrderFactory.voidPurchaseOrder(item.id)
          .success(function (data) {
            alert('Successfully Voided!');
            $state.go($state.current.name, $stateParams, { reload: true });
          });

      }, function (item) {
        return (item.state !== 'canceled' && item.state !== 'voided');
      }],
      ['Cancel', function (item) {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        PurchaseOrderFactory.cancelPurchaseOrder(item.id)
          .success(function (data) {
            alert('Successfully Canceled!');
            $state.go($state.current.name, $stateParams, { reload: true });
          });


      }, function (item) {
        return (item.state !== 'canceled' && item.state !== 'voided');
      }]


      // ['Export(.csv)', function(item) {
      //   apiService.get_purchase_order($rootScope.current_store.id, item.id)
      //     .then(function(data) {
      //       if(data.data.purchase_order) {
      //         commonService
      //           .flush_csv_file(commonService.po_to_csv(data.data.purchase_order, $rootScope.current_store),
      //           'Purchase_order-' + data.data.purchase_order.number + '.csv');
      //       }
      //     },
      //     function(fail) {
      //     });
      // }],
    ];

    // FILTERS
    $scope.filterColumns = [
      { field: 'number', name: 'Order Number', types: ['contain', 'equal'] },
      { field: 'supplier_name', name: 'Supplier Name', types: ['contain'] },
      { field: 'created_at', name: 'Date Created', types: ['between'], isDate: true },
      { field: 'state', name: 'Status', types: ['options'], options: { 'Created': 'pending', 'Submitted': 'submitted', 'Fulfilled': 'fulfilled', 'Cancelled': 'canceled' } }
    ];

    // HACKS
    $scope.objectWrap = 'purchase_order';


    $scope.bottomActions = [
      ['Import Order', function () {
        $state.go('app.dashboard.purchase-orders.import');
      }, false],

    ];

  }
}

export class PurchaseOrderBaseController {
  constructor($scope, $rootScope, $http, $compile, $state, $stateParams, DashboardFactory, PurchaseOrderFactory, PurchaseOrderFormatter) {
    'ngInject';

    $scope.editPermission = DashboardFactory.getCurrentEditPermission('purchase_order');

    $scope.getCurrency = function () {
      var defaultCurrency = DashboardFactory.getCurrentStore().currency;

      return PurchaseOrderFormatter.getCurrency() ? PurchaseOrderFormatter.getCurrency().currency_to : defaultCurrency;
    };

    $scope.calItemTotalQuantity = function (items) {
      if (!items) {
        return 0;
      }

      return _.reduce(items, function (total, item) {
        var quantity = item.quantity || 0;
        return total + quantity;
      }, 0);
    };

    // new: check if is user to cal new P.O
    $scope.calItemTotal = function (items, type) {
      var filteredItems;
      if (!items) {
        return 0;
      }

      if (type === 'all') {
        filteredItems = items;

      } else if (type === 'other') {
        filteredItems = _.filter(items, function (item) {
          return item.source_type === 'Other';
        });

      } else { // mostly type === 'listing'
        filteredItems = _.filter(items, function (item) {
          return item.source_type !== 'Other';
        });
      }

      var total = _.reduce(filteredItems, function (total, item) {
        return total + item.price * item.quantity;
      }, 0);

      return parseFloat(total.toPrecision(12));
    };


  }
}

export class PurchaseOrderNewController {
  constructor(suppliers, $scope, $rootScope, $http, $state, $stateParams, FormatterFactory, DashboardFactory, PurchaseOrderFactory, PurchaseOrderFormatter, ngDialog) {
    'ngInject';

    $scope.suppliers = suppliers;

    $scope.editMode = true;

    $scope.order = { state: 'pending' };
    $scope.orderImages = [];


    $scope.stores = DashboardFactory.getCurrentStores();
    $scope.current_store_id = $scope.stores[0].id;
    $scope.isEditStore = $stateParams.store_id.split(',').length > 1;

    $scope.now_currency = null;
    PurchaseOrderFormatter.setCurrency(null);

    // i buy from suppliers at $7.0, it means my product's cost is $7.0
    // request price = final listing "cost"
    // request retail_price = final listing "price"

    $scope.editColumns = [
      { field: 'name', name: 'Name', ratio: '25%', formatter: FormatterFactory.listingInfoFormatter, bindHtml: true },
      { field: 'inventory_quantity', name: 'Current QTY', ratio: '15%', type: 'number' },
      // ordered quantity
      { field: 'quantity', name: 'QTY To Order', ratio: '15%', editable: true, type: 'number', pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },
      { field: null, name: 'QTY After Order', ratio: '15%', formatter: PurchaseOrderFormatter.afterFormatter, pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },
      { field: 'retail_price', name: 'Price', ratio: '10%', editable: true, type: 'text', formatter: PurchaseOrderFormatter.dollarFormatter, pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },

      { field: 'supplier_price', name: 'Unit Cost', ratio: '10%', editable: true, type: 'number', formatter: PurchaseOrderFormatter.dollarFormatter, pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },
      { field: null, name: 'Total Cost', ratio: '8%', formatter: PurchaseOrderFormatter.computedTotalCostFormatter, bindHtml: true },
      // {field: null, name: 'Margin', ratio: '10%', formatter: PurchaseOrderFormatter.marginFormatter}
    ];
    $scope.editRowHeight = 80;

    $scope.addImage = function (file, allFiles) {
      $scope.orderImages = allFiles;
    };


    $scope.bottomActions = [
      ['Cancel', function () {
        $state.go('app.dashboard.purchase-orders.index', { store_id: $stateParams.store_id });
      }, false],
      ['Save', function () {
        if (!$scope.order.supplier_id) {
          alert('Please select a supplier.');
          return;
        }

        var items = _.map($scope.order.purchase_items, function (item) {
          delete item.inventory_quantity;
          delete item.purchase_order_id;
          delete item.upc;
          delete item.gtid;
          delete item.product_id;
          return item;
        });

        delete $scope.order.purchase_items;

        PurchaseOrderFactory.createPurchaseOrder($scope.order, items, $scope.current_store_id)
          .success(function (data) {
            if ($scope.orderImages.length) {
              _.each($scope.orderImages, function (file, i) {
                PurchaseOrderFactory.uploadPurchaseOrderImage(data.purchase_order.id, file)
                  .success(function (data) {
                    if (i === $scope.orderImages.length - 1) {
                      $state.go('app.dashboard.purchase-orders.index', { store_id: DashboardFactory.getStoreId() });
                    }
                  })
                  .error(function (err) {
                    alert('Image uploading failed.');
                    $state.go('app.dashboard.purchase-orders.index', { store_id: $stateParams.store_id });
                  });
              });
            } else {
              $state.go('app.dashboard.purchase-orders.index', { store_id: $stateParams.store_id });
            }
          });

      }, true],
    ];

  }
}

export class PurchaseOrderViewController {
  constructor(suppliers, $scope, $rootScope, $http, $compile, $timeout, $state, $stateParams, FormatterFactory, DashboardFactory, PurchaseOrderFactory, PurchaseOrderFormatter, ngDialog, purchase_order, PdfInvoiceFactory, currencymap) {
    'ngInject';

    $scope.suppliers = suppliers;
    var _orderCache = {};
    $scope.order = {};
    $scope.orderImages = [];


    $scope.order.exchange_rate_id = "";

    $scope.section = 'overview';

    _.each(purchase_order.purchase_items, function (item, i) {
      item.cost = Number(item.cost) ? Number(item.cost) : 0;
      item.price = Number(item.price);
      item.supplier_price = item.supplier_price !== null && item.supplier_price !== '' ? Number(item.supplier_price) : item.cost;
      item.quantity = Number(item.quantity);
    });

    $scope.order = purchase_order;
    // hack to cope with inconsistent response data formats
    // fulfill button need this to work
    $timeout(function () {
      $('._compile').not('.ng-scope').each(function (i, el) {
        $compile(el)($scope);
      });
    }, 500);

    $scope.current_store_id = $stateParams.store_id.split(',')[0];

    $scope.store_name = $scope.storeName = DashboardFactory.findById(parseInt($scope.current_store_id)).title;

    $scope.isEditStore = false;
    var stores = DashboardFactory.getCurrentStores();

    // var defaultCurrency = DashboardFactory.getCurrentStore().currency;
    var now_currency = purchase_order.exchange_rate;
    if (now_currency){
      now_currency.name = currencymap[now_currency.currency_to].name;
      $scope.now_currency = now_currency;
    }
    PurchaseOrderFormatter.setCurrency(now_currency);

    // i buy from suppliers at $7.0, it means my product's cost is $7.0
    // request price = final listing "cost"
    // request retail_price = final listing "price"

    $scope.editColumns = [
      { field: 'name', name: 'Name', ratio: '60%', formatter: FormatterFactory.listingInfoFormatter, bindHtml: true },
      // {field: 'inventory_quantity', name: 'Current QTY', ratio: '10%', type: 'number'},
      // ordered quantity
      { field: 'quantity', name: 'Ordered', ratio: '11%', editable: true, type: 'number', pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },
      { field: 'qty_received', name: 'Received', ratio: '8%', type: 'number', pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },
      { field: null, name: 'In Transit', ratio: '11%', type: 'number', formatter: PurchaseOrderFormatter.qtyInTransitFormatter, pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },
      { field: 'retail_price', name: 'Price', ratio: '10%', editable: true, type: 'text', formatter: PurchaseOrderFormatter.defaultCurrencyFormatter, pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },

      { field: 'supplier_price', name: 'Unit Cost', ratio: '10%', editable: true, type: 'number', formatter: PurchaseOrderFormatter.currencyFormatter, pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },
      { field: null, name: 'Total Cost', ratio: '8%', formatter: PurchaseOrderFormatter.computedTotalCostFormatter, bindHtml: true },
      { field: 'state', name: 'State', ratio: '12%', formatter: PurchaseOrderFormatter.stateFormatter, bindHtml: true, cssClass: '_nowrap' },
      // {field: null, name: 'Action', ratio: '19%', formatter: PurchaseOrderFormatter.actionFormatter, bindHtml: true, cssClass: '_nowrap'},
      // {field: null, name: 'Margin', ratio: '10%', formatter: marginFormatter}
    ];


    $scope.enableEditMode = function () {
      $scope.editMode = true;
      angular.copy($scope.order, _orderCache);
    };

    $scope.addImage = function (file, allFiles) {
      $scope.orderImages = allFiles;
    };

    $scope.exportPDF = function () {
      var format = 'a4';

      var otherInfo = {};


      otherInfo.supplier = $scope.cookSupplier($scope.order.supplier_id);
      otherInfo.totalQuantity = $scope.calItemTotalQuantity($scope.order.purchase_items);
      otherInfo.subtotal = $scope.calItemTotal($scope.order.purchase_items, "listing");
      otherInfo.others = $scope.calItemTotal($scope.order.purchase_items, "other");
      otherInfo.total = $scope.calItemTotal($scope.order.purchase_items, "all");


      PdfInvoiceFactory.exportPo(format, DashboardFactory.getCurrentStore(), $scope.order, otherInfo);


      //PurchaseOrderFactory.exportPurchaseOrderPDF($scope.order)
    };


    $scope.submitViaEmail = function () {
      if (!confirm('Are you sure you want to submit this order?')) {
        return;
      }
      PurchaseOrderFactory.submitPurchaseOrder($stateParams.id)
        .success(function () {
          alert('Successfully submitted!');
          $state.go($state.current.name, $stateParams, { reload: true });
        });
    };

    $scope.markAsSubmitted = function () {
      PurchaseOrderFactory.submitPurchaseOrderWithoutNotification($stateParams.id)
        .success(function () {
          $state.go($state.current.name, $stateParams, { reload: true });
        });
    };
    $scope.fulfill = function () {
      ngDialog.open({
        template: 'app/modules/purchase_orders/fulfill.html',
        controller: 'PurchaseOrderFulfillController',
        scope: $scope,
        className: 'ngdialog-theme-default fulfill-modal'
      })
        .closePromise.then(function (response) {
        var purchase_items = response.value;
        if (!purchase_items ||
          purchase_items == "$closeButton" ||
          purchase_items == "$document") {
          return;
        }

        PurchaseOrderFactory
          .fulfillPurchaseOrder($stateParams.id, response.value)
          .success(function (res) {
            // TODO: replace with response
            $state.reload();
          });
      });
    };

    $scope.canFulfill = function (item) {
      return item.state === 'submitted' || item.state === 'partially_fulfilled';
    };

    $scope.bottomActions = [
      ['Cancel', function () {
        if (confirm('Discard all changes?')) {
          $scope.order = angular.copy(_orderCache, $scope.order);
          $scope.editMode = false;
        }
      }, null, false],

      ['Save', function () {
        var items = _.map($scope.order.purchase_items, function (item) {
          delete item.inventory_quantity;
          delete item.purchase_order_id;
          delete item.upc;
          delete item.gtid;
          delete item.product_id;
          return item;
        });


        PurchaseOrderFactory.updatePurchaseOrder($stateParams.id, $scope.order, items)
          .success(function (data) {
            $state.go('app.dashboard.purchase-orders.index', { store_id: $stateParams.store_id });

            if ($scope.orderImages.length) {
              _.each($scope.orderImages, function (file, i) {
                PurchaseOrderFactory.uploadPurchaseOrderImage(data.purchase_order.id, file)
                  .success(function (data) {
                    if (i === $scope.orderImages.length - 1) {
                      $state.go('app.dashboard.purchase-orders.index', { store_id: $stateParams.store_id });
                    }
                  })
                  .error(function (err) {
                    alert('Image uploading failed.');
                    $state.go('app.dashboard.purchase-orders.index', { store_id: $stateParams.store_id });
                  });
              });
            } else {
              $state.go('app.dashboard.purchase-orders.index', { store_id: $stateParams.store_id });
            }
          });

      }, null, true],
    ];


    // FULFILLING ITEMS
    $scope.startFulfillingPurchaseItem = function (id) {
      for (var i = 0; i < $scope.order.purchase_items.length; i++) {
        if ($scope.order.purchase_items[i].id === id) {
          $scope.fulfilledItem = $scope.order.purchase_items[i];
          break;
        }
      }
      if ($scope.fulfilledItem) $scope.isFulfillingItem = true;
    };
    $scope.cancelFulfillingPurchasingItem = function () {
      $scope.isFulfillingItem = false;
      $scope.fulfilledItem = null;
    };
    $scope.fulfillAllPurchaseItem = function () {
      PurchaseOrderFactory.fulfillPurchaseItem($stateParams.id, $scope.fulfilledItem.id)
        .success(function (data) {
          $state.go($state.current.name, $stateParams, { reload: true });
        })
        .error(function (err) {
          $scope.errorMessage = err.message || 'Error when saving';
        });
    };
    $scope.fulfillSpecifiedPurchaseItem = function (qty) {
      if (!qty) {
        $scope.fulfillItemMessage = 'Please enter the quantity to be fulfilled.';
        return;
      }
      PurchaseOrderFactory.fulfillPurchaseItem($stateParams.id, $scope.fulfilledItem.id, qty)
        .success(function (data) {
          $state.go($state.current.name, $stateParams, { reload: true });
        })
        .error(function (err) {
          $scope.errorMessage = err.message || 'Error when saving';
        });
    };

    $scope.returnPurchaseItem = function (itemId) {
      PurchaseOrderFactory.returnPurchaseItem($stateParams.id, itemId)
        .success(function (data) {
          $state.go($state.current.name, $stateParams, { reload: true });
        });

    };
    $scope.cancelPurchaseItem = function (itemId) {
      PurchaseOrderFactory.cancelPurchaseItem($stateParams.id, itemId)
        .success(function (data) {
          $state.go($state.current.name, $stateParams, { reload: true });
        });

    };


    $scope.receive_order_visible = false;
    DashboardFactory.getStoreSetting($scope.current_store_id).success(function (res) {
      $scope.module = res.module;
      $scope.receive_order_visible = $scope.module.warehouse_management_enabled;
    });


    $scope.createReceiveOrder = function () {
      var order = {};
      order.number = '';
      order.expected_ship_date = $scope.order.number;
      order.receive_date = '';
      order.purchase_order_id = $scope.order.id;
      PurchaseOrderFactory.createReceiveOrder(order).then(refreshReceiveOrders);
    };


    var refreshReceiveOrders = function () {
      PurchaseOrderFactory.getReceiveOrdersByPO($stateParams.id)
        .success(function (data) {

          $scope.receive_orders = data.receive_orders;
          _.each($scope.receive_orders, function (order) {
            order._show = false;
            $scope.checkFulfillAmount(order);
            _.each(order.receive_order_items, function (num) {
              num.receive_order_item.fulfilling = 0;
            });
            order.state = order.state ? order.state : 'created';
          });
        });
    };
    refreshReceiveOrders();
    $scope.checkFulfillAmount = function (receive_order) {


      receive_order._fulfill_sum = _.reduce(receive_order.receive_order_items, function (memo, num) {
        if (num.receive_order_item.fulfilling) {
          return new BigNumber(memo).plus(new BigNumber(num.receive_order_item.fulfilling));
        }
        return new BigNumber(memo);
      }, 0).toNumber();


      receive_order._received_sum = _.reduce(receive_order.receive_order_items, function (memo, num) {
        if (num.receive_order_item.qty_received) {
          return new BigNumber(memo).plus(new BigNumber(num.receive_order_item.qty_received));
        }
        return new BigNumber(memo);
      }, 0).toNumber();
      receive_order._order_sum = _.reduce(receive_order.receive_order_items, function (memo, num) {
        if (num.receive_order_item.quantity) {
          return new BigNumber(memo).plus(new BigNumber(num.receive_order_item.quantity));
        }
        return new BigNumber(memo);
      }, 0).toNumber();

      receive_order._fulfilling = receive_order._fulfill_sum > 0;


      _.each(receive_order.receive_order_items, function (value) {
        if (value.receive_order_item.quantity !== '' && value.receive_order_item.qty_received !== '' && value.receive_order_item.fulfilling !== null)
          value.receive_order_item.inTransit = new BigNumber(value.receive_order_item.quantity).minus(new BigNumber(value.receive_order_item.qty_received)).minus(new BigNumber(value.receive_order_item.fulfilling)).toNumber();
      });


    };
    $scope.fulfillAll = function (receive_order) {
      _.each(receive_order.receive_order_items, function (num) {
        num.receive_order_item.fulfilling = num.receive_order_item.quantity - num.receive_order_item.qty_received;
      });
      $scope.checkFulfillAmount(receive_order);
    };


    $scope.saveReceiveOrder = function (receive_order, norefresh) {
      console.log('saveReceiveOrder');
      if (!receive_order.receive_date || receive_order.receive_date === '') {
        receive_order.receive_date = moment().format('YYYY-MM-DD');
      }

      var new_receive_order = {};
      new_receive_order.number = receive_order.number;
      new_receive_order.expected_receive_date = receive_order.expected_receive_date;
      new_receive_order.receive_date = receive_order.receive_date;
      new_receive_order.purchase_order_id = receive_order.purchase_order_id;
      var receive_order_items = _.map(receive_order.receive_order_items, function (item) {
        return item.receive_order_item;
      });


      PurchaseOrderFactory.updateReceiveOrder(receive_order.id, new_receive_order, receive_order_items)
        .success(function (data) {
          console.log(data);
          _.each(data.receive_order.receive_order_items, function (i, index) {
            var item = i.receive_order_item;
            receive_order.receive_order_items[index].receive_order_item.id = item.id;
          });

          var newItems = _.map(receive_order.receive_order_items, function (i) {
            var item = i.receive_order_item;
            item.quantity = item.fulfilling;
            item.qty_received = item.fulfilling;
            return item;
          });

          PurchaseOrderFactory.fulfillReceiveOrder(receive_order.id, newItems)
            .success(function (data) {
              console.log(data);
              refreshReceiveOrders();
            });


        });
    };
    $scope.cookSupplier = function (supplier_id) {
      return _.find($scope.suppliers, { id: parseInt(supplier_id) });
    };
    $scope.cancelReceiveOrder = function (receive_order) {
      PurchaseOrderFactory.cancelReceiveOrder(receive_order.id)
        .success(function (data) {
          console.log(data);
          refreshReceiveOrders();
        });
    };

  }
}

export class PurchaseOrderFormController {
  constructor($scope, DashboardFactory, ngDialog, $q, InventoryFactory, currencymap, PurchaseOrderFormatter, $stateParams, $state) {
    'ngInject';

    $scope.newListingsToAdd = {};
    $scope.suppliers = $scope.$parent.suppliers;

    $scope.$watch('order.supplier_id', _appendSupplierNote);

    $scope.cookSupplier = function (supplier_id) {
      return _.find($scope.suppliers, { id: parseInt(supplier_id) });
    };


    $scope.isEditStore = $scope.$parent.isEditStore;

    $scope.current_store_id = $scope.$parent.current_store_id;

    if ($scope.isEditStore) {
      DashboardFactory.getSuppliers($scope.current_store_id).then(function (suppliers) {
        $scope.suppliers = suppliers;
      });

      $scope.onSelectedStore = function (selectedItem) {
        $scope.$parent.current_store_id = selectedItem.id;
        $scope.current_store_id = selectedItem.id;
        DashboardFactory.getSuppliers(selectedItem.id).then(function (suppliers) {
          $scope.suppliers = suppliers;
        });
        if (confirm('Are you sure to switch store?\n All line items and data on this PO would be cleared.')) {
          var store_ids = $stateParams.store_id.split(',');
          var index = store_ids.indexOf(String(selectedItem.store_id));
          store_ids.unshift(store_ids.splice(index, 1)[0]);
          $state.go('app.dashboard.purchase-orders.new', { store_id: store_ids });
        }
      };
    }

    // When user select a supplier, append supplier's note to P.O's note
    $scope.$watch('order.supplier_id', _appendSupplierNote);

    $scope.currency = [];

    var defaultCurrency = DashboardFactory.getCurrentStore().currency;

    DashboardFactory.getExchangeRate().then(function (data) {
      $scope.currency = _.map(data.data.exchange_rates, function (item) {
        return {
          id: item.id,
          name: currencymap[item.currency_to].name,
          symbol: currencymap[item.currency_to].symbol_native,
          currency_to: item.currency_to,
          rate: parseFloat(item.rate)
        };
      });

      $scope.currency.unshift({
        name: currencymap[defaultCurrency].name,
        symbol: currencymap[defaultCurrency].symbol_native,
        currency_to: defaultCurrency,
        rate: 1.0,
        id: ""
      });

      // When user select a supplier, append supplier's note to P.O's note

    });

    $scope.onSelectCallback = function ($item) {
      var supplier = _.find($scope.suppliers, { id: parseInt($item.id) });
      var currency = _.find($scope.currency, { currency_to: supplier.currency });
      $scope.order.exchange_rate_id = currency.id;
      $scope.now_currency = supplier.currency;
    };

    $scope.onSelectCurrencyCallback = function ($item) {
      $scope.$parent.order.exchange_rate_id = $item.id;

      PurchaseOrderFormatter.setCurrency($item);

      _.each($scope.order.purchase_items, function (it) {
        if (defaultCurrency === $item.currency_to) {
          it.supplier_price = it.price;
        } else {
          it.supplier_price = $item.rate * it.price;
        }
      });

    };

    $scope.$watch('order.purchase_items', function (newValue, oldValue){
      _.forEach(newValue, function (v, i){
        var old = oldValue[i] || {};
        if (v.supplier_price != old.supplier_price) {
          var rate = !PurchaseOrderFormatter.getCurrency() || PurchaseOrderFormatter.getCurrency().rate || 1;
          v.price = v.cost = v.supplier_price / rate;
        }
      });
    }, true);

    var calculateCost = function (id) {

      var defer = $q.defer();
      InventoryFactory.getInventory(id, $scope.current_store_id).then(function (response) {
        var data = response.data;
        var cost = null;
        var result = {};
        if (!data || data.length === 0 || !data || !data.listing) {
          result.cost = cost;
          result.listing = null;
          defer.resolve(result);
          return;
        }
        var listing = data.listing;
        cost = Number(listing.price);


        // Cost of Supplier
        var supplier = _.find(listing.suppliers, function (supplier) {
          return $scope.order.supplier_id === supplier.supplier_id;
        });
        if (supplier) {
          cost = Number(supplier.cost);
        }
        else {
          supplier = _.find(listing.suppliers, function (supplier) {
            return supplier.default;
          });
          if (supplier) {
            cost = Number(supplier.cost);
          }
        }

        result.cost = cost;
        result.listing = listing;
        defer.resolve(result);

      });


      return defer.promise;


    };

    $scope.addItems = function (res) {

      if (res.value == "$closeButton" || res.value == "$document") {
        return;
      }

      var selectedLisings = res.value;

      if (!$scope.order) {
        $scope.order = {};
      }
      if (!$scope.order.purchase_items) {
        $scope.order.purchase_items = [];
      }


      var rate = !PurchaseOrderFormatter.getCurrency() || PurchaseOrderFormatter.getCurrency().rate;

      _.map(selectedLisings, function (listing) {
        calculateCost(listing.id).then(function (data) {
          listing.cost = data.cost;

          const newPoItem = {
            name: listing.name,
            upc: listing.upc,
            product_id: listing.product_id,
            cost: Number(listing.cost),
            supplier_price: rate === null ? Number(listing.cost) : rate * Number(listing.cost),
            // Price is cost for some reason
            price: Number(listing.cost),
            retail_price: Number(listing.price),
            inventory_quantity: Number(listing.quantity),
            quantity: Number(listing.qtyRequested),
            qty_received: 0,
            qty_requested: Number(listing.qtyRequested),
            source_id: listing.id,
            source_type: 'Listing',
            suppliers: data.listing.suppliers,
            supplier_id: data.listing.supplier_id
          };
          const target = _.find($scope.order.purchase_items, item =>
                                                              item.source_type === newPoItem.source_type &&
                                                              item.source_id === newPoItem.source_id);
          if (target){
            target.quantity += newPoItem.quantity;
          } else {
            $scope.order.purchase_items.push(newPoItem);
          }
        });
      });
    };

    $scope.isEnablingSaveButton = function () {
      return _.reduce($scope.newListingsToAdd, function (memo, value) {
        return value ? memo + 1 : memo;
      }, 0);
    };

    $scope.openMiscChargeDialog = function () {
      ngDialog.open({
        template: 'app/modules/purchase_orders/miscellaneous_charge.html',
        controller: 'MiscChargeController'
      })
        .closePromise.then(function (data) {
        var listing = data.value;
        var rate = !PurchaseOrderFormatter.getCurrency() || PurchaseOrderFormatter.getCurrency().rate;

        if (data.value && data.value.name) {
          var newMisc = {
            name: listing.name,
            price: Number(listing.price),
            inventory_quantity: 0,
            quantity: 1,
            source_id: null,
            source_type: 'Other',
            supplier_price: rate === null ? Number(listing.price) : rate * Number(listing.price)
          };
          try {
            $scope.order.purchase_items.push(newMisc);
          } catch (e) {
            $scope.order.purchase_items = [newMisc];
          }
        }
      });
    };


    var defaultCurrency = DashboardFactory.getCurrentStore().currency;

    function _appendSupplierNote(newValue, oldValue) {
      if (typeof newValue === 'undefined') return;

      // _appendSupplierNote is intend to work when change supplier
      // but supplier_id will change when initail load data
      // so have to exclude such senario
      var supplier = $scope.cookSupplier(newValue);

      //for the first time enter this view.
      if (typeof oldValue === 'undefined') {

        if ($scope.$parent.exchange_rate !== null && typeof $scope.$parent.exchange_rate !== "undefined") {
          $scope.now_currency = $scope.$parent.exchange_rate.currency_to;
          PurchaseOrderFormatter.setCurrency($scope.$parent.exchange_rate);
        } else {
          $scope.now_currency = defaultCurrency;
        }

        return;
      }


      if (!$scope.editMode) return;

      if (supplier && supplier.note) {
        $scope.order.remarks = $scope.order.remarks || '';  // deal with undefined
        $scope.order.remarks = $scope.order.remarks + supplier.note;
      }

      _.each($scope.order.purchase_items, function (item) {
        calculateCost(item.source_id).then(function (data) {


            if (item.retail_price === null) {
              item.retail_price = Number(item.price);
            }
            if (data.cost !== null) {
              item.price = Number(data.cost);
            }
          }
        );
      });


    }


  }
}

export class PurchaseOrderROController {
  constructor($scope, $state, $stateParams, DashboardFactory, PurchaseOrderFactory, messageFactory, InventoryFactory, CommonFactory) {


  }
}

export class PurchaseOrderImportController {
  constructor(suppliers, $scope, $state, $stateParams, DashboardFactory, PurchaseOrderFactory, messageFactory, InventoryFactory, CommonFactory, ExportFactory) {
    'ngInject';

    $scope.order = {};
    $scope.templateLink = PurchaseOrderFactory.purchase_order_template;
    $scope.suppliers = suppliers;

    $scope.back = function () {
      $state.go('app.dashboard.purchase-orders.index');
    };

    $scope.selectCSV = function (fileInput) {
      if (fileInput.length > 0) {
        $scope.order.spreadsheet = fileInput[0];
      }
    };

    $scope.exportInventoryCSV = function () {
      var columns = [
        { name: 'Product Name', field: 'name' },
        { name: 'UPC / EAN', field: 'upc' },
        { name: 'Supplier Product ID', field: '' },
        { name: 'Order Qty', field: '' },
        { name: 'Unit Cost', field: 'cost' },
      ];

      InventoryFactory.getInventorys().success(function (data) {
        var listings = _.map(data, function (d) {
          return d.listing;
        });
        ExportFactory.exportCsv(columns, listings, [], 'Inventories');

      });
    };

    $scope.import = function (order) {
      if (!order.supplier_id) {
        messageFactory.add('Please select supplier', 'error');
        return;
      }
      if (!order.spreadsheet) {
        messageFactory.add('Please select CSV file you want to import', 'error');
        return;
      }

      PurchaseOrderFactory.importPurchaseOrder(order).success(function (data) {
        messageFactory.add('Success created purchase order', 'success');
        $state.go('app.dashboard.purchase-orders.view', { id: data.purchase_order.id });
      }).error(function () {

      });
    };

  }
}

export class MiscChargeController {
  constructor($scope) {
    'ngInject';

    $scope.charge = {};
  }
}

const askEmailAndSend = (InvoiceFactory, orderNumber, defaultEmail, prevEmail) => {
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  let msg = prevEmail ? `"${prevEmail}" is not a valid email address.` : "";
  msg += '\nPlease enter customer\'s email';
  let email = window.prompt(msg, defaultEmail || '');
  // Press cancel
  if (email == null) {
    return;
  }
  if (emailPattern.test(email)) {
    InvoiceFactory.sendEmailTemplate(orderNumber, email)
      .success(function () {
        alert('email reciept sent');

      })
      .error(function () {
        alert('email reciept failed');

      });
  } else {
    askEmailAndSend(InvoiceFactory, orderNumber, defaultEmail, email);
  }
};

export class InvoicesQuotesController {
  constructor($scope, $rootScope, $state, $stateParams, DashboardFactory, FormatterFactory, InvoiceFactory, gettextCatalog) {
    'ngInject';

    $scope.title = 'Invoice';
    $scope.editPermission = DashboardFactory.getCurrentEditPermission('invoice');
    $scope.createNewInvoice = function () {
      $state.go('app.dashboard.invoices.new');
    };

    $scope.createNewQuote = function () {
      $state.go('app.dashboard.quotes.new');
    };

    // ROUTE
    var store_id = DashboardFactory.getStoreId();


    //$scope.route = $rootScope.gateway + '/v2/purchase_orders?store_ids=' + $stateParams.store_id;
    $scope.route = $rootScope.gateway + '/v2/order_correspondences?store_ids=' + $stateParams.store_id;
    //$scope.route = $rootScope.gateway + '/v1/stores/' + store_id + '/quotes_and_invoices';

    // GRID
    var customerFormatter = function (row, column, value, columnDef, dataContext) {
      var name = value || 'Customer';

      try {
        return '<a href="' + store_id + '/customers/' + dataContext.billing_address_info.id + '">' + name + '</a>';
      } catch (e) {
        // anonymous customer
        return 'Customer';
      }
    };

    var customerFormatterLite = function (row, column, value, columnDef, dataContext) {
      return value || 'Customer';
    };

    var orderNumberFormatter = function (row, column, value, columnDef, dataContext) {
      var path = (dataContext.type === 'Quote') ? 'quotes' : 'invoices';
      var orderNumber = dataContext.number;
      return '<a href="' + dataContext.store_id + '/' + path + '/' + orderNumber + '">' + value + '</a>';
    };

    var statusFn = function (value) {
      if (!value) return '';
      if (value === 'pending') {
        value = 'created';
      }
      else if (value === "canceled") {
        value = 'cancelled';
      }
      else if (value === "invoiced") {
        value = 'unpaid';
      }
      else if (value === "in_transit") {
        value = 'partially_fulfilled';
      }

      var text = value.replace('_', ' ');

      return text;
    };

    var statusFormatter = function (row, column, value, columnDef, dataContext) {
      var text = statusFn(value);
      return '<span class="_capitalize"><i class="status-icon ' + value + '"></i>' + text + '</span>';
    };

    var statusFormatterLite = function (row, column, value, columnDef, dataContext) {
      return statusFn(value);
    };

    var storeNameFormatter = function (row, column, value, columnDef, dataContext) {
      return typeof DashboardFactory.findById(value) === "undefined" ? "" : DashboardFactory.findById(value).title;
    };

    let columns = [];
    columns = columns.concat([
      { field: 'store_id', name: gettextCatalog.getString('Store'), ratio: '12%', formatter: storeNameFormatter },
      { field: 'number', name: gettextCatalog.getString('Number'), ratio: '15%', formatter: orderNumberFormatter, pdfFormatter: 'raw' },
      { field: 'reference_number', name: gettextCatalog.getString('Reference Number'), ratio: '10%', formatter: orderNumberFormatter, pdfFormatter: 'raw' },
      { field: 'bill_to', name: gettextCatalog.getString('Bill to'), ratio: '10%', formatter: customerFormatter, pdfFormatter: customerFormatterLite },
      { field: 'customer_name', name: gettextCatalog.getString('Customer Name'), ratio: '12%' },
    ]);
    const storeModule = DashboardFactory.getStoreModules() || {};
    const isRestaurant = storeModule['restaurant_features_enabled'];
    if (isRestaurant){
      columns.push({ field: 'delivery_date', name: gettextCatalog.getString('Delivery Date'), ratio: '10%', formatter: FormatterFactory.dateFormatter });
    }
    columns = columns.concat([
      { field: 'created_at', name: gettextCatalog.getString('Date'), ratio: '10%', formatter: FormatterFactory.dateFormatter },
      { field: 'type', name: 'Type', ratio: '6%' },
      { field: 'initial_total', name: gettextCatalog.getString('Total'), ratio: '6%', formatter: FormatterFactory.dollarFormatter },
      { field: 'paid_total', name: gettextCatalog.getString('Paid Total'), ratio: '6%', formatter: FormatterFactory.dollarFormatter },
      { field: 'quote_invoice_state', name: gettextCatalog.getString('Order Status'), ratio: '6%', formatter: statusFormatter, pdfFormatter: statusFormatterLite },
      { field: 'inventory_state', name: gettextCatalog.getString('Inventory Status'), ratio: '6%', formatter: statusFormatter, pdfFormatter: statusFormatterLite }
    ]);
    $scope.columns = columns;

    // search fields
    //
    // number
    // created_at : e.g. 2015-01-19
    // user_id
    // customer_id
    // delivery_date : e.g. 2015-01-19
    // inventory_status : unfulfilled, in_transit, fulfilled
    // correspondence_state : unpaid, partial_paid, paid
    // payment_type : cash, check, cp, cnp, store_credit, reward, others
    // payment_instrument_id : use this filed if others
    // shipping_method : delivery, pick_up, sit_in
    // Number
    // Date (From / / to / /)
    // Created By (All, associate 1, associate 2, associate 3....)
    // Customer (Show customer popover, let user choose)
    // Delivery Date (From / / to / /)
    // Fulfillment Type (Fulfilled, Partial Fulfilled, Unfulfilled)
    // Payment status (Paid, Partial Paid, Unpaid, Cancelled)
    // Payment Type (Cash, Visa, MasterCard......)
    // Shipping Method (Pick Up, Delivery, Dine In)

    // FILTERS
    $scope.filterColumns = [
      {
        field: 'number',
        name: gettextCatalog.getString('Number'),
        types: ['contain', 'equal']
      },
      {
        field: 'reference_number',
        name: gettextCatalog.getString('Reference Number'),
        types: ['contain', 'equal']
      },
      {
        field: 'customer_id',
        name: gettextCatalog.getString('Customer'),
        types: ['equal'],
        customFilter: 'add_customer'
      },

      {
        field: 'created_at',
        name: gettextCatalog.getString('Create Date'),
        types: ['equal', 'between'],
        isDate: true
      },
      {
        field: 'delivery_date',
        name: gettextCatalog.getString('Delivery Date'),
        types: ['equal', 'between'],
        isDate: true
      },
      {
        field: 'inventory_status',
        name: 'Fulfillment Type',
        types: ['options'],
        options: { 'Unfulfilled': 'unfulfilled', 'Partial Fulfilled': 'in_transit', 'Fulfilled': 'fulfilled' }
      },
      {
        field: 'correspondence_state',
        name: 'Payment status',
        types: ['options'],
        options: { 'Paid': 'paid', 'Partial Paid': 'partial_paid', 'Unpaid': 'unpaid' }
      },
      {
        field: 'payment_type',
        name: 'Payment Type',
        types: ['options'],
        options: { 'Cash': 'cash', 'Check': 'check', 'CP': 'cp', 'CNP': 'cnp', 'Store Credit': 'store_credit', 'Reward': 'reward' }
      },
      {
        field: 'shipping_method',
        name: 'Shipping Method',
        types: ['options'],
        options: { 'Delivery': 'delivery', 'Pick up': 'pick_up', 'Sit In': 'sit_in' }
      },

    ];
    $scope.filterType = 'gateway';

    $scope.actions = [
      ['View', function (item) {

        var state = (item.type === 'Quote') ? 'app.dashboard.quotes.view' : 'app.dashboard.invoices.view';

        var store_ids = $stateParams.store_id.split(',');
        var index = store_ids.indexOf(String(item.store_id));
        store_ids.unshift(store_ids.splice(index, 1)[0]);

        $state.go(state, { store_id: store_ids, number: item.number });
      }],
      ['Email reciept', function (item) {
        askEmailAndSend(InvoiceFactory, item.number, item.customer_email || '');
      }],
      ['Fulfill', function (item) {
        if (!confirm('Are you sure you want to fulfill this invoice?')) return;
        InvoiceFactory.fulfillInvoice(item.number)
          .success(function () {
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function (err) {
            console.error(err);
          });
      }, function (item) {
        return (
          item.type == 'Invoice' &&
          item.state !== 'cancelled' &&
          item.inventory_state !== 'fulfilled'
        );
      }],
      ['Cancel Invoice', function (item) {
        if (!confirm('Are you sure you want to cancel this invoice?')) return;
        InvoiceFactory.cancelInvoice(item.number, (item.type === 'Invoice' ? 'invoices' : 'quotes'))
          .success(function () {
            $state.go($state.current.name, $stateParams, { reload: true });
          })
          .error(function (err) {
            console.error(err);
          });
      }, function (item) {
        return (
          item.state !== 'cancelled' &&
          item.state !== 'completed' &&
          item.inventory_state === 'unfulfilled' &&
          item.quote_invoice_state === 'unpaid'
        );
      }],
    ];
  }
}

export class InvoiceQuoteViewController {
  constructor(modules, messageFactory, gettextCatalog, $filter, ngDialog, $scope, $rootScope, $timeout, $compile, $state, $stateParams, DashboardFactory, InvoiceFactory, CustomerFactory, $q) {
    'ngInject';

    var orderNumber = $stateParams.number || '';
    $scope.enclose = $state.is('app.dashboard.quotes.view') ? 'quotes/' + orderNumber : 'invoices/' + orderNumber;

    // TODO: remove it when the whole invoices & quotes flow is move to D2
    /*
    $scope.editPermission = DashboardFactory.getCurrentEditPermission('invoice');

    var invoiceType = $state.is('app.dashboard.quotes.view') ? 'quotes' : 'invoices';

    var stores = DashboardFactory.getCurrentStores();

    var id = $stateParams.store_id.split(',')[0];
    $scope.current_store_id = id;
    $scope.storeName = DashboardFactory.findById(parseInt(id)).title;


    $scope.section = 'overview';
    $scope.delivery_order_visible = modules.warehouse_management_enabled;

    $scope.title = $state.is('app.dashboard.quotes.view') ? 'Quote' : 'Invoice';
    $scope.isQuote = function () {
      return invoiceType === 'quotes';
    };
    $scope.isInvoice = function () {
      return invoiceType === 'invoices';
    };

    var amountFormatter = function (value, item) {
      return $filter('myCurrency')(item.quantity * Number(item.unit_price));
    };
    var statusFormatter = function (value, item) {
      if (!value) return '';

      var text = value;

      if (text === 'in_transit') {
        text = 'partially_fulfilled';
      }
      text = text.replace('_', ' ');

      return '<span><i class="status-icon ' + value + '"></i>' + text + '</span>';
    };


    $scope.editColumns = [
      { field: 'label', name: 'Item', ratio: '40%', formatter: InvoiceFactory.labelFormatter, 'bindHtml': true },
      { field: 'quantity', name: 'Quantity', ratio: '10%', editable: true, type: 'number', pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },
      { field: 'qty_fulfilled', name: 'Fulfilled', ratio: '10%', pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },
      { field: 'unit_price', name: 'Unit Price', ratio: '10%', editable: true, type: 'text', pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },  // hacky
      { field: null, name: 'Amount', ratio: '13%', formatter: amountFormatter, pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/ },

      { field: 'inventory_state', name: 'Status', ratio: '13%', formatter: statusFormatter, bindHtml: true },
    ];

    // suppose a line item "Apple" has id 1001.
    // For Retail, if the line item array doesn't contain such 1001, then "Apple" will be removed.
    // For Restaurant, because of the "auto merge feature", if want to remove Apple, need provide it in voided_line_items with
    // id (*required), voided_by, void_approved_by, void_reason and void_note

    if (modules.restaurant_features_enabled) {
      $scope.editColumnRemoveCallback = function (i, item) {
        item.deleted = true;
      };
    }

    var _invoiceCache = {};
    var _lineItemsCache = [];

    $scope.enableEditMode = function () {
      $scope.editMode = true;
      angular.copy($scope.invoice, _invoiceCache);
      angular.copy($scope.lineItems, _lineItemsCache);
    };


    $scope.sendEmailTemplate = function () {
      askEmailAndSend(InvoiceFactory, $stateParams.number, ($scope.invoice || {}).customer_email);
    };

    $scope.bottomActions = [
      ['Cancel', function () {
        if (confirm(gettextCatalog.getString('Discard all changes?'))) {
          $scope.invoice = angular.copy(_invoiceCache, $scope.invoice);
          $scope.lineItems = angular.copy(_lineItemsCache, $scope.lineItems);
          $scope.editMode = false;
        }
      }, false],
      ['Save', function () {

        InvoiceFactory.updateInvoice($scope.invoice.number, $scope.invoice, $scope.oldInvoice, $scope.lineItems, $scope.current_store_id, invoiceType)
          .success(function (data) {
            $scope.editMode = false;
            $state.reload();
          })
          .error(function (err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });
      }, true],
    ];

    var setCustomer = function (id) {
      var newId = Number(id);
      var customerArray = _.filter($scope.customers, function (customer) {
        return customer.id === newId;
      });
      if (customerArray.length) {
        $scope.customer = customerArray[0];
      }
    };

    $scope.searchCustomers = function (name) {
      $scope.customers = [];
      if (name.length > 2) {
        CustomerFactory.searchCustomers(name)
          .success(function (data) {
            console.log(data);
            $scope.customers = _.map(data, function (c) {
              return c.customer;
            });
          })
          .error(function (err) {
            console.error(err);
          });
      }
    };

    $scope.fulfillInvoice = function () {
      ngDialog.open({
        template: 'app/modules/invoices/fulfill.html',
        controller: 'InvoiceFulfillController',
        scope: $scope,
        className: 'ngdialog-theme-default fulfill-modal'
      })
        .closePromise.then(function (response) {
        var fulfillData = response.value;
        if (!fulfillData ||
          fulfillData == "$closeButton" ||
          fulfillData == "$document") {
          return;
        }
        InvoiceFactory
          .fulfillInvoice($scope.invoice.number, fulfillData)
          .success(function (res) {
            // TODO: replace with response
            location.reload();
          });
      });

    };
    $scope.convertToInvoice = function () {
      if (confirm(gettextCatalog.getString('Are you sure you want to convert to invoice?'))) {
        InvoiceFactory.convertToInvoice($scope.invoice.number).success(function (data) {
          $stateParams.number = data.invoice.number;
          $state.go('app.dashboard.invoices.view', $stateParams);
        }).error(function () {
          messageFactory.add('Convert Failed');
        });
      }
    };

    $scope.exportPDF = function () {
      // $state.go('app.dashboard.invoices.pdf', $stateParams);

      InvoiceFactory.exportPdf($scope.invoice.number)
      .success(function (res){
        const { url } = res;
        if (url){
          location.assign(url);
        }
      });

    };

    $scope.exportDO = function () {
      $state.go('app.dashboard.invoices.dopdf', $stateParams);
    };

    $scope.$watch('invoice.customer_id', function (newValue, old) {
      if (newValue) setCustomer(newValue);
    });

    var initializeListings = function (listing) {
      $scope.lineItems = []
        .concat(listing.charge_line_items)
        .concat(listing.gift_card_line_items)
        .concat(listing.listing_line_items)
        .concat(listing.reward_line_items)
        .concat(listing.store_credit_line_items);

      if (listing.tax_line_item) $scope.lineItems.push(listing.tax_line_item);
      if (listing.delivery_line_item) $scope.lineItems.push(listing.delivery_line_item);

      _.each($scope.lineItems, function (value) {
        value.qty_fulfilled = Number(value.qty_fulfilled);
        value.qty_refunded = Number(value.qty_refunded);
        value.quantity = Number(value.quantity);
      });
    };

    $scope.addItems = function (res) {
      if (res.value == "$closeButton" || res.value == "$document") {
        return;
      }

      var selectedLisings = res.value;

      var listingsToAdd = _.map(selectedLisings, function (listing) {
        return {
          listing_barcode: listing.listing_barcode,
          upc: listing.upc,
          label: listing.name,
          quantity: listing.qtyRequested,
          unit_price: Number(listing.price),
          purchasable_id: listing.id,
          purchasable_type: 'Listing'
        };
      });
      $scope.lineItems = $scope.lineItems.concat(listingsToAdd);
    };

    $scope.calItemTotalQuantity = function (items) {
      if (!items) {
        return 0;
      }

      return _.reduce(items, function (total, item) {
        var quantity = item.quantity || 0;
        return new BigNumber(total).plus(new BigNumber(quantity));
      }, 0).toNumber();
    };

    // new: check if is user to cal new P.O
    $scope.calItemTotal = function (items, type) {
      var filteredItems;
      if (!items) {
        return 0;
      }
      console.log('items', items);
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


    InvoiceFactory.getInvoice($stateParams.number, invoiceType)
      .success(function (data) {
        if (invoiceType === 'quotes') {
          $scope.invoice = data.quote;
        } else {
          $scope.invoice = data.invoice;
        }

        // Either use invoice bill_to / ship_to or customer's billing_address / shipping_address (Website and POS are different)
        $scope.invoice.bill_to_display = $scope.invoice.bill_to || ($scope.invoice.billing_address_info && $scope.invoice.billing_address_info.name);
        $scope.invoice.ship_to_display = $scope.invoice.ship_to || ($scope.invoice.shipping_address_info && $scope.invoice.shipping_address_info.name);
        $scope.invoice.billing_address_display = $scope.invoice.billing_address || ($scope.invoice.billing_address_info && $scope.invoice.billing_address_info.billing_address);
        $scope.invoice.shipping_address_display = $scope.invoice.shipping_address || ($scope.invoice.shipping_address_info && $scope.invoice.shipping_address_info.shipping_address);

        var promises = _.map($scope.invoice.listing_line_items, function (item) {
          return DashboardFactory.searchListingByID(item.purchasable_id);
        });

        $q.all(promises).then(function (items) {
          _.map(items, function (p, index) {
            $scope.invoice.listing_line_items[index].listing_barcode = p.listing.listing_barcode;
            $scope.invoice.listing_line_items[index].upc = p.listing.upc;

          });

        });

        $scope.oldInvoice = _.cloneDeep($scope.invoice);
        setCustomer($scope.invoice.customer_id);
        initializeListings($scope.invoice);
        $timeout(function () {
          $('._compile').not('.ng-scope').each(function (i, el) {
            $compile(el)($scope);
          });
        }, 500);

        refreshDeliveryOrders();
      })
      .error(function (err) {
        console.error(err);
      });


    $scope.saveDeliveryOrder = function (delivery_order, norefresh) {

      if (!delivery_order.ship_date || delivery_order.ship_date === '') {
        delivery_order.ship_date = moment().format('YYYY-MM-DD');
      }

      var new_delivery_order = _.pick(delivery_order, 'number', 'expected_ship_date', 'ship_date', 'purchase_order_id');
      var delivery_order_items = _.map(delivery_order.delivery_order_items, function (item) {
        return item.delivery_order_item;
      });


      InvoiceFactory.updateDeliveryOrder(delivery_order.id, new_delivery_order, delivery_order_items)
        .success(function (data) {
          console.log(data);
          _.each(data.delivery_order.delivery_order_items, function (i, index) {
            var item = i.delivery_order_item;
            delivery_order.delivery_order_items[index].delivery_order_item.id = item.id;
          });

          var newItems = _.map(delivery_order.delivery_order_items, function (i) {
            var item = i.delivery_order_item;
            item.quantity = item.fulfilling;
            item.qty_sent = item.fulfilling;
            return item;
          });

          InvoiceFactory.fulfillDeliveryOrder(delivery_order.id, newItems)
            .success(function (data) {
              console.log(data);
              refreshDeliveryOrders();
            });


        });
    };


    $scope.createDeliveryOrder = function () {
      var order = {};
      order.number = '';
      order.expected_ship_date = '';
      order.ship_date = '';
      order.order_id = $scope.invoice.id;
      InvoiceFactory.createDeliveryOrder(order).then(refreshDeliveryOrders);
    };

    var refreshDeliveryOrders = function () {
      InvoiceFactory.getDeliveryOrdersByInvoice($scope.invoice.id)
        .success(function (data) {
          console.log(data);
          $scope.delivery_orders = data.delivery_orders;
          _.each($scope.delivery_orders, function (order) {
            order._show = false;
            order.state = order.state ? order.state : 'created';
          });

        });
    };


    $scope.fulfillAll = function (delivery_order) {
      _.each(delivery_order.delivery_order_items, function (num) {
        if (isDef(num.delivery_order_item.quantity) && isDef(num.delivery_order_item.qty_sent)) {
          num.delivery_order_item.fulfilling = new BigNumber(num.delivery_order_item.quantity).minus(new BigNumber(num.delivery_order_item.qty_sent)).toNumber();
        }
        else {
          num.delivery_order_item.fulfilling = num.delivery_order_item.quantity;
        }
      });
      $scope.checkFulfillAmount(delivery_order);
    };

    $scope.cancelDeliveryOrder = function (delivery_order) {
      InvoiceFactory.cancelDeliveryOrder(delivery_order.id)
        .success(function (data) {
          console.log(data);
          refreshDeliveryOrders();
        });
    };

    function isDef(value) {
      return (typeof value !== 'undefined' && value !== null && value !== '');
    }

    $scope.checkFulfillAmount = function (delivery_order) {
      _.each(delivery_order.delivery_order_items, function (value) {
        if (isDef(value.delivery_order_item.quantity) && isDef(value.delivery_order_item.qty_sent) && isDef(value.delivery_order_item.fulfilling)) {
          value.delivery_order_item.inTransit = new BigNumber(value.delivery_order_item.quantity).minus(new BigNumber(value.delivery_order_item.qty_sent)).minus(new BigNumber(value.delivery_order_item.fulfilling)).toNumber();
        }
        else {
          value.delivery_order_item.inTransit = 0;
        }
      });
    };
    */
  }
}

export class InvoiceQuoteNewController {
  constructor($filter, $scope, $rootScope, $state, $stateParams, DashboardFactory, InvoiceFactory, CustomerFactory) {
    'ngInject';

    $scope.enclose = $state.is('app.dashboard.quotes.new') ? 'quotes/new' : 'invoices/new';

    // TODO: remove it when the whole invoices & quotes flow is move to D2
    /*
    $scope.editMode = true;

    var invoiceType = $state.is('app.dashboard.quotes.new') ? 'quotes' : 'invoices';
    $scope.invoiceType2 = $state.is('app.dashboard.quotes.new') ? 'Quote' : 'Invoice';

    var amountFormatter = function (value, item) {
      return $filter('myCurrency')(item.quantity * Number(item.unit_price));
    };

    $scope.stores = DashboardFactory.getCurrentStores();
    $scope.current_store_id = $scope.stores[0].id;
    $scope.showStoreName = $scope.stores.length > 1;
    $scope.onSelectedStore = function (item) {
      $scope.current_store_id = item.id;
      if (confirm('Are you sure to switch store?\n All line items and data on this ' + $scope.invoiceType2 + ' would be cleared.')) {
        var store_ids = $stateParams.store_id.split(',');
        var index = store_ids.indexOf(String(item.store_id));
        store_ids.unshift(store_ids.splice(index, 1)[0]);
        if ($state.is('app.dashboard.quotes.new')) {
          $state.go('app.dashboard.quotes.new', { store_id: store_ids });
        }
        else {
          $state.go('app.dashboard.invoices.new', { store_id: store_ids });
        }
      }
    };

    $scope.invoice = { line_items: [] };
    $scope.editColumns = [
      { field: 'label', name: 'Item', ratio: '40%', formatter: InvoiceFactory.labelFormatter, 'bindHtml': true },
      { field: 'quantity', name: 'Quantity', ratio: '20%', editable: true, type: 'number' },
      { field: 'price', name: 'Unit Price', ratio: '20%', editable: true, type: 'number' },
      { field: null, name: 'Amount', ratio: '20%', formatter: amountFormatter }
    ];
    $scope.bottomActions = [
      ['Cancel', function () {
        $state.go('app.dashboard.invoices.index', { store_id: $stateParams.store_id });
      }, false],
      ['Save', function () {
        console.log('$scope.invoice', $scope.invoice);
        _.map($scope.invoice.line_items, function (item) {
          delete item.listing_barcode;
          delete item.upc;
        });
        InvoiceFactory.createInvoice($scope.invoice, $scope.current_store_id, invoiceType)
          .success(function (data) {
            $state.go('app.dashboard.invoices.index', { store_id: $stateParams.store_id });
          })
          .error(function (err) {
            console.error(err);
            $scope.errorMessage = err.message || 'Error when saving';
          });
      }, true],
    ];

    var setCustomer = function (id) {
      var newId = Number(id);
      var customerArray = _.filter($scope.customers, function (customer) {
        return customer.id === newId;
      });
      if (customerArray.length) {
        $scope.customer = customerArray[0];
      }
    };

    $scope.searchCustomers = function (name) {
      $scope.customers = [];
      if (name.length > 0) {
        CustomerFactory.searchCustomers(name)
          .success(function (data) {
            console.log(data);
            $scope.customers = _.map(data, function (c) {
              return c.customer;
            });
          })
          .error(function (err) {
            console.error(err);
          });
      }
    };

    $scope.addItems = function (res) {
      if (res.value == "$closeButton" || res.value == "$document") {
        return;
      }

      var selectedLisings = res.value;

      var listingsToAdd = _.map(selectedLisings, function (listing) {
        return {
          listing_barcode: listing.listing_barcode,
          upc: listing.upc,
          label: listing.name,
          quantity: listing.qtyRequested,
          price: Number(listing.price),
          purchasable_id: listing.id,
          purchasable_type: 'Listing'
        };
      });
      $scope.invoice.line_items = _.unique($scope.invoice.line_items.concat(listingsToAdd), function (item) {
        return item.purchasable_id;
      });
    };


    $scope.$watch('invoice.customer_id', function (newValue, old) {
      if (newValue) {
        setCustomer(newValue);
      }

      if (!$scope.invoice.ship_to_id) {
        $scope.invoice.ship_to_id = newValue;
      }
    });
    */
  }
}

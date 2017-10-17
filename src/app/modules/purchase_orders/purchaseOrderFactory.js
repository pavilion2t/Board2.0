export function PurchaseOrderFactory($rootScope, $http, DashboardFactory, $q) {
  'ngInject';

  var getPurchaseOrder = function(id, store_id) {

    var deferred = $q.defer();

    $http.get($rootScope.gateway + '/v2/stores/' + store_id + '/purchase_orders/' + id)
      .success(function(data) {
        deferred.resolve( data.purchase_order );
      })
      .error(function(err) {
        deferred.resolve(err);
      });

    return deferred.promise;
  };


  var exportPurchaseOrderPDF = function(order) {

    $http({
      method: 'GET',
      headers: {
        Accept: 'application/pdf',
      },
      responseType:'arraybuffer',
      url: $rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + order.id
    }).success(function(pdf){
      var fileName = 'Purchase Order - ' + order.number;
      var blob = new Blob([pdf], { type: 'application/pdf' });
      if(navigator.msSaveBlob) {
        // IE shit
        navigator.msSaveBlob(blob, fileName);
      } else {
        // other better browsers
        var link = document.createElement('a');
        if (link.download !== undefined) {
          // browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });



  };

  var purchaseOrderMapper = function (purchaseOrder, purchaseItems){
    purchaseItems = _.map(purchaseItems, function (item){
      if (!purchaseOrder.exchange_rate_id){
        item.supplier_price = null;
      }
      return item;
    });
    return { purchase_order: purchaseOrder, purchase_items: purchaseItems };
  };

  var updatePurchaseOrder = function (id, order, items) {
    console.log('updatePurchaseOrder');
    // item.quantity will be decrepeted
    _.forEach(items, function(item) {
      item.qty_requested = item.quantity;
    });

    var purchaseOrder = {
      store_id: order.store_id,
      exchange_rate_id: order.exchange_rate_id,
      supplier_id: order.supplier_id,
      remarks: order.remarks,
      payment_state: order.payment_state,
      payment_method: order.payment_method,
      expect_delivery_date: order.expect_delivery_date,
      payment_due_date: order.payment_due_date,
    };
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + id,
      purchaseOrderMapper(purchaseOrder, items));
  };

  var importPurchaseOrder = function(order) {

    // order = {spreadsheet: spreadsheet, supplier_id: supplier_id}

    var fd = new FormData();

    fd.append('purchase_order[spreadsheet]', order.spreadsheet);
    fd.append('purchase_order[supplier_id]', order.supplier_id);


    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders',
      fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      });
  };
  var createPurchaseOrder = function(order, items, store_id) {
    order.store_id = store_id;
    return $http.post($rootScope.gateway + '/v2/stores/' + store_id + '/purchase_orders',
      purchaseOrderMapper(order, items));
  };
  var fulfillPurchaseOrder = function(id, fulfillData) {
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + id + '/fulfill', {purchase_items: fulfillData});
  };
  var submitPurchaseOrder = function(id) {
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/'+ id + '/submit');
  };
  var submitPurchaseOrderWithoutNotification = function(id) {
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + id + '/submit_without_notification');
  };
  var cancelPurchaseOrder = function(id) {
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + id + '/cancel');
  };
  var voidPurchaseOrder = function(id) {
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + id + '/void');
  };
  var uploadPurchaseOrderImage = function(id, file) {
    var fd = new FormData();
    fd.append('image', file);
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + id + '/purchase_order_images', fd, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }
    });
  };
  var fulfillPurchaseItem = function(id, itemId, quantity) {
    return quantity
      ? $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + id + '/purchase_items/' + itemId + '/fulfill', { quantity: quantity })
      : $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + id + '/purchase_items/' + itemId + '/fulfill');
  };

  var returnPurchaseItem = function(id, itemId) {
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + id + '/purchase_items/' + itemId + '/return');
  };
  var cancelPurchaseItem = function(id, itemId) {
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/purchase_orders/' + id + '/purchase_items/' + itemId + '/cancel');
  };

  var purchase_order_template = $rootScope.gateway + '/bindo_purchase_order_template.csv';

  var createReceiveOrder = function(order){
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/receive_orders',{ receive_order: order });
  };

  var updateReceiveOrder = function(id, order, items){
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/receive_orders/'+ id ,{ receive_order: order, receive_order_items: items });
  };


  var fulfillReceiveOrder = function(id, receive_order_items){
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/receive_orders/'+ id +'/receive' ,{ receive_order_items: receive_order_items });
  };

  var cancelReceiveOrder = function(id, receive_order_items){
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/receive_orders/'+ id +'/cancel' ,{});
  };


  var getReceiveOrdersByPO = function(id){
    var param = '/receive_orders?' + 'page=1&' + 'count=99999&' + 'filters[]=purchase_order_id__equal__'+id;
    return $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + param);
  };

  return {
    getPurchaseOrder: getPurchaseOrder,
    updatePurchaseOrder: updatePurchaseOrder,
    createPurchaseOrder: createPurchaseOrder,
    importPurchaseOrder: importPurchaseOrder,
    fulfillPurchaseOrder: fulfillPurchaseOrder,
    submitPurchaseOrder: submitPurchaseOrder,
    submitPurchaseOrderWithoutNotification: submitPurchaseOrderWithoutNotification,
    cancelPurchaseOrder: cancelPurchaseOrder,
    voidPurchaseOrder: voidPurchaseOrder,
    uploadPurchaseOrderImage: uploadPurchaseOrderImage,
    fulfillPurchaseItem: fulfillPurchaseItem,
    returnPurchaseItem: returnPurchaseItem,
    cancelPurchaseItem: cancelPurchaseItem,
    purchase_order_template: purchase_order_template,
    exportPurchaseOrderPDF: exportPurchaseOrderPDF,
    createReceiveOrder: createReceiveOrder,
    updateReceiveOrder: updateReceiveOrder,
    fulfillReceiveOrder: fulfillReceiveOrder,
    cancelReceiveOrder: cancelReceiveOrder,
    getReceiveOrdersByPO: getReceiveOrdersByPO
  };

}

export function PurchaseOrderFormatter($filter, $rootScope, $http, DashboardFactory, currencymap) {
  'ngInject';

  var self = this;
  self.currency = null;

  var setCurrency = function(c){
    self.currency = c;
  };

  var getCurrency = function(){
    return self.currency;
  };

  var dollarFormatter = function(value) {
    return $filter('myCurrency')(value);
  };

  var currencyFormatter = function(value) {
    var defaultCurrency = DashboardFactory.getCurrentStore().currency;
    var currency = self.currency ? self.currency.currency_to : defaultCurrency;
    return $filter('myCurrency')(value, currency);
  };

  var defaultCurrencyFormatter = function(value) {
    var defaultCurrency = DashboardFactory.getCurrentStore().currency;
    return $filter('myCurrency')(value, defaultCurrency);
  };

  // quantity = ordered_quantity!!!
  var nameFormatter = function(value, item) {
    var html = '<div class="_line-item">' +
      '<img src="assets/images/inventory_placeholder.png">' +
      '<p>' + value + '</p>';
    if(item.upc || item.gtid) {
      html += '<p>' + (item.upc ? item.upc : item.gtid) + '</p>';
    } else if(item.product_id) {
      html += '<p>Product ID' + item.product_id + '</p>';
    }
    return html;
  };

  var qtyInTransitFormatter = function(value, item) {
    return item.quantity - item.qty_received;
  };
  var totalCostFormatter = function(value, item) {
    var defaultCurrency = DashboardFactory.getCurrentStore().currency;
    var original = Number(item.price || 0);
    var local = Number(item.supplier_price || 0);

    if(item.supplier_price === null || self.currency === null){
      return '<p>' + defaultCurrency + original.toFixed(2)  + '</p>';
    }

    var symbol = currencymap[self.currency.currency_to].code;

    if(defaultCurrency === symbol){
      return '<p>' + defaultCurrency + original.toFixed(2)  + '</p>';
    }

    return '<p>' + defaultCurrency + original.toFixed(2) + '<br/>' + symbol + local.toFixed(2) + '</p>';
  };

  var computedTotalCostFormatter = function(value, item) {
    var defaultCurrency = DashboardFactory.getCurrentStore().currency;
    var quantity = Number(item.quantity || 0);
    var original = Number(item.price || 0);
    var local = Number(item.supplier_price || 0);

    if(item.supplier_price === null || self.currency === null){
      return '<p>' + defaultCurrency + (original * quantity).toFixed(2)  + '</p>';
    }

    var symbol = currencymap[self.currency.currency_to].code;

    if(defaultCurrency === symbol){
      return '<p>' + defaultCurrency + (original * quantity).toFixed(2)  + '</p>';
    }

    return '<p>' + defaultCurrency + (original * quantity).toFixed(2) + '<br/>' + symbol + (local * quantity).toFixed(2) + '</p>';
  }

  var stateFormatter = function(value, item) {
    if(!value) {
      return '';
    }
    if(value === 'unfulfilled') { value = 'created'; }
    var text = _.map(value.split('_'), function(word) {
      return word[0].toUpperCase() + word.slice(1);
    });
    return '<span><i class="status-icon ' + value + '"></i>' + text.join(' ') + '</span>';
  };
  var actionFormatter = function(value, item) {
    var actionHTML = '';
    if(item.state === 'submitted' || item.state === 'partially_fulfilled') {
      actionHTML += "<button class='_button _primary _compile' ng-click='startFulfillingPurchaseItem("+item.id+")'>Fulfill</button>";
    } else if(item.state === 'fulfilled') {
      actionHTML += "<button class='_button _primary _compile' ng-click='returnPurchaseItem("+item.id+")'>Return</button>";
    }
    if(item.state !== 'canceled') {
      actionHTML += "<button class='_button _secondary _compile' ng-click='cancelPurchaseItem("+item.id+")'>Cancel</button>";
    }
    return actionHTML;
  };

  var afterFormatter = function(value, item) {
    var x = new BigNumber(item.inventory_quantity);
    var y = new BigNumber(item.quantity);


    return x.plus(y).toNumber();
  };

  var dollarTotalFormatter = function(row, cell, value, columnDef, dataContext) {
    if(dataContext.exchange_rate === null){
      return $filter('myCurrency')(value);
    }
    else {
      var symbol = currencymap[dataContext.exchange_rate.currency_to].symbol_native;
      return $filter('myCurrency')(value, symbol);
    }
  };

  return {
    dollarFormatter: dollarFormatter,
    dollarTotalFormatter: dollarTotalFormatter,
    nameFormatter: nameFormatter,
    qtyInTransitFormatter: qtyInTransitFormatter,
    totalCostFormatter: totalCostFormatter,
    stateFormatter: stateFormatter,
    actionFormatter: actionFormatter,
    afterFormatter: afterFormatter,
    setCurrency: setCurrency,
    getCurrency: getCurrency,
    currencyFormatter: currencyFormatter,
    defaultCurrencyFormatter: defaultCurrencyFormatter,
    computedTotalCostFormatter
  };

}

export function InvoiceFactory($rootScope, $http, DashboardFactory, CommonFactory) {
  'ngInject';

  var getInvoice = function(number, type) {
    type = type || 'invoices';

    return $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/' +type+ '/' + number);
  };
  var createInvoice = function(invoice, store_id, type) {
    return $http.post($rootScope.gateway + '/v2/stores/' + store_id + '/'+ type, { order: invoice });
  };
  var updateInvoice = function(number, newInvoice, oldInvoice, lineItems, store_id, type) {
    var diff = CommonFactory.getDiff(newInvoice, oldInvoice);

    // suppose a line item "Apple" has id 1001.
    // For Retail, if the line item array doesn't contain such 1001, then "Apple" will be removed.
    // For Restaurant, because of the "auto merge feature", if want to remove Apple, need provide it in voided_line_items with
    // id (*required), voided_by, void_approved_by, void_reason and void_note

    diff.line_items = _.reduce(lineItems, function(acc, lineItem) {
      if(!lineItem.deleted) {
        acc.push({
          id: lineItem.id,
          quantity: lineItem.quantity,
          price: lineItem.unit_price,
          label: lineItem.label,
          purchasable_id: lineItem.purchasable_id,
          purchasable_type: lineItem.purchasable_type
        })
      }
      return acc;
    }, []);

    diff.voided_line_items = _.reduce(lineItems, function(acc, lineItem) {
      if(lineItem.deleted) {
        acc.push({
          id: lineItem.id,
          voided_by: 'dashboard',
          void_approved_by: 'dashboard',
          void_reason: 'dashboard',
          void_note: 'dashboard',
        })
      }
      return acc
    }, []);
    console.log('diff', diff);

    delete diff.listing_line_items;
    delete diff.tax_line_item;
    delete diff.delivery_line_item;
    delete diff.sale_transactions;
    delete diff.charge_line_items;
    delete diff.adjustment_line_items;
    delete diff.store_credit_line_items;
    delete diff.gift_card_line_items;
    delete diff.reward_line_items;
    delete diff.billing_address_info;
    delete diff.customer_email;
    delete diff.shipping_address_info;


    return $http.put($rootScope.gateway + '/v2/stores/' + store_id + '/' + type +'/' + number, { order: diff });
  };
  var cancelInvoice = function(number, type) {
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/'+ type + '/' + number + '/cancel', {});
  };
  var fulfillInvoice = function(number, fulfillData) {
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/invoices/' + number + '/fulfill', {line_items: fulfillData});
  };
  var fulfillLineItem = function(number, item_id, quantity) {
    return quantity
      ? $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/invoices/' + number + '/line_items/' + item_id + '/fulfill', { quantity: quantity })
      : $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/invoices/' + number + '/line_items/' + item_id + '/fulfill');
  };
  var cancelLineItem = function(number, item_id) {
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/invoices/' + number + '/line_items/' + item_id + '/cancel');
  };

  var emailReciept = function(number, type, email) {
    var data = {recipient: email}
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/'+type+'/' + number + '/notify', data);
  };

  var convertToInvoice = function(number) {
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/quotes/' + number + '/convert_to_invoice');
  };




  var createDeliveryOrder = function(order){
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/delivery_orders',{ delivery_order: order });
  };

  var updateDeliveryOrder = function(id, order, items){
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/delivery_orders/'+ id ,{ delivery_order: order, delivery_order_items: items });
  };


  var fulfillDeliveryOrder = function(id, delivery_order_items){
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/delivery_orders/'+ id +'/receive' ,{ delivery_order_items: delivery_order_items });
  };

  var cancelDeliveryOrder = function(id, receive_order_items){
    return $http.put($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/delivery_orders/'+ id +'/cancel' ,{});
  };

  var getDeliveryOrdersByInvoice = function(id){
    //var param = '/delivery_orders?' + 'page=1&' + 'count=99999&' + 'filters[]=order_id__equal__'+id;
    var param = '/delivery_orders?' + 'page=1&' + 'count=99999&' + 'filters[]=order_id__equal__'+id;
    return $http.get($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + param);
  };

  var sendEmailTemplate = function(number,email){
    return $http.post($rootScope.gateway + '/v2/stores/' + DashboardFactory.getStoreId() + '/email_template/send?template_type=invoice&recipient='+email+'&order_number='+number);
  };

  var exportPdf = function (number) {
    const storeId = DashboardFactory.getStoreId();
    const params = {
      template_type: 'airprint_invoice',
    };
    const cfg = { params };
    const path = `${$rootScope.gateway}/v2/stores/${storeId}/invoices/${number}/download`;
    return $http.get(path, cfg);
  };

  var labelFormatter = function (value, item){
    var code = "";
    var upc = "";
    if(item.listing_barcode){
      code = "SKU / PLU: " + item.listing_barcode;
    }

    if(item.upc){
      upc = "UPC / EAN: " + item.upc;
    }
    return "<p>" + value + "</p>" +
      '<p class="_margin-0">' + code + "</p>" +
      '<p class="_margin-0">' + upc + "</p>";
  };


  return {
    labelFormatter: labelFormatter,
    getInvoice: getInvoice,
    createInvoice: createInvoice,
    updateInvoice: updateInvoice,
    cancelInvoice: cancelInvoice,
    fulfillInvoice: fulfillInvoice,
    fulfillLineItem: fulfillLineItem,
    cancelLineItem: cancelLineItem,
    emailReciept: emailReciept,
    convertToInvoice: convertToInvoice,
    createDeliveryOrder: createDeliveryOrder,
    updateDeliveryOrder: updateDeliveryOrder,
    fulfillDeliveryOrder: fulfillDeliveryOrder,
    cancelDeliveryOrder: cancelDeliveryOrder,
    getDeliveryOrdersByInvoice: getDeliveryOrdersByInvoice,
    sendEmailTemplate: sendEmailTemplate,
    exportPdf,
  };
}

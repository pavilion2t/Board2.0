import { pick, available } from '../../shared/filter'
export function PdfInvoiceFactory($rootScope, $http, DashboardFactory, CommonFactory, $q, FormatterFactory, $filter) {
  'ngInject';

  function formatDate(date) {
    if (typeof date === 'undefined' || date === null) {
      return '';
    }
    date = date.toString();
    return FormatterFactory.dateFormatter(0, 0, date);
  }

  function formatSimpleDate(date) {
    if (typeof date === 'undefined' || date === null) {
      return '';
    }
    date = date.toString();
    return FormatterFactory.simpleDateFormatter(0, 0, date);
  }

  function formatCurrency(amount) {
    if (typeof amount === 'undefined' || amount === null) {
      return '';
    }
    return FormatterFactory.dollarFormatter(0, 0, amount);
  }

  function getBase64FromImageUrl(url) {
    var img = new Image();
    var deferred = $q.defer();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      return deferred.resolve({ data: dataURL, width: this.width, height: this.height });
    };
    img.onerror = function () {
      return deferred.resolve({ data: null, width: 0, height: 0 });
    };

    img.src = url;
    return deferred.promise;
  }

  function checkNonZero(value) {
    var num = Number(value);
    if (!isNaN(num) && num !== 0.0) {
      return true;
    }
    return false;
  }

  var commonDefineFont = function (p, nSize, scale) {
    p.defineFont('norm', nSize * scale, 'normal', { r: 80, g: 80, b: 80 });
    p.defineFont('bold', nSize * scale, 'normal', { r: 0, g: 0, b: 0 });
    p.defineFont('invoice', 20 * scale, 'normal', { r: 0, g: 0, b: 0 });
    p.defineFont('invoice#', 20 * scale, 'normal', { r: 0, g: 0, b: 0 });
    p.defineFont('total', 16 * scale, 'normal', { r: 0, g: 0, b: 0 });
    p.defineFont('documentHeader', nSize * scale, 'normal', { r: 128, g: 128, b: 128 });
  };

  var exportDoThen = function (data, option) {
    var currentType = option.format;
    var nSize = 10;
    var type = {};
    type['a4'] = { width: 595, scale: 1 };
    type['a5'] = { width: 420, scale: 0.7 };

    var delivery_orders = option.delivery_orders;
    var invoice = option.invoice;
    var user_input = option.user_input;
    var currentStore = option.currentStore;


    var doc = new jsPDF('p', 'pt', currentType);
    var p = jsPDFExtend(doc, { defaultWidth: type[currentType].width, defaultPadding: 0 });
    var scale = type[currentType].scale;
    commonDefineFont(p, nSize, scale);


    //p.layoutGrid = true;


    // Document Header Row


    var firstItem = true;

    for (var j = 0; j < delivery_orders.length; j++) {

      var delivery = delivery_orders[j];
      if (!delivery.selected) {
        continue;
      }

      if (!firstItem) {
        p.add(new p.pageBreak());
      }

      firstItem = false;


      var today = formatDate(new Date());

      var documentHeaderRow = new p.box({ padding: 5 });
      var documentNumberCol = new p.col({ hAlign: 'l' });
      var documentDateCol = new p.col({ hAlign: 'r' });

      documentNumberCol.add(new p.text('', 'documentHeader'));
      documentDateCol.add(new p.text('Document Date: ' + today, 'documentHeader'));
      documentHeaderRow.add(documentNumberCol).add(documentDateCol);
      p.add(documentHeaderRow);

      // Logo Row
      var logoRow = new p.col({ padding: 10, hAlign: 'm' });
      p.add(logoRow);
      if (data.data) {
        logoRow.add(new p.img(data.data, data.width, data.height))
      }

      // Separator Row
      var separatorRow = new p.vSpace(5, { borderTop: true });
      p.add(separatorRow);

      // Invoice Row

      var invoiceRow = new p.box({ padding: 5 });
      p.add(invoiceRow);

      var invoiceNumberCol = new p.col({ hAlign: 'l', widthWeight: 7 });
      //invoiceNumberCol.add(new p.text('INVOICE ','invoice')).add(new p.text('#'+invoice.id,'invoice#'));
      invoiceNumberCol.add(new p.text('DELIVERY ORDER ', 'invoice')).add(new p.text('#' + invoice.id + '-' + delivery.id, 'invoice#'));


      var deliveryOrder = new p.row({ hAlign: 'r', widthWeight: 3 });
      deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text(formatDate(delivery.created_at), 'bold')).add(new p.text('Created at: ', 'norm')));
      deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text(delivery.created_by, 'bold')).add(new p.text('Created by: ', 'norm')));
      deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text($filter('titleCase')(invoice.inventory_state), 'bold')).add(new p.text('Status: ', 'norm')));

      invoiceRow.add(invoiceNumberCol).add(deliveryOrder);

      //Store Row
      var storeRow = new p.box({ padding: 5 });
      p.add(storeRow);

      var storeCol = new p.row({ hAlign: 'l' });
      storeCol.add(new p.text(currentStore.title, 'bold'))
        .add(new p.text(currentStore.address1, 'norm'))
        .add(new p.text(currentStore.address2, 'norm'))
        .add(new p.text(currentStore.phone, 'norm'));


      var shipDateCol = new p.row({ hAlign: 'l' });

      if (delivery.ship_date) {
        shipDateCol
          .add(new p.text('SHIP DATE', 'norm'))
          .add(new p.vSpace(2))
          .add(new p.text(formatSimpleDate(delivery.ship_date), 'bold'));
      }

      var orderCol = new p.row({ hAlign: 'r' });
      orderCol
        .add(new p.text('ORDER #', 'norm'))
        .add(new p.vSpace(2))
        .add(new p.text(delivery.number, 'bold'));

      storeRow.add(storeCol).add(shipDateCol).add(orderCol);

      // Customer Row
      var customerRow = new p.box({ padding: 5 });
      p.add(customerRow);


      var shipToCol = new p.row({ hAlign: 'l' });

      if (invoice.shipping_address_info) {
        shipToCol.add(new p.text('SHIP TO', 'norm'))
          .add(new p.text(invoice.shipping_address_info.name, 'bold'))
          .add(new p.text(invoice.shipping_address_info.shipping_address, 'bold'))
          .add(new p.text(invoice.shipping_address_info.phone, 'bold'))
      }

      var shipMethodCol = new p.row({ hAlign: 'l' });

      if (user_input.shipping_method && user_input.shipping_method !== '') {
        shipMethodCol.add(new p.text('SHIPPING METHOD', 'norm'))
          .add(new p.text(user_input.shipping_method, 'bold'))
      }


      var paymentCol = new p.row({ hAlign: 'r' });

      if (user_input.handling_liable && user_input.handling_liable !== '') {
        paymentCol.add(new p.text('HANDLING LIABLE TO', 'norm'))
          .add(new p.text(user_input.handling_liable, 'bold'))
      }


      customerRow.add(shipToCol).add(shipMethodCol).add(paymentCol);

      // Table Header Row


      var tableHeaderRow = new p.box({ padding: 5, borderTop: true, borderBottom: true });
      p.add(tableHeaderRow);

      tableHeaderRow
        .add(new p.row({ widthWeight: 4, hAlign: 'l' }).add(new p.text('DESCRIPTION', 'bold')))
        .add(new p.row({ widthWeight: 1, hAlign: 'r' }).add(new p.text('QUANTITY', 'bold')))
        .add(new p.row({ widthWeight: 2, hAlign: 'r' }).add(new p.text('SENT', 'bold')))
        .add(new p.row({ widthWeight: 2, hAlign: 'r' }).add(new p.text('FULFILMENT NOTE', 'bold')));

      // Table
      p.add(new p.vSpace(10));


      for (var i = 0; i < delivery.delivery_order_items.length; i++) {


        var item = delivery.delivery_order_items[i].delivery_order_item;

        var itemRow = new p.box({ padding: 5 });
        p.add(itemRow);

        var firstCol = new p.row({ widthWeight: 4 });
        itemRow.add(firstCol)

        firstCol.add(new p.text(item.description, 'bold'));
        if (item.serial_numbers !== null) {
          firstCol.add(new p.text('S/N: ' + item.serial_numbers, 'bold'));
        }


        itemRow.add(new p.row({ widthWeight: 1, hAlign: 'r' })
          .add(new p.text(item.quantity, 'bold')));


        var thirdCol = new p.row({ widthWeight: 2, hAlign: 'r' });
        itemRow.add(thirdCol);

        thirdCol.add(new p.text(item.qty_sent, 'bold'));

        var fourthCol = new p.row({ widthWeight: 2, hAlign: 'r' });
        itemRow.add(fourthCol);

        if (item.fulfilment_note !== null) {
          fourthCol.add(new p.text('' + item.fulfilment_note, 'bold'));
        }

        thirdCol.add(new p.vSpace(5));
        fourthCol.add(new p.vSpace(5));

        p.add(new p.vSpace(10));


      }
      p.add(new p.vSpace(10, { borderTop: true }));


      // Summary Row
      var lRow = [];
      var rRow = [];

      for (var k = 0; k < 5; k++) {
        var newSummaryRow = new p.box({ padding: 5 });
        p.add(newSummaryRow);

        var newLRow = new p.row({ widthWeight: 1, hAlign: 'l' });
        var newRRow = new p.row({ widthWeight: 1, hAlign: 'l' });

        newSummaryRow.add(newLRow).add(newRRow);
        lRow.push(newLRow);
        rRow.push(newRRow);

      }

      if (user_input.goods_aspect && user_input.goods_aspect !== '') {
        lRow[0].add(new p.text('GOODS ASPECT', 'norm'));
        lRow[0].add(new p.text(user_input.goods_aspect, 'bold'));
      }

      if (user_input.carriage && user_input.carriage !== '') {
        rRow[0].add(new p.text('CARRIAGE', 'norm'));
        rRow[0].add(new p.text(user_input.carriage, 'bold'));
      }

      if (user_input.remarks && user_input.remarks !== '') {
        lRow[1].add(new p.text('REMARKS', 'norm'));
        lRow[1].add(new p.text(user_input.remarks, 'bold'));
      }

      if (user_input.shipping_agent_1 && user_input.shipping_agent_1 !== '') {
        lRow[2].add(new p.text('SHIPPING AGENT 1', 'norm'));
        lRow[2].add(new p.text(user_input.shipping_agent_1, 'bold'));
        lRow[3].add(new p.text('SHIPPING AGENT 1 SIGNATURE', 'norm'));
        lRow[3].add(new p.vSpace(40, { borderBottom: true }));
      }

      if (user_input.shipping_agent_2 && user_input.shipping_agent_2 !== '') {
        rRow[2].add(new p.text('SHIPPING AGENT 2', 'norm'));
        rRow[2].add(new p.text(user_input.shipping_agent_2, 'bold'));
        rRow[3].add(new p.text('SHIPPING AGENT 2 SIGNATURE', 'norm'));
        rRow[3].add(new p.vSpace(40, { borderBottom: true }));
      }

      lRow[3].add(new p.vSpace(10));
      lRow[3].add(new p.text('TRANSPORT DATE & TIME', 'norm'));
      lRow[3].add(new p.vSpace(40, { borderBottom: true }));

      rRow[3].add(new p.vSpace(10));
      rRow[3].add(new p.text('ADDRESSEE SIGNATURE', 'norm'));
      rRow[3].add(new p.vSpace(40, { borderBottom: true }));


    }


    p.layout();
    p.draw();

    p.report();
    doc.save(currentStore.title + '_Delivery_Note_' + invoice.id + '.pdf');
  };


  var exportInvoiceThen = function (data, option) {
    var currentType = option.format;
    var invoice = option.invoice;
    var currentStore = option.currentStore;
    var user_input = option.user_input;
    var lineItems = option.lineItems;

    var nSize = 10;
    var type = {};
    type['a4'] = { width: 595, scale: 1 };
    type['a5'] = { width: 420, scale: 0.7 };

    var doc = new jsPDF('p', 'pt', currentType);
    var p = jsPDFExtend(doc, { defaultWidth: type[currentType].width, defaultPadding: 0 });
    //p.layoutGrid = true;
    var scale = type[currentType].scale;
    commonDefineFont(p, nSize, scale);

    // Document Header Row
    var documentHeaderRow = new p.box({ padding: 5 });
    var documentNumberCol = new p.col({ hAlign: 'l' });
    var documentDateCol = new p.col({ hAlign: 'r' });

    var today = formatDate(new Date());
    documentNumberCol.add(new p.text('', 'documentHeader'));
    documentDateCol.add(new p.text('Document Date: ' + today, 'documentHeader'));
    documentHeaderRow.add(documentNumberCol).add(documentDateCol);
    p.add(documentHeaderRow);

    // Logo Row
    var logoRow = new p.col({ padding: 10, hAlign: 'm' });
    p.add(logoRow);
    if (data.data) {
      logoRow.add(new p.img(data.data, data.width, data.height));
    }

    // Separator Row
    var separatorRow = new p.vSpace(5, { borderTop: true });
    p.add(separatorRow);

    // Invoice Row

    var invoiceRow = new p.box({ padding: 5 });
    p.add(invoiceRow);

    var invoiceNumberCol = new p.col({ hAlign: 'l' });
    //invoiceNumberCol.add(new p.text('INVOICE ','invoice')).add(new p.text('#'+invoice.id,'invoice#'));
    invoiceNumberCol.add(new p.text('REFERENCE ', 'invoice')).add(new p.text('#' + invoice.reference_number, 'invoice#'));


    var deliveryOrder = new p.row({ hAlign: 'r' });
    deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text(formatDate(invoice.created_at), 'bold')).add(new p.text('Created at: ', 'norm')));
    deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text(invoice.created_by, 'bold')).add(new p.text('Created by: ', 'norm')));
    deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text($filter('titleCase')(invoice.inventory_state), 'bold')).add(new p.text('Status: ', 'norm')));
    invoiceRow.add(invoiceNumberCol).add(deliveryOrder);

    //Store Row
    var storeRow = new p.box({ padding: 5 });
    p.add(storeRow);

    var storeCol = new p.row({ hAlign: 'l' });
    storeCol.add(new p.text(currentStore.title, 'bold'))
      .add(new p.text(currentStore.address1, 'norm'))
      .add(new p.text(currentStore.address2, 'norm'))
      .add(new p.text(currentStore.phone, 'norm'));


    var dueDateCol = new p.row({ hAlign: 'l' });
    dueDateCol
      .add(new p.text('DUE DATE', 'norm'))
      .add(new p.vSpace(2))
      .add(new p.text(formatSimpleDate(invoice.due_date), 'norm'));

    var amountDueCol = new p.row({ hAlign: 'r' });
    amountDueCol
      .add(new p.text('AMOUNT DUE', 'norm'))
      .add(new p.vSpace(2))
      .add(new p.text(formatCurrency(invoice.initial_total), 'bold'));

    storeRow.add(storeCol).add(dueDateCol).add(amountDueCol);

    // Customer Row
    var customerRow = new p.box({ padding: 5 });
    p.add(customerRow);


    var billToCol = new p.row({ hAlign: 'l' });

    if (invoice.billing_address_info) {
      billToCol.add(new p.text('BILL TO', 'norm'))
        .add(new p.text(invoice.billing_address_info.name, 'bold'))
        .add(new p.text(invoice.billing_address_info.billing_address, 'bold'))
        .add(new p.text(invoice.billing_address_info.phone, 'bold'))
    }

    var shipToCol = new p.row({ hAlign: 'l' });

    if (invoice.shipping_address_info) {
      shipToCol.add(new p.text('SHIP TO', 'norm'))
        .add(new p.text(invoice.shipping_address_info.name, 'bold'))
        .add(new p.text(invoice.shipping_address_info.shipping_address, 'bold'))
        .add(new p.text(invoice.shipping_address_info.phone, 'bold'))
    }

    var paymentCol = new p.row({ hAlign: 'r' });

    paymentCol.add(new p.col({ hAlign: 'r' })
      .add(new p.text($filter('titleCase')(invoice.invoice_state), 'bold'))
      .add(new p.text('Payment Status: ', 'norm'))
    );

    paymentCol.add(new p.col({ hAlign: 'r' })
      .add(new p.text(user_input.payment_terms, 'bold'))
      .add(new p.text('Payment Terms: ', 'norm'))
    );

    paymentCol.add(new p.col({ hAlign: 'r' })
      .add(new p.text(formatCurrency(invoice.amount_lefted), 'bold'))
      .add(new p.text('Amount Remaining: ', 'norm'))
    );

    var sum = _.reduce(invoice.sale_transactions, function (memo, num) {
      return memo + Number(num.actual_payment_amount);
    }, 0);

    paymentCol.add(new p.col({ hAlign: 'r' })
      .add(new p.text(formatCurrency(sum), 'bold'))
      .add(new p.text('Amount Paid: ', 'norm'))
    );

    paymentCol.add(new p.col({ hAlign: 'r' })
      .add(new p.text(invoice.sale_transactions.length, 'bold'))
      .add(new p.text('Payment(s): ', 'norm'))
    );

    customerRow.add(billToCol).add(shipToCol).add(paymentCol);

    // Table Header Row
    var tableHeaderRow = new p.box({ padding: 5, borderTop: true, borderBottom: true });
    p.add(tableHeaderRow);

    tableHeaderRow
      .add(new p.row({ widthWeight: 4, hAlign: 'l' }).add(new p.text('DESCRIPTION', 'bold')))
      .add(new p.row({ widthWeight: 1, hAlign: 'r' }).add(new p.text('QUANTITY', 'bold')))
      .add(new p.row({ widthWeight: 2, hAlign: 'r' }).add(new p.text('PRICE($)', 'bold')))
      .add(new p.row({ widthWeight: 2, hAlign: 'r' }).add(new p.text('AMOUNT($)', 'bold')));

    // Table
    p.add(new p.vSpace(10));

    for (var i = 0; i < lineItems.length; i++) {
      var item = lineItems[i];

      var itemRow = new p.box({ padding: 5 });
      p.add(itemRow);

      var firstCol = new p.row({ widthWeight: 4 });
      itemRow.add(firstCol)

      firstCol.add(new p.text(item.label, 'bold'));

      if (item.upc !== null) {
        firstCol.add(new p.text('UPC / EAN: ' + item.upc, 'bold'));
      }

      if (item.listing_barcode !== null) {
        firstCol.add(new p.text('SKU / PLU: ' + item.listing_barcode, 'bold'));
      }

      if (item.serial_number !== null) {
        firstCol.add(new p.text('S/N: ' + item.serial_number, 'bold'));
      }
      if (item.note !== null) {
        firstCol.add(new p.text('Note: ' + item.note, 'norm'));
      }


      itemRow.add(new p.row({ widthWeight: 1, hAlign: 'r' })
        .add(new p.text(item.quantity, 'bold')));


      var thirdCol = new p.row({ widthWeight: 2, hAlign: 'r' });
      itemRow.add(thirdCol);

      thirdCol.add(new p.text(formatCurrency(item.unit_price), 'bold'))

      var fourthCol = new p.row({ widthWeight: 2, hAlign: 'r' });
      itemRow.add(fourthCol);
      fourthCol.add(new p.text(formatCurrency(Number(item.unit_price) * item.quantity), 'bold'))

      thirdCol.add(new p.vSpace(5))
      fourthCol.add(new p.vSpace(5))

      var modified = false;
      for (var j = 0; j < item.modifier_entries.length; j++) {
        var modifier = item.modifier_entries[j];
        var sign = '';
        if (modifier.price > 0) {
          sign = '+ ';
        }
        else if (modifier.price < 0) {
          sign = '- ';
        }
        thirdCol.add(new p.text(sign + modifier.modifier_option_name, 'bold'));
        fourthCol.add(new p.text(formatCurrency(modifier.price), 'bold'))

        modified = true;
      }
      for (var j = 0; j < item.discount_entries.length; j++) {
        var discount = item.discount_entries[j];
        thirdCol.add(new p.text(discount.discount_name, 'bold'));
        fourthCol.add(new p.text(formatCurrency(-discount.amount), 'bold'))

        modified = true;
      }


      if (modified) {
        thirdCol.add(new p.text('Total:', 'bold'));
        fourthCol.add(new p.text(formatCurrency(item.total), 'bold'));
      }


      // Tax
      if (item.tax_amount !== null && checkNonZero(item.tax_amount)) {
        var taxname = 'Tax:';
        if (item.tax_name) {
          taxname = 'Tax (' + item.tax_name + '):';
        }
        thirdCol.add(new p.vSpace(5));
        thirdCol.add(new p.text(taxname, 'bold'));
      }
      if (item.tax_amount !== null && checkNonZero(item.tax_amount)) {
        fourthCol.add(new p.vSpace(5));
        fourthCol.add(new p.text(formatCurrency(item.tax_amount), 'bold'));
      }


      p.add(new p.vSpace(10));


    }
    p.add(new p.vSpace(10, { borderTop: true }));


    // Summary Row
    var summaryRow = new p.box({ padding: 5 });
    p.add(summaryRow);

    //summaryRow.add( new p.text(invoice.listing_line_items.length+' Unique Item(s)','bold',{widthWeight:3}) );

    var noteBox = new p.row({ widthWeight: 5 });
    summaryRow.add(noteBox);

    if (invoice.note) {
      noteBox.add(new p.text('Note: '))
      noteBox.add(new p.text(invoice.note));
    }

    var totalRow = new p.row({ hAlign: 'r', widthWeight: 3 });
    summaryRow.add(totalRow);


    var totalItemBox = new p.box();
    totalRow.add(totalItemBox);

    var totalAmount = _.sum(invoice.listing_line_items, function (p) {
      return p.quantity;
    });

    totalItemBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Total Quantity: ', 'norm')));
    totalItemBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(totalAmount, 'bold')));

    var subtotalBox = new p.box();
    totalRow.add(subtotalBox);
    subtotalBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Subtotal: ', 'norm')));
    subtotalBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(formatCurrency(invoice.subtotal), 'bold')));

    if (checkNonZero(invoice.initial_tax)) {
      var taxBox = new p.box();
      totalRow.add(taxBox);
      taxBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Tax: ', 'norm')));
      taxBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(formatCurrency(invoice.initial_tax), 'bold')));
    }

    if (checkNonZero(invoice.discount_total)) {
      var discountBox = new p.box();
      totalRow.add(discountBox);
      discountBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Discount: ', 'norm')));
      discountBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(formatCurrency(-invoice.discount_total), 'bold')));
    }

    if (checkNonZero(invoice.initial_service_fee)) {
      var serviceFeeBox = new p.box();
      totalRow.add(serviceFeeBox);
      serviceFeeBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Service Fee: ', 'norm')));
      serviceFeeBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(formatCurrency(invoice.initial_service_fee), 'bold')));
    }

    if (checkNonZero(invoice.initial_tips)) {
      var tipsBox = new p.box();
      totalRow.add(tipsBox);
      tipsBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Tips: ', 'norm')));
      tipsBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(formatCurrency(invoice.initial_tips), 'bold')));
    }

    if (checkNonZero(invoice.initial_rounding)) {
      var roundingBox = new p.box();
      totalRow.add(roundingBox);
      roundingBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Rounding: ', 'norm')));
      roundingBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(formatCurrency(invoice.initial_rounding), 'bold')));
    }

    // Total Row
    var totalBox = new p.box();
    totalRow.add(totalBox);
    totalBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Total: ', 'total')));
    totalBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(formatCurrency(invoice.initial_total), 'total')));


    p.layout();
    p.draw();

    p.report();
    doc.save(currentStore.title + '_Invoice_Reference_' + invoice.reference_number + '.pdf');
  };


  var exportPoThen = function (data, option) {


    var currentType = option.format;
    var po = option.po;
    var otherInfo = option.otherInfo;
    var currentStore = option.currentStore;

    var nSize = 10;
    var type = {};
    type['a4'] = { width: 595, scale: 1 };
    type['a5'] = { width: 420, scale: 0.7 };

    var doc = new jsPDF('p', 'pt', currentType);
    var p = jsPDFExtend(doc, { defaultWidth: type[currentType].width, defaultPadding: 0 });
    //p.layoutGrid = true;
    var scale = type[currentType].scale;
    commonDefineFont(p, nSize, scale);

    // Document Header Row
    var documentHeaderRow = new p.box({ padding: 5 });
    var documentNumberCol = new p.col({ hAlign: 'l' });
    var documentDateCol = new p.col({ hAlign: 'r' });

    var today = formatDate(new Date());
    documentNumberCol.add(new p.text('', 'documentHeader'));
    documentDateCol.add(new p.text('Document Date: ' + today, 'documentHeader'));
    documentHeaderRow.add(documentNumberCol).add(documentDateCol);
    p.add(documentHeaderRow);

    // Logo Row
    var logoRow = new p.col({ padding: 10, hAlign: 'm' });
    p.add(logoRow);
    /*
     if ( data.data ){
     logoRow.add( new p.img(data.data,data.width,data.height) );
     }*/

    // Separator Row
    var separatorRow = new p.vSpace(5, { borderTop: true });
    p.add(separatorRow);

    var invoiceRow = new p.box({ padding: 5 });
    p.add(invoiceRow);

    var invoiceNumberCol = new p.col({ hAlign: 'l' });
    //invoiceNumberCol.add(new p.text('INVOICE ','invoice')).add(new p.text('#'+invoice.id,'invoice#'));
    invoiceNumberCol.add(new p.text('REFERENCE ', 'invoice')).add(new p.text('#' + po.number, 'invoice#'));


    var deliveryOrder = new p.row({ hAlign: 'r' });
    deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text(formatDate(po.created_at), 'bold')).add(new p.text('Created at: ', 'norm')));
    deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text(po.created_by, 'bold')).add(new p.text('Created by: ', 'norm')));
    deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text($filter('titleCase')(po.payment_state), 'bold')).add(new p.text('Payment State: ', 'norm')));
    deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text($filter('titleCase')(po.payment_method), 'bold')).add(new p.text('Payment Method: ', 'norm')));
    deliveryOrder.add(new p.col({ hAlign: 'r' }).add(new p.text(formatDate(po.payment_due_date), 'bold')).add(new p.text('Payment Due Date: ', 'norm')));
    invoiceRow.add(invoiceNumberCol).add(deliveryOrder);

    //Store Row
    var storeRow = new p.box({ padding: 5 });
    p.add(storeRow);

    var storeCol = new p.row({ hAlign: 'l' });
    storeCol.add(new p.text(currentStore.title, 'bold'))
      .add(new p.text(currentStore.address1, 'norm'))
      .add(new p.text(currentStore.address2, 'norm'))
      .add(new p.text(currentStore.phone, 'norm'));


    var showNA = function (value) {
      if (value) {
        return value;
      }
      return 'N/A';
    };

    var dueDateCol = new p.row({ hAlign: 'l' });
    dueDateCol
      .add(new p.text('EXPECT DELIVERY DATE', 'norm'))
      .add(new p.vSpace(2))
      .add(new p.text(formatSimpleDate(po.expect_delivery_date), 'norm'));


    var amountDueCol = new p.row({ hAlign: 'r' });

    if (otherInfo.supplier) {
      amountDueCol
        .add(new p.text(otherInfo.supplier.name, 'invoice#'))
        .add(new p.vSpace(2))
        .add(new p.text('Account Number: ' + showNA(otherInfo.supplier.account_number), 'bold'))
        .add(new p.text('Tel: ' + showNA(otherInfo.supplier.phone), 'bold'))
        .add(new p.text('Fax: ' + showNA(otherInfo.supplier.fax), 'bold'))
        .add(new p.text('Email: ' + showNA(otherInfo.supplier.email), 'bold'))
        .add(new p.text('Address: ' + showNA(otherInfo.supplier.address), 'bold'))
        .add(new p.text('Contact: ' + showNA(otherInfo.supplier.contact), 'bold'))
        .add(new p.text('Contact Phone: ' + showNA(otherInfo.supplier.contact_phone), 'bold'))
        .add(new p.text('Contact Email: ' + showNA(otherInfo.supplier.contact_email), 'bold'))
    }

    storeRow.add(storeCol).add(dueDateCol).add(amountDueCol);


    // Table Header Row
    var tableHeaderRow = new p.box({ padding: 5, borderTop: true, borderBottom: true });
    p.add(tableHeaderRow);

    tableHeaderRow
      .add(new p.row({ widthWeight: 4, hAlign: 'l' }).add(new p.text('DESCRIPTION', 'bold')))
      .add(new p.row({ widthWeight: 2, hAlign: 'r' }).add(new p.text('ORDERED', 'bold')))
      .add(new p.row({ widthWeight: 2, hAlign: 'r' }).add(new p.text('RECEIVED', 'bold')))
      .add(new p.row({ widthWeight: 2, hAlign: 'r' }).add(new p.text('COST($)', 'bold')))
      .add(new p.row({ widthWeight: 2, hAlign: 'r' }).add(new p.text('TOTAL COST($)', 'bold')))

    // Table
    p.add(new p.vSpace(10));

    for (var i = 0; i < po.purchase_items.length; i++) {
      var item = po.purchase_items[i];

      var itemRow = new p.box({ padding: 5 });
      p.add(itemRow);

      var firstCol = new p.row({ widthWeight: 4 });
      itemRow.add(firstCol)

      // firstCol.add(new p.text(item.name, 'bold'));
      let nameRow = new p.row({ widthWeight: 4, hAlign: 'l' })
      nameRow.add(new p.text(item.name, 'bold'));
      let gtidRow = new p.row({ widthWeight: 4, hAlign: 'l' })
      gtidRow.add(new p.text(`UPC/EAN: ${ available(item.gtid) }`, 'bold'));
      let barcodeRow = new p.row({ widthWeight: 4, hAlign: 'l' })
      barcodeRow.add(new p.text(`SKU/PLU: ${ available(item.listing_barcode)}`, 'bold'));
      let refcodeRow = new p.row({ widthWeight: 4, hAlign: 'l' })
      refcodeRow.add(new p.text(`Listing Reference Codes: ${ pick(item.listing_reference_codes, 'code')}`, 'bold'));
      firstCol.add(nameRow)
      if (item.gtid)firstCol.add(gtidRow)
      if (item.listing_barcode) firstCol.add(barcodeRow)
      if (Array.isArray(item.listing_reference_codes) && item.listing_reference_codes.length) firstCol.add(refcodeRow)
      itemRow.add(new p.row({ widthWeight: 2, hAlign: 'r' })
        .add(new p.text(item.qty_requested, 'bold')));


      var thirdCol = new p.row({ widthWeight: 2, hAlign: 'r' });
      itemRow.add(thirdCol);

      thirdCol.add(new p.text(item.qty_received, 'bold'))

      /*
       var fourthCol = new p.row({widthWeight:2,hAlign:'r'});
       itemRow.add(fourthCol);
       fourthCol.add(new p.text(formatCurrency(Number(item.retail_price)),'bold') )
       */
      thirdCol.add(new p.vSpace(5))
      //    fourthCol.add(new p.vSpace(5) )

      var fifthCol = new p.row({ widthWeight: 2, hAlign: 'r' });
      itemRow.add(fifthCol);
      fifthCol.add(new p.text(formatCurrency(Number(item.price)), 'bold'))

      var sixthCol = new p.row({ widthWeight: 2, hAlign: 'r' });
      itemRow.add(sixthCol);
      sixthCol.add(new p.text(formatCurrency(Number(item.price) * item.qty_requested), 'bold'))


      p.add(new p.vSpace(10));


    }
    p.add(new p.vSpace(10, { borderTop: true }));


    // Summary Row
    var summaryRow = new p.box({ padding: 5 });
    p.add(summaryRow);

    //summaryRow.add( new p.text(invoice.listing_line_items.length+' Unique Item(s)','bold',{widthWeight:3}) );

    var noteBox = new p.row({ widthWeight: 5 });
    summaryRow.add(noteBox);

    if (po.remarks) {
      noteBox.add(new p.text('Remarks: '))
      noteBox.add(new p.text(po.remarks));
    }


    var totalRow = new p.row({ hAlign: 'r', widthWeight: 3 });
    summaryRow.add(totalRow);


    var totalItemBox = new p.box();
    totalRow.add(totalItemBox);

    totalItemBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Total Items: ', 'norm')));
    totalItemBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(otherInfo.totalQuantity, 'bold')));

    var subtotalBox = new p.box();
    totalRow.add(subtotalBox);
    subtotalBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Subtotal: ', 'norm')));
    subtotalBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(formatCurrency(otherInfo.subtotal), 'bold')));

    var otherBox = new p.box();
    totalRow.add(otherBox);
    otherBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Others: ', 'norm')));
    otherBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(formatCurrency(otherInfo.others), 'bold')));


    // Total Row
    var totalBox = new p.box();
    totalRow.add(totalBox);
    totalBox.add(new p.row({ hAlign: 'l', widthWeight: 3 }).add(new p.text('Total: ', 'total')));
    totalBox.add(new p.row({ hAlign: 'r', widthWeight: 7 }).add(new p.text(formatCurrency(otherInfo.total), 'total')));


    p.layout();
    p.draw();

    p.report();
    doc.save(currentStore.title + '_Purchase_Order_Reference_' + po.number + '.pdf');
  };


  var exportInvoice = function (format, currentStore, invoice, lineItems, user_input) {
    exportPdf({ format: format, mode: 'invoice', currentStore: currentStore, invoice: invoice, lineItems: lineItems, user_input: user_input });
  };

  var exportDo = function (format, currentStore, invoice, delivery_orders, user_input) {
    exportPdf({ format: format, mode: 'd.o.', currentStore: currentStore, invoice: invoice, delivery_orders: delivery_orders, user_input: user_input });
  };

  var exportPo = function (format, currentStore, po, otherInfo) {
    exportPdf({ format: format, mode: 'p.o.', currentStore: currentStore, po: po, otherInfo: otherInfo });
  };

  var storeImageURL = 'assets/images/store_placeholder.png';


  var exportPdf = function (option) {

    if (!window.location.host.startsWith('localhost')) {
      storeImageURL = option.currentStore.logo_url;
    }
    else {
      storeImageURL = 'assets/images/store_placeholder.png';
    }

    getBase64FromImageUrl(storeImageURL).then(function (data) {
        if (option.mode === 'invoice') {
          exportInvoiceThen(data, option);
        }
        else if (option.mode === 'd.o.') {
          exportDoThen(data, option);
        }
        else if (option.mode === 'p.o.') {
          exportPoThen(data, option);
        }
      }
    );


  };

  return { exportDo: exportDo, exportInvoice: exportInvoice, exportPo: exportPo };

}

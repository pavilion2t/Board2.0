import { pick, available } from '../filter';

export function FormatterFactory($filter, $rootScope,DashboardFactory, currencymap) {
  'ngInject';
  var basicFormatter = function (row, cell, value, columnDef, dataContext) {
    if (value === null) {
      return 'N/A';
    } else {
      return value;
    }
  };

  var dollarFormatter = function (row, cell, value, columnDef, dataContext) {
    return $filter('myCurrency')(value);
  };

  var percentageFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? (Number(value) * 100).toFixed(2) + '%' : '0.00%';
  };

  var simpleDateFormatter = function (row, cell, value, columnDef, dataContext) {
	  return dateFormatter(row, cell, value, columnDef, dataContext, DashboardFactory.getCurrentSimpleDateFormat());

  };
  var fullDateFormatter = function (row, cell, value, columnDef, dataContext, format) {
	  return dateFormatter(row, cell, value, columnDef, dataContext, DashboardFactory.getCurrentDateFormat());
  };
  var dateFormatter = function (row, cell, value, columnDef, dataContext, format) {

	  if (!format){
		  format = DashboardFactory.getCurrentDateFormat();
	  }

	  if (!value) {
      return '';
    }

    var utcPos = value.indexOf('UTC');
    var store = DashboardFactory.getCurrentStore();
    var timezone = store.timezone;

    if (utcPos !== -1) {
      return moment(value).isValid()? moment(value).tz(timezone).format(format) : '';
    }
    // old format - cater for safari
    if (value.length === 24) {
      value = value.slice(0,-2) + ':' + value.slice(-2);
    }
    var dateString = moment(value).isValid()? moment(value).tz(timezone).format(format) : '';


    var gmtPos = dateString.indexOf('GMT');
    if (gmtPos !== -1) {
      dateString = dateString.slice(0, gmtPos).trim();
    }
    return dateString;
  };

  const listingInfoFormatter = function (value, dataContext) {
    let joinedRefCodes = '-';
    if (Array.isArray(dataContext.listing_reference_codes) && dataContext.listing_reference_codes.length) {
      joinedRefCodes = pick(dataContext.listing_reference_codes, 'code');
    }
    let name = '';
    if (dataContext.name) name = `<p> ${ dataContext.name } </p>`;

    return `<div class="_line-item">
              <img src="assets/images/inventory_placeholder.png">
              ${ name }
              <p> UPC/EAN: ${ available(dataContext.gtid || dataContext.upc || dataContext.upc_e || dataContext.upc_ean || dataContext.ean || dataContext.ean13) } </p>
              <p> SKU/PLU: ${ available(dataContext.listing_barcode || dataContext.barcode) } </p>
              <p> Product ID: ${ available(dataContext.product_id)} </p>
              <p> Listing Reference Codes: ${ available(joinedRefCodes) } </p>
            </div>
            `;
  };

  return {
    listingInfoFormatter,
    basicFormatter: basicFormatter,
    dollarFormatter: dollarFormatter,
    percentageFormatter: percentageFormatter,
    dateFormatter: dateFormatter,
    simpleDateFormatter: simpleDateFormatter,
    fullDateFormatter: fullDateFormatter
  };

}

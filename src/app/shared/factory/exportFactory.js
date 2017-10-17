var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var fromCharCode = String.fromCharCode;
var INVALID_CHARACTER_ERR = (function () {
	"use strict";
	// fabricate a suitable error object
	try {
		document.createElement('$');
	} catch (error) {
		return error;
	}
}());

//encoder
if (!window.btoa) {
	window.btoa = function (string) {
		"use strict";
		var a, b, b1, b2, b3, b4, c, i = 0, len = string.length, max = Math.max, result = '';

		while (i < len) {
			a = string.charCodeAt(i++) || 0;
			b = string.charCodeAt(i++) || 0;
			c = string.charCodeAt(i++) || 0;

			if (max(a, b, c) > 0xFF) {
				throw INVALID_CHARACTER_ERR;
			}

			b1 = (a >> 2) & 0x3F;
			b2 = ((a & 0x3) << 4) | ((b >> 4) & 0xF);
			b3 = ((b & 0xF) << 2) | ((c >> 6) & 0x3);
			b4 = c & 0x3F;

			if (!b) {
				b3 = b4 = 64;
			} else if (!c) {
				b4 = 64;
			}
			result += characters.charAt(b1) + characters.charAt(b2) + characters.charAt(b3) + characters.charAt(b4);
		}
		return result;
	};
}

//decoder
if (!window.atob) {
	window.atob = function(string) {
		"use strict";
		string = string.replace(new RegExp("=+$"), '');
		var a, b, b1, b2, b3, b4, c, i = 0, len = string.length, chars = [];

		if (len % 4 === 1) {
			throw INVALID_CHARACTER_ERR;
		}

		while (i < len) {
			b1 = characters.indexOf(string.charAt(i++));
			b2 = characters.indexOf(string.charAt(i++));
			b3 = characters.indexOf(string.charAt(i++));
			b4 = characters.indexOf(string.charAt(i++));

			a = ((b1 & 0x3F) << 2) | ((b2 >> 4) & 0x3);
			b = ((b2 & 0xF) << 4) | ((b3 >> 2) & 0xF);
			c = ((b3 & 0x3) << 6) | (b4 & 0x3F);

			chars.push(fromCharCode(a));
			chars.push(fromCharCode(b));
			chars.push(fromCharCode(c));
		}
		return chars.join('');
	};
}

export function ExportFactory(currencymap, $q, $rootScope, $http, $filter, $locale, uiGridConstants) {
  'ngInject';
	var uri = {excel: 'data:application/vnd.ms-excel;base64,', csv: 'data:application/csv;base64,'};
	var template = {excel: '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'};
	var csvDelimiter = ",";
	var csvNewLine = "\r\n";
	var base64 = function(s) {
		return window.btoa(window.unescape(encodeURIComponent(s)));
	};

	var multiTableExcel = function(tables, wsnames, wbname, appname) {
		var ctx = "";
		var workbookXML = "";
		var worksheetsXML = "";
		var rowsXML = "";

		for (var i = 0; i < tables.length; i++) {
			if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
			for (var j = 0; j < tables[i].rows.length; j++) {
				rowsXML += '<Row>'
					for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
						var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
						var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
						var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
						dataValue = (dataValue)?dataValue:tables[i].rows[j].cells[k].innerHTML;
						var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
						dataFormula = (dataFormula)?dataFormula:(appname=='Calc' && dataType=='DateTime')?dataValue:null;
						ctx = {  attributeStyleID: (dataStyle=='Currency' || dataStyle=='Date')?' ss:StyleID="'+dataStyle+'"':'',
							nameType: (dataType=='Number' || dataType=='DateTime' || dataType=='Boolean' || dataType=='Error')?dataType:'String',
							data: (dataFormula)?'':dataValue,
							attributeFormula: (dataFormula)?' ss:Formula="'+dataFormula+'"':''
						};
						rowsXML += format(tmplCellXML, ctx);
					}
				rowsXML += '</Row>'
			}
			var sheetname = null;
			if ( wsnames && wsnames[i] ){
				sheetname = (i+1)+'.'+wsnames[i];
				if ( sheetname.length >= 30 ){
					sheetname = sheetname.substring(0,30);
				}
			}
			ctx = {rows: rowsXML, nameWS: sheetname || 'Sheet' + i};
			worksheetsXML += format(tmplWorksheetXML, ctx);
			rowsXML = "";
		}

		ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
		workbookXML = format(tmplWorkbookXML, ctx);
		if ( wbname && wbname.indexOf('.xls') === -1){
			wbname = wbname + '.xls';
		}
		var link = document.createElement("A");
		var blob = new Blob([workbookXML], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
		link.href = url;
		link.download = wbname || 'Workbook.xls';
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	var format = function(s, c) {
		return s.replace(new RegExp("{(\\w+)}", "g"), function(m, p) {
			return c[p];
		});
	};

    var uriExcel = 'data:application/vnd.ms-excel;base64,',
    tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'+
          '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'+
          '<Styles>'+
          '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'+
          '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'+
          '</Styles>' +
          '{worksheets}</Workbook>',
          tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>',
          tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>';

	var get = function(element) {
		if (!element.nodeType) {
			return document.getElementById(element);
		}
		return element;
	};

	var fixCSVField = function(value) {
		var fixedValue = value;
		var addQuotes = (value.indexOf(csvDelimiter) !== -1) || (value.indexOf('\r') !== -1) || (value.indexOf('\n') !== -1);
		var replaceDoubleQuotes = (value.indexOf('"') !== -1);

		if (replaceDoubleQuotes) {
			fixedValue = fixedValue.replace(/"/g, '""');
		}
		if (addQuotes || replaceDoubleQuotes) {
			fixedValue = '"' + fixedValue + '"';
		}
		return fixedValue;
	};

	var getFieldVar = function(entry, fieldName){
    if ( !entry ){
      return null;
    }
		if ( fieldName && typeof fieldName === 'string' ){
			var index = fieldName.indexOf('.');
			if( index !== -1 ) {
				var fieldParent = fieldName.substring(0,index);
				var fieldChild = fieldName.substring(index+1);
				if ( entry[fieldParent] ) {
					return getFieldVar(entry[fieldParent], fieldChild);
				}
				else {
					return getFieldVar(entry[fieldName]);
				}
			}
			else {
				return entry[fieldName];
			}
		}
		else{
			return null;
		}
	};

	var tableToCSV = function(table) {
		var data = "";
		var i, j, row, col;
		for (i = 0; i < table.rows.length; i++) {
			row = table.rows[i];
			for (j = 0; j < row.cells.length; j++) {
				col = row.cells[j];
				data = data + (j ? csvDelimiter : '') + fixCSVField(col.textContent.trim());
			}
			data = data + csvNewLine;
		}
		return data;
	};

	var getCurrentTime = function() {
	    var time = new Date();
	    var yyyy = time.getFullYear().toString();
	    var mm = (time.getMonth() + 1).toString(); // getMonth() is zero-based
	    var dd  = time.getDate().toString();
	    var hr = time.getHours().toString();
	    var mn = time.getMinutes().toString();
	    var sc = time.getSeconds().toString();
	    return yyyy + '-' +
	      (mm[1] ? mm : '0' + mm[0])
	      + (dd[1] ? dd : '0' + dd[0]) + '-'
	      + (hr[1] ? hr : '0' + hr[0])
	      + (mn[1] ? mn : '0' + mn[0])
	      + (sc[1] ? sc : '0' + sc[0]);
	  };

	var functions = {
	};

	functions.makeTable = function(data,raw) {

		var preheader = '';
		if ( data.header ){
			preheader = _.map(data.header,function(row){
				return '<tr><td>'+row+'</td></tr>';
			}).join('');
			preheader += '<tr><td></td></tr>';
		}


		var headers = _.map(data.col,function(col){
			return '<th>'+col+'</th>';
		});
		var headerrow = '<tr>'+headers.join('')+'</tr>';
		var rows = _.map(data.row,function(row){
			var item = _.map(row,function(data){
				return '<td>'+data+'</td>';
			});
			return '<tr>'+item.join('')+'</tr>';
		});
		var datarows = rows.join('');
		var table = '<tbody>'+preheader+headerrow+datarows+'</tbody>';
		if ( raw ){
			return '<table id="printPDFTable">'+table+'</table>';
		}
		var tablediv = document.createElement('table');
		tablediv.innerHTML = table;
		return tablediv;
	}

	functions.excel = function(anchor, table, name) {
		table = get(table);
		var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML};
		var hrefvalue = uri.excel + base64(format(template.excel, ctx));
		anchor.href = hrefvalue;
		return true;
	};
	functions.csv = function(anchor, table, delimiter, newLine) {
		if (delimiter !== undefined && delimiter) {
			csvDelimiter = delimiter;
		}
		if (newLine !== undefined && newLine) {
			csvNewLine = newLine;
		}
		table = get(table);
		var csvData = tableToCSV(table);
		var hrefvalue = uri.csv + base64(csvData);
		anchor.href = hrefvalue;
		return true;
	};

	functions.screen = function(dom,fileName){

		// Setting Parameters for JS PDF
		var doc = new jsPDF('p', 'pt','a4');

		var options = {
				theme: 'grid',
				styles: {
					overflow: 'linebreak',
					font: 'times'
				},
				columnWidth: 'wrap',
				columnStyles: {
					id: {fillColor: 255}
				},
				margin: {top: 60}
		};

		var specialElementHandlers = {
				'.pdfIgnore': function(element, renderer){
					return true;
				}
		};
		doc.fromHTML($(dom)[0], 15, 15, {
			'width': 170,
			'elementHandlers': specialElementHandlers
		});
		doc.save(fileName);
	};

	var constructGrid = function(columns, entries, gridDef, type, settings) {
		console.log(columns,entries);
		var col = _.map(columns, function(column) {
			column.count = 0;
			column.max = -Infinity;
			column.min = Infinity;
			column.sum = 0;
			return column.displayName;
		});
		var row = [];

		_.each(entries, function(entry,i) {
			var i = 0;
			var s = _.map(entry, function(v) {

				var column = columns[i];
				i++;

				var data = v.value;

				// do not show undefined / null
				if(data === undefined || data === null) {
					data = '';
					return data;
				}

				if(typeof data !== 'string') {
					data = JSON.stringify(data);
				}

				column.count ++;
				if ( !isNaN(data) ){
					var number = parseFloat(data);
					column.sum += number;
					column.max = column.max > number ? column.max : number;
					column.min = column.min < number ? column.min : number;
				}
				var gridInfo = gridDef[column.name];
				// Formatting the value

        if( gridInfo.pdfFormatter ){
					if ( gridInfo.pdfFormatter !== 'raw' ){
						data = gridInfo.pdfFormatter(0, 0, data, gridInfo, null);
					}
				}
				else if(gridInfo.formatter){
					data = gridInfo.formatter(0,0,data,gridInfo,null);
				}
				if ( gridInfo.cellFilter ){

          var filter = gridInfo.cellFilter;
          if ( !settings.showCurrency && filter === 'myCurrency' ){
            filter = 'myCurrencyNoSymbol';
          }
          data = constructFilter(filter, data);
				}



				return data;

			});
			row.push(s);
		});

		// Footer
		var footerEnabled = false;
		var footer = _.map(columns, function(column) {

			var gridInfo = column.gridInfo;

			var value = 0;
			var title = '';
			if ( gridInfo.aggregationType === uiGridConstants.aggregationTypes.sum ){
				value = column.sum;
				title = 'Total: ';
				footerEnabled = true;
			}
			else if ( gridInfo.aggregationType === uiGridConstants.aggregationTypes.count ){
				value = column.count;
				title = 'Count: ';
				footerEnabled = true;
			}
			else if ( gridInfo.aggregationType === uiGridConstants.aggregationTypes.avg ){
				value = column.sum / column.count;
				title = 'Avg: ';
				footerEnabled = true;
			}
			else if ( gridInfo.aggregationType === uiGridConstants.aggregationTypes.min ){
				value = column.min;
				title = 'Min: ';
				footerEnabled = true;
			}
			else if ( gridInfo.aggregationType === uiGridConstants.aggregationTypes.max ){
				value = column.max;
				title = 'Max: ';
				footerEnabled = true;
			}
      else if (_.isFunction(gridInfo.aggregationType)) {
        value = gridInfo.aggregationType(columns, column);
        title = '';
        footerEnabled = true;
      }
			else {
				title = '';
				value = '';
			}


			if ( gridInfo.footerCellFilter ){

        var filter = gridInfo.footerCellFilter;
        if ( !settings.showCurrency  && filter === 'myCurrency' ){
          filter = 'myCurrencyNoSymbol';
        }
        value = constructFilter(filter, value);
			}

			return title+value;
		});
		if ( footerEnabled ) {
			row.push(footer);
		}


		return {col:col,row:row};
	};

  var constructFilter = function(filter, value){
    var split = filter.split(':');
    if ( split.length >= 1 ){
      var firstArgument = split.shift();
      var arr = [value];
      value = $filter(firstArgument).apply(this, arr.concat(split));
    }
    return value;
  }

	var constructTable = function(columns, entries, type, settings) {

		var columns = $.extend(true, {}, columns);

		var col = _.map(columns, function(column) {
			column.count = 0;
			column.max = -Infinity;
			column.min = Infinity;
			column.sum = 0;
			var name = '';
			if ( column.displayName ) {
				name = column.displayName;
			}
			else if ( column.name ) {
				name = $filter('titleCase')(column.name);
			}
			else {
				name = $filter('titleCase')(column.field);
			}
			return name;
		});

		var row = [];

		// Loop Thru Rows
		_.each(entries, function(entry,i) {
			var s = _.map(columns, function(column) {

				var value = getFieldVar(entry, column.field);
				var data = column.exportFormatter ? column.exportFormatter(value, entry) : value;



				// do not show undefined / null
				if(data === undefined || data === null) {
          if( column.formatter ){
            data = column.formatter(0,0,data,column,entry);
            if ( data ){
              return data;
            }
          }
          else {
            data = '';
            return data;
          }
				}

				if(typeof data !== 'string') {
					data = JSON.stringify(data);
				}

				column.count ++;
				if ( !isNaN(data) ){
					var number = parseFloat(data);
					column.sum += number;
					column.max = column.max > number ? column.max : number;
					column.min = column.min < number ? column.min : number;
				}


        // Currency Overrides
        if ( !settings.showCurrency  && column._filter === 'myCurrency' ){
          data = $filter('myCurrencyNoSymbol')(data);
        }
        // Formatting the value
        else if( column.pdfFormatter ){
          if ( column.pdfFormatter !== 'raw' ){
            data = column.pdfFormatter(0, 0, data, column, entry);
          }
        }
        else if(column.formatter){
          data = column.formatter(0,0,data,column,entry);
        }


        if ( column.cellFilter ){

          var filter = column.cellFilter;
          if ( !settings.showCurrency  && filter === 'myCurrency' ){
            filter = 'myCurrencyNoSymbol';
          }
          data = constructFilter(filter, data);
        }


				return data;

			});
			row.push(s);
		});


		// Footer
		var footerEnabled = false;
		var footer = _.map(columns, function(column) {
			var value = 0;
			var title = '';
			if ( column.aggregationType === uiGridConstants.aggregationTypes.sum ){
				value = column.sum;
				title = 'Total: ';
				footerEnabled = true;
			}
			else if ( column.aggregationType === uiGridConstants.aggregationTypes.count ){
				value = column.count;
				title = 'Count: ';
				footerEnabled = true;
			}
			else if ( column.aggregationType === uiGridConstants.aggregationTypes.avg ){
				value = column.sum / column.count;
				title = 'Avg: ';
				footerEnabled = true;
			}
			else if ( column.aggregationType === uiGridConstants.aggregationTypes.min ){
				value = column.min;
				title = 'Min: ';
				footerEnabled = true;
			}
			else if ( column.aggregationType === uiGridConstants.aggregationTypes.max ){
				value = column.max;
				title = 'Max: ';
				footerEnabled = true;
			}
			else {
				title = '';
				value = '';
			}

			if ( column.footerCellFilter ){
        var filter = column.footerCellFilter;
        if ( !settings.showCurrency && filter === 'myCurrency' ){
          filter = 'myCurrencyNoSymbol';
        }
        value = constructFilter(filter, value);
			}

			return title+value;
		});
		if ( footerEnabled ) {
			row.push(footer);
		}

		return {col:col,row:row};
	};

	functions.exportTable = function(mode, columns, entries, header, fileName){
		functions.exportTables( mode, [{columns:columns, entries:entries}], header, {}, fileName);
	};

	functions.exportTables = function(mode, tables, header, settings, fileName){
		if ( mode === 'xls' ){
			functions.exportExcelTables(tables, header, settings, fileName);
		}
		else if ( mode === 'pdf'){
			functions.exportPdfTables(tables, header, settings, fileName);
		}
		else if ( mode === 'csv'){
			functions.exportCsvTables(tables, header, settings, fileName);
		}
	};

	functions.exportExcelTables = function(tables, header, settings, fileName) {
		var title = '';
		var mode = settings.mode?settings.mode:'table';
		if ( $rootScope.title ){
			title =  $rootScope.title;
		}
		fileName = fileName || $rootScope.currentStores[0].title + '__'
		+ title.slice(1) + '__'
		+ getCurrentTime();

		fileName = fileName + '.xls';

		var tabledivs =  _.map(tables,function(table){
			var data;
			if ( mode === 'table'){
				data = constructTable(table.columns, table.entries, 'xls', settings);
			}
			else {
				data = constructGrid(table.columns, table.entries, settings.gridDef, 'xls', settings);
			}
			data.header = [];
			if ( header ){
				data.header = data.header.concat(header);
			}
			if ( table.tableName ){
				data.header.push(table.tableName);
			}
			return functions.makeTable(data);
		});
		var titles = _.map(tables,function(table){
			if ( table.tableName ){
				return table.tableName;
			}
		})
		multiTableExcel(tabledivs,titles,fileName,'Excel');
	};

	functions.exportExcel = function(columns, entries, header, fileName) {

		functions.exportExcelTables([{columns:columns, entries:entries}], header, {}, fileName);
	};

	functions.exportCsvTables = function(tables, header, settings, fileName) {
		var mode = settings.mode?settings.mode:'table';
		var rows = [];
		var headerrows = '"'+ header.join('"\n"')+'"';


		rows.push(headerrows);

		var tablecsv = '';
		function joinrow(row){
			tablecsv+='"'+row.join('","')+'"\n';
		}

		for ( var i = 0; i < tables.length; i ++  ){
			var table = tables[i];
			tablecsv = '';

			var data;
			if ( mode === 'table'){
				data = constructTable(table.columns, table.entries, 'csv', settings);
			}
			else {
				data = constructGrid(table.columns, table.entries, settings.gridDef, 'csv', settings);
			}
			if ( table.tableName ){
				tablecsv += '"'+table.tableName +'"\n';
	    	}

			tablecsv +='"'+data.col.join('","') + '"\n';
			_.each(data.row,joinrow);

			rows.push(tablecsv);
		}


		var csv = rows.join('\n');

		var title = '';
		if ( $rootScope.title ){
			title =  $rootScope.title;
		}

		fileName = fileName || $rootScope.currentStores[0].title + '__'
		+ title + '__'
		+ getCurrentTime();


    fileName = fileName + '.csv';

		// save csv file
		var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
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
	};

	functions.exportCsv = function(columns, entries, header, fileName) {

		functions.exportCsvTables([{columns:columns, entries:entries}], header, {}, fileName);
	};

	functions.exportPdfTables = function(tables, header, settings, fileName){

		var mode = settings.mode?settings.mode:'table';


		var layout = settings.layout?settings.layout:'l';
		var doc = new jsPDF(layout, 'pt','legal');
	    doc.setFontSize(10);


	    var topMargin = header.length * 10 + 20;
	    var options = {
				theme: 'grid',
				styles: {
					overflow: 'linebreak',
					fontSize:8
				},
				columnWidth: 'wrap',
				columnStyles: {
					id: {fillColor: 255}
				},
				bodyStyles: {
		            fontSize:8
		        },
				headerStyles: {
		            fillColor: [255, 120, 0],
		            fontSize: 10,
		            rowHeight: 22
		        }
		};

	    var currentY = topMargin;

	    doc.setFontSize (8);
		for ( var i = 0; i < header.length; i ++ ){
			doc.text(header[i], 30, 20 + i * 10 );
		}


	    for ( var i = 0; i < tables.length; i ++ ){
	    	var table = tables[i];
	    	var data;
			if ( mode === 'table'){
				data = constructTable(table.columns, table.entries, 'pdf', settings);
			}
			else {
				data = constructGrid(table.columns, table.entries, settings.gridDef, 'pdf', settings);
			}

	    	if ( table.tableName ){
	    		options.startY = currentY + 30;
	    		doc.text(table.tableName, 30, currentY + 25);
	    	}
	    	else {
	    		options.startY = currentY + 10;
	    	}

	    	doc.autoTable( data.col, data.row, options );
		    currentY = doc.autoTableEndPosY();

	    }

	    var title = '';
		if ( $rootScope.title ){
			title =  $rootScope.title;
		}

		fileName = fileName || $rootScope.currentStores[0].title + '__'
		+ title.slice(1) + '__'
		+ getCurrentTime()
		+ '.pdf';

		doc.save(fileName);


	};

	functions.exportPdf = function(columns, entries, header, fileName ){

		functions.exportPdfTables([{columns:columns, entries:entries}], header, {}, fileName);
	};



	return functions;
}

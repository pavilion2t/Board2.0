/**
 * This is a factory for creating column definition for ui-grid. By providing just field name and display name, it will
 * generate a field with the options to do grouping or aggregation easily.
 *
 * It will also handle the export PDF, excel and CSV
 */
export function columnDefsFactory(uiGridGroupingConstants, uiGridConstants, uiGridTreeBaseConstants, $filter, reportsFactory) {
	'ngInject';
	var factory = {};

	// Sum without Unlimited
	var sumFn = function (aggregation, fieldValue, numValue){

		if (!aggregation.stats){
			aggregation.stats = { sum: 0 };
		}
		if (numValue !== Infinity && !isNaN(numValue)){
			aggregation.stats.sum += numValue;
		}
	};

	var sumAgg = function (aggregation) {
		aggregation.rendered = 'Total: ' + $filter('quantity')(aggregation.stats.sum);
	};


	var sumWithoutUnlimited = function (visibleRows, grid){
		var sum = _.reduce(visibleRows, function (sum,obj){
			var quantity = obj.entity.quantity;
			if (quantity !== Infinity && !isNaN(quantity)){
				return sum + parseFloat(quantity);
			}
			return sum;
		},0);
		return sum;
	};

  const escapeKey = (key) => key == null ? '' : key.replace(/[\.\[\]]/g, '');

	factory.getCellTemplate = function (filter){

		var template = '<div ng-if="!row.groupHeader" class="ui-grid-cell-contents" title="{{COL_FIELD}}">{{COL_FIELD';

		if (filter){
			template= template +'|'+filter;
		}
		template = template +'}}</div>'+ '<div ng-if="row.groupHeader" class="ui-grid-cell-contents" title="{{COL_FIELD}}">{{COL_FIELD}}</div>';
		return template;
	};

	factory.getPdfFormatter = function (filter){

		var filterParams = null;
		var filterName = null;

		if (filter){
			filterParams = filter.split(':');
			filterName = filterParams.splice(0, 1);
		}

		var sumPdfFormatterLite = function (row, column, value, columnDef, dataContext) {
			if (!isNaN(value)){
				if (filter === null){
					return value;
				}
				else {
					if (!columnDef._showCurrency && columnDef._filter === 'myCurrencyReport'){
						return value;
					}
					var newParam = filterParams.slice(0);
					newParam.unshift(value);
					return $filter(filterName).apply(null,newParam);
				}
			}
			else {
				return value;
			}
		};
		return sumPdfFormatterLite;
	};

	factory.getAgg = function (filter){

		var filterParams = null;
		var filterName = null;

		if (filter){
			filterParams = filter.split(':');
			filterName = filterParams.splice(0, 1);
		}


		var sumAgg = function (aggregation) {
			aggregation.rendered = 'Total: ';



			if (filter){
				var newParam = filterParams.slice(0);
				newParam.unshift(aggregation.value);
				aggregation.rendered = aggregation.rendered + $filter(filterName).apply(null,newParam);
			}
			else {
				aggregation.rendered = aggregation.rendered + aggregation.value;
			}
		};
		return sumAgg;
	};

	factory.getAggFn = function (){
		// Sum without Unlimited
		var sumFn = function (aggregation, fieldValue, numValue){

			if (!aggregation.stats){
				aggregation.stats = { sum: 0 };
			}
			if (numValue !== Infinity && !isNaN(numValue)){
				aggregation.stats.sum += numValue;
			}
		};
		return sumFn;
	};

	factory.getFilter = function (row){

		var filter = null;

		if (row.type === 'datetime'){
			filter = 'moment';
		}
		else if (row.type === 'date'){
			filter = 'momentDate';
		}
		else if (row.type === 'currency'){
			filter = 'myCurrencyReport';
		}

		// Disable Currency as it creates problem

		if (row.currency){
			//filter = 'myCurrency:'+row.currency+':2';
			filter = 'myCurrencyReport';
		}


		if (row.decimal){
			filter = 'number:'+ row.decimal;
		}

		if (row.is_percentage){
			filter = 'percentage';
		}

		return filter;
	};
	factory.getColumnDefs = function (fieldName, displayName, filter, grouping, aggregate, type){


		var fields = {
				field: fieldName,
				width: '200'
		};

		// Make order number always wider
		if (fieldName === 'order_number' || fieldName === 'number'){
			fields.width = '300';
		}

		if (grouping){
			fields.enableGrouping = true;
			fields.groupingShowGroupingMenu = true;
			fields.groupingShowAggregationMenu = false;
		}
		else {
			fields.enableGrouping = false;
			fields.groupingShowGroupingMenu = false;
			fields.groupingShowAggregationMenu = false;
		}


    if (aggregate) {
      if (aggregate === 'uniq') {
        fields.customTreeAggregationFinalizerFn = function (aggregation) {
          aggregation.value = '';
          if (angular.isUndefined(aggregation.rendered)) {
            aggregation.rendered = aggregation.value;
          }
        };
        fields.treeAggregationType = uiGridGroupingConstants.aggregation.COUNT;
        fields.aggregationType = function (rows, column) {
          if (rows.length) {
            let entity = _.first(rows);
            entity = _.get(entity, 'gridInfo', entity);
            rows = _.get(entity, 'grid.rows', []);
          }
          fieldName = column.field || fieldName;
          let values = rows.map(r => _.get(r, `entity.${fieldName}`));
          values = Array.from(new Set(values));
          return `Total: ${values.length || 0} ${column.displayName}`;
        };
      } else if (aggregate === 'sum') {
        fields.customTreeAggregationFinalizerFn = function (aggregation){
          if (_.isNumber(aggregation.value)) {
            aggregation.value = Math.round(aggregation.value * 100) / 100;
            aggregation.rendered = `Total: ${aggregation.value}`;
          }
        };
        fields.treeAggregationType = uiGridGroupingConstants.aggregation.SUM;
        fields.aggregationType = function (rows, column) {
          if (rows.length) {
            let entity = _.first(rows);
            entity = _.get(entity, 'gridInfo', entity);
            rows = _.get(entity, 'grid.rows', []);
          }
          fieldName = column.field || fieldName;
          let values = rows.map(r => (r.entity||{})[fieldName], 0);
          let total = _.reduce(values, (acc, val) => acc + val, 0);
          total = Math.round(total * 100) / 100;
          return `Total: ${total}`;
        };
      } else {
        fields.customTreeAggregationFinalizerFn = factory.getAgg (filter);
        fields.treeAggregationType = uiGridGroupingConstants.aggregation.SUM;
        fields.aggregationType = uiGridConstants.aggregationTypes.sum;
      }
		}

		if (_.isString(aggregate)) filter = null;
		if (filter){
			fields._filter = filter;
			fields.cellTemplate = factory.getCellTemplate(filter);
			fields.pdfFormatter = factory.getPdfFormatter (filter);
			fields.footerCellFilter = filter;
		}


    fields.headerCellFilter = "translate";
		if (displayName){
			fields.displayName = displayName;
		}

		if (type){
			fields.type = type;
		}

		return fields;
	};


	/**
	 * A standard field without aggregation
	 */
	factory.standardField = function (fieldName, displayName){
		return factory.getColumnDefs(fieldName, displayName, null, false, false);
	};


	/**
	 * A standard field with grouping ability
	 */
	factory.standardGroupField = function (fieldName, displayName){
		return factory.getColumnDefs(fieldName, displayName, null, true, false);
	};

	/**
	 * A standard field with sum aggregation ability
	 */
	factory.standardAggregateField = function (fieldName, displayName){
		return factory.getColumnDefs(fieldName, displayName, null, false, true);
	};

	/**
	 * A Number field without aggregation
	 */
	factory.numberField = function (fieldName, displayName){
		return factory.getColumnDefs(fieldName, displayName, null, false, false, 'number');
	};


	/**
	 * A Number field with grouping ability
	 */
	factory.numberGroupField = function (fieldName, displayName){
		return factory.getColumnDefs(fieldName, displayName, null, true, false, 'number');
	};

	/**
	 * A Number field with sum aggregation ability
	 */
	factory.numberAggregateField = function (fieldName, displayName){
		return factory.getColumnDefs(fieldName, displayName, null, false, true, 'number');
	};


	/**
	 * A standard field (quality) without adding unlimited, sum aggregation ability
	 */
	factory.standardNoUnlimitedAggregateField = function (fieldName, displayName){
		var fields = {
				field: fieldName,
				width: '200',
				type: 'number',
				customTreeAggregationFn: sumFn,
				customTreeAggregationFinalizerFn: sumAgg,
				cellTemplate:factory.getCellTemplate('quantity'),
				footerCellFilter: 'quantity',
				pdfFormatter:factory.getPdfFormatter('quantity'),


				groupingShowGroupingMenu: false,
				groupingShowAggregationMenu: false,
				aggregationType: sumWithoutUnlimited
		};
		if (displayName){
			fields.displayName = displayName;
		}
		return fields;
	};

	/**
	 * Time duration aggregation
	 */
	factory.timeDurationAggregateField = function (fieldName, displayName){

		return factory.getColumnDefs(fieldName, displayName, 'timeDurationHour', false, true);

	};

	/**
	 * Date time field without aggregation
	 */
	factory.datetimeField = function (fieldName, displayName){

		return factory.getColumnDefs(fieldName, displayName, 'moment', false, false);
	};

	/**
	 * Date field without aggregation
	 */
	factory.dateField = function (fieldName, displayName){

		return factory.getColumnDefs(fieldName, displayName, 'momentDate', false, false);

	};

	/**
	 * Date field without aggregation
	 */
	factory.timeField = function (fieldName, displayName){

		return factory.getColumnDefs(fieldName, displayName, 'momentTime', false, false);

	};

	/**
	 * Currency Field without aggregation.
	 */
	factory.currencyField = function (fieldName, displayName){

		return factory.getColumnDefs(fieldName, displayName, 'myCurrencyReport', false, false, 'number');
	};

	/**
	 * Currency field with aggregation
	 */
	factory.currencyAggregateField = function (fieldName, displayName){

		return factory.getColumnDefs(fieldName, displayName, 'myCurrencyReport', false, true, 'number');
	};

	/**
	 * Percentage field without aggregation
	 */
	factory.percentageField = function (fieldName, displayName){

		return factory.getColumnDefs(fieldName, displayName, 'percentage', false, false, 'number');
	};

  /**
   * A standard field of iterable object without aggregation
   */
  factory.standardIterableField = function (fieldName, displayName, accessor) {
    var fields = {
      field: fieldName,
      width: '200',
      cellTemplate: factory.getCellTemplate(accessor),
      pdfFormatter: factory.getPdfFormatter(accessor),
    };
    if (displayName) {
      fields.displayName = displayName;
    }
  };


	factory.flattenData = function (entries, field, schema){
		for (var i = 0; i < entries.length; i ++){
			var row = entries[i];
			var paymentTender = row[field];
			for (var k in paymentTender){
				const item = paymentTender[k];
        const targetSchema = (schema||[]).find(s => s.key === field) || {};
        const headers = targetSchema.headers || [];
        const representAsValue = headers.indexOf(k) >= 0;
        const representAsIndex = headers[k] != null;
        const escKey = representAsValue ? escapeKey(k) : representAsIndex ? escapeKey(headers[k]) : escapeKey(k);
        const fieldParam = `${field}-${escKey}`;
				row[fieldParam] = item;
			}
		}
	};

	factory.getFlattenColumnHeader = function (schema, field, label, type){
		var schemaMap = {};
		var rows = [];
		for (var i = 0 ; i < schema.length; i++){
			var item = schema[i];
			schemaMap[item.key] = item;
		}
    if (schemaMap[field]) {
      for (var k = 0; k < schemaMap[field].headers.length; k++) {
        var header = schemaMap[field].headers[k];
        const fieldParam = `${field}-${escapeKey(header)}`;
        const labelParam = label ? `${label} - ${header}` : header;
        let row;
        if (type === 'currency') {
          row = factory.currencyAggregateField(fieldParam, labelParam);
        } else if (type === 'number') {
          row = factory.numberAggregateField(fieldParam, labelParam);
        }
        rows.push(row);
      }
    }
		return rows;
	};

  factory.translateColumnDefsDisplayName = function(columnDefs){
    return columnDefs.map(function(columnDef){
      columnDef.headerCellFilter = "translate"
      return columnDef;
    })
  }

	return factory;

}

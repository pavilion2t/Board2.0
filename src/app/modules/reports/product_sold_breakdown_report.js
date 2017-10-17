export class ProductSoldBreakdownReportController {
  constructor(suppliers, categories, brands, departments, $scope, reportsFactory, columnDefsFactory, $timeout, ExportFactory) {
      'ngInject';
      var columnDefs = [
        columnDefsFactory.standardGroupField("store"),
        columnDefsFactory.dateField("date","Date"),
        columnDefsFactory.timeField("date","Time"),
        columnDefsFactory.standardGroupField("order_number"),
        columnDefsFactory.standardGroupField("reference_number"),
        columnDefsFactory.standardGroupField("correspondence_state","Status"),
        columnDefsFactory.standardGroupField("product_name"),
        columnDefsFactory.standardGroupField("gtid","GTID"),
        columnDefsFactory.standardGroupField("listing_barcode","Secondary Barcode"),
        columnDefsFactory.standardGroupField("cashier.name","Cashier"),
        columnDefsFactory.standardGroupField("customer.name","Customer"),
        columnDefsFactory.standardGroupField("dept.name","Department"),
        columnDefsFactory.standardGroupField("top_parent_department.name", "Top Department"),
        columnDefsFactory.standardGroupField("brand.name","Brand"),
        columnDefsFactory.standardGroupField("category.name","Category"),
        columnDefsFactory.standardGroupField("supplier.name","Supplier"),

        columnDefsFactory.currencyField("price"),
        columnDefsFactory.numberAggregateField("qty"),
        columnDefsFactory.currencyAggregateField("discounts"),
        columnDefsFactory.currencyAggregateField("total"),
        columnDefsFactory.currencyAggregateField("total_collected"),

        columnDefsFactory.currencyAggregateField("tax"),
        columnDefsFactory.currencyField("cost"),
        columnDefsFactory.standardGroupField("sales_type"),
        columnDefsFactory.standardGroupField("note", "Remark"),
      ];

      $scope.gridOptions = {
        columnDefs: columnDefsFactory.translateColumnDefsDisplayName(columnDefs),
        data: [],
        showColumnFooter: true,
        enableGrouping: true,
        enableHorizontalScrollbar: true,
      };

      $scope.dateFrom = moment().subtract(0, 'day').format('YYYY-MM-DD');
      $scope.dateTo = moment().format('YYYY-MM-DD');

      function fetchData(myFilter, callback) {
          var tmpFilter = Object.assign({page: 1, per_page: 200}, $scope.filter, myFilter);
          var pagination;
          reportsFactory.analyticsApi('product_sales_breakdown_sheet', $scope.dateFrom,  $scope.dateTo, tmpFilter).success(function(data, status, headers) {
            if(headers('Link')) {
                pagination = JSON.parse(headers('Link'));
             }
            callback(data, pagination);
          });
      }

      function updateView(data, pagination) {
          $scope.pagingReady = false;
          var formatedData = formatData(data);
          if (pagination){
              $scope.pagination = pagination;
              $scope.pagingReady = true;
          }
          $scope.gridOptions.data = formatedData.data;
          $scope.gridOptions.columnDefs.concat(formatedData.columns);
      }

      $scope.update = function(filter) {
          fetchData(filter, updateView);
      }

      $scope.update();

      function formatData(res) {
          var customAttributeMap = {};
          var columns = [];
          var attrNaming = function( name ){
            var newname = 'attr_'+name;
            return newname;
          };
          var ret = _.map(res, function(item) {
            if ( item.attributes.length > 0 ){
              _.each( item.attributes, function(attr){
                var attrName = attrNaming(attr.custom_field_id);
                customAttributeMap[attrName] = {
                  field: attrName,
                  displayName: attr.custom_field_name,
                  width: 200,
                  enableGrouping: true,
                  groupingShowGroupingMenu: true
                };
                item[attrName] = attr.custom_field_value;
              });
            }
            return item;
          });

          for ( var key in customAttributeMap ){
            columns.push(customAttributeMap[key]);
          }
          return {data: ret, columns: columns};
      }

      $scope.showCurrency = reportsFactory.showCurrency;

      $scope.download = function(mode) {
        var tableData = [];
        var count = 0;
        var pagination;
        var header = reportsFactory.header($scope.dateFrom, $scope.dateTo);
        var tables = [];
        var tableList = {};

        var downloadOne = function(data, paginator) {
            count = count + 1;
            var formatedData = formatData(data);
            tableList[paginator.current_page-1] = formatedData.data;

            if (count === pagination.total_pages) {
                for (var i=0; i<pagination.total_pages; i++)
                    tableData = tableData.concat(tableList[i]);
                tables.push({entries: tableData, columns: columnDefs.concat(formatedData.columns), tableName:'Product Sold Breakdown Report' });
                ExportFactory.exportTables(mode, tables, header, {layout:'l', showCurrency: $scope.showCurrency.value},  null );
            }
        }

        fetchData({page: 1, per_page: 1000}, function(data, paginator) {
            pagination = paginator;
            downloadOne(data, pagination);
            for (var i= pagination.current_page; i<pagination.total_pages; i++) {
                fetchData({page: i+1, per_page: 1000}, downloadOne);
            }
        });
      };
    }
};

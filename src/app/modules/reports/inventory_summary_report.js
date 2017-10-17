export class InventorySummaryReportController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants, columnDefsFactory) {
		'ngInject';

		var sum = uiGridConstants.aggregationTypes.sum

		var columnDefs = [
		                  {field: "group_by.name", width: '12.5%', displayName: ''},
		                  {field: "quantity", width: '12.5%', type: 'number'},
		                  {field: "price", width: '12.5%' ,aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "total", width: '12.5%' , displayName: 'Total Retail', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "cost", width: '12.5%', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "unit_profit", width: '12.5%', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "total_profit", width: '12.5%', aggregationType: sum, cellFilter: 'myCurrencyReport', footerCellFilter: 'myCurrencyReport', type: 'number'},
		                  {field: "margin", width: '12.5%', type: 'number'},
		                  ];

		$scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
		$scope.dataRequest = reportsFactory.analyticsApi.bind(this, 'inventory_summary')
		$scope.dataCallback = function(res) {
			return _.map(res, function(item) {
				item.group_by = item.department || item.category || item.brand || item.supplier;
				item.quantity = item.quantity === 'Unlimited' ? Infinity : item.quantity;
				return item;
			});
		}

		$scope.filter = {
				group_by: 'group_by_department'
		}

		$scope.groupOptions = {
				'Department': 'group_by_department',
				'Category': 'group_by_category',
				'Supplier': 'group_by_supplier',
				'Brand': 'group_by_brand',
		};
	}
};

export class SalesByDepartmentReportController {
	constructor($scope, $rootScope, reportsFactory, columnDefsFactory) {
		'ngInject';

		var columnDisplayHeaderPrefixes = [ 'Top', '2nd', '3rd', '4th', '5th' ]

		$scope.gridOptions = {
				enableGrouping: true
		};
		$scope.dataRequest = reportsFactory.reportApi.bind(this, 'sales_by_department_report')
		$scope.dataCallback =  function(res, scope) {
			var maxDepth = 0;
			var columnDefs = [
				columnDefsFactory.currencyField("average_price", "Average Price"),
				columnDefsFactory.currencyField("average_cost", "Average Cost"),
				columnDefsFactory.standardField("discount_amount", "Discount"),
				columnDefsFactory.currencyAggregateField("amount_applied_discount", "Net Sales After Discount"),
				columnDefsFactory.numberAggregateField("quantity", "Quantity Sold"),
				columnDefsFactory.percentageField("quantity_percentage", "% Quantity"),
				columnDefsFactory.currencyAggregateField("amount", "Net Sales Before Disc & SVG"),
				columnDefsFactory.percentageField("amount_percentage", "% Amount"),
				columnDefsFactory.currencyField("cogs", "COGS"),
				columnDefsFactory.currencyAggregateField("profit", "Profit"),
				columnDefsFactory.percentageField("margin", "Margin"),
			];
			function getDepth(entry){
				var depth = 1;
				for (var depth = 1; depth < 10; depth++)
					if ('name'+depth in entry)
						return depth
				return 0
			}

			res.data.entries.forEach(function(entry){
				entry.discount_amount = '-$'+ entry.discount_amount
				var depth = getDepth(entry)
				if (maxDepth < depth){
					maxDepth = depth
				}
			})
			for (var i = maxDepth; i>0; i--){
				columnDefs.unshift(columnDefsFactory.standardField('name'+i, columnDisplayHeaderPrefixes[i-1]+'-tier Department'))
			}
			scope.columnDefs = columnDefsFactory.translateColumnDefsDisplayName(columnDefs)
			return res.data.entries
		}
	}

};

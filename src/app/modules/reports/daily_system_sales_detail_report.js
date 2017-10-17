export class DailySystemSalesDetailReportController {
	constructor(suppliers, categories, brands, departments, $scope, $rootScope, reportsFactory, uiGridConstants, DashboardFactory, $filter) {
		'ngInject';

		$scope.dateFrom = moment().subtract(0, 'day').format('YYYY-MM-DD');
		$scope.dateTo = moment().format('YYYY-MM-DD');

		$scope.applyFilter = function(input, filter) {
			if(!filter) {
				return input
			}
			return $filter(filter)(input);
		};

		var updateData = function() {
			$scope.gridMessage = "loading data...";


			reportsFactory.reportApi('sales_summary_report', $scope.dateFrom, $scope.dateTo).success(function(res) {
				$scope.dailySummaryReport = res.data;
				var data = res.data
				$scope.summaryReportA = [
				                         {
				                        	 title: 'Sales Summary',
				                        	 schema: [
				                        	          { key: 'name', name: ''},
				                        	          { key: 'value', name: 'Amount', filter: 'myCurrencyReport'},
				                        	          ],
				                        	          data: [
				                        	                 { name: 'Net Sales', value: data.net_sales.amount },
				                        	                 { name: '+ Service Charge', value: data.service_fee_in_total.amount },
				                        	                 { name: '+ Tax Collected', value: data.tax_total.amount },
				                        	                 { name: '= Total Revenue', value: data.net_receipt},
				                        	                 { name: 'Item Discount', value: null },
				                        	                 { name: '+ Subtotal Discount', value: null },
				                        	                 { name: 'Total Discounts', value: data.discount_applied.amount },
				                        	                 ]
				                         },
				                         {
				                        	 title: 'Checks Summary',
				                        	 schema: [
				                        	          { key: 'name', name: ''},
				                        	          { key: 'count', name: 'Count'},
				                        	          { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
				                        	          ],

				                        	          data: [
				                        	                 _.assign({}, { name: 'Carried Over' }),
				                        	                 _.assign(data.total_gross_sales, { name: '+ Checks Begun' }),
				                        	                 _.assign(data.completed_paid_count, { name: '- Checks Paid' }),
				                        	                 _.assign(data.total_receivable_count, { name: '= Outstanding' }),
				                        	                 ]
				                         },
				                         {
				                        	 title: 'Checks',
				                        	 schema: [
				                        	          { key: 'name', name: 'Order Type'},
				                        	          { key: 'count', name: 'Count'},
				                        	          { key: 'percentage', name: '% of total', filter: 'percentage'},
				                        	          { key: 'avg', name: ' Avg/Check', filter: 'myCurrencyReport'},
				                        	          ],
				                        	          data: [
				                        	                 { name: 'Dining',
				                        	                	 count: data.dine_in_count,
				                        	                	 percentage: data.dine_in_count_percentage,
				                        	                	 avg: data.dine_in_average_net_sales },
				                        	                	 { name: 'Retail',
				                        	                		 count: data.retail_count,
				                        	                		 percentage: data.retail_count_percentage,
				                        	                		 avg: data.retail_average_net_sales },
				                        	                		 { name: 'Total', count: data.total_gross_sales.count },
				                        	                		 ]
				                         },
				                         {
				                        	 title: 'Orders',
				                        	 schema: [
				                        	          { key: 'name', name: 'Order Type'},
				                        	          { key: 'amount', name: 'Net Sales', filter: 'myCurrencyReport'},
				                        	          { key: 'percentage', name: '% of total', filter: 'percentage'},
				                        	          ],
				                        	          data: [
				                        	                 { name: 'Dining', amount: data.dine_in_net_sales.amount, percentage: data.dine_in_sales_percentage.amount },
				                        	                 { name: 'Retail', amount: data.retail_net_sales.amount, percentage: data.retail_sales_percentage },
				                        	                 _.assign(data.net_sales, { name: 'Total' }),
				                        	                 ]
				                         },
				                         {
				                        	 title: 'Tracking',
				                        	 schema: [
				                        	          { key: 'name', name: ''},
				                        	          { key: 'count', name: 'Count'},
				                        	          { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
				                        	          ],
				                        	          data: []
				                         },
				                         {
				                        	 title: 'Non-Revenue',
				                        	 schema: [
				                        	          { key: 'name', name: ''},
				                        	          { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
				                        	          ],
				                        	          data: [
				                        	                 _.assign(data.gift_card_purchased, { name: 'Gift Card Sold' }),
				                        	                 _.assign(data.purchased_store_credit, { name: 'Store Credit Sold' }),
				                        	                 ]
				                         },
				                         {
				                        	 title: 'Discounts',
				                        	 schema: [
				                        	          { key: 'name', name: ''},
				                        	          { key: 'count', name: 'Count'},
				                        	          { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
				                        	          ],
				                        	          data: data.discount_applied_by_name
				                         },

				                         ]

				$scope.summaryReportB = [
				                         {
				                        	 title: 'Deductions Summary',
				                        	 schema: [
				                        	          { key: 'name', name: ''},
				                        	          { key: 'count', name: 'Count' },
				                        	          { key: 'amount', name: 'Sale Amount' , filter: 'myCurrencyReport'},
				                        	          ],

				                        	          data: [
				                        	                 _.assign(data.total_refunds, { name: 'Returns' }),
				                        	                 _.assign(data.voided_amount, { name: 'Voids' }),
				                        	                 _.assign({}, { name: 'Credit Total' }),
				                        	                 _.assign({}, { name: 'Training Total' }),
				                        	                 _.assign({}, { name: 'Mgr Voids' }),
				                        	                 _.assign({}, { name: 'Error Corrects' }),
				                        	                 _.assign(data.canceled_invoices, { name: 'Gross Sales' }),
				                        	                 ]
				                         },

				                         {
				                        	 title: 'Misc Charge Summary',
				                        	 schema: [
				                        	          { key: 'name', name: ''},
				                        	          { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
				                        	          ],
				                        	          data: [
				                        	                 _.assign(data.total_gross_sales, { name: 'Gross Receipts' }),
				                        	                 _.assign(data.completed_paid_amount, { name: 'Charged Receipts' }),
				                        	                 _.assign(data.service_fee_in_total, { name: 'Service Charges' }),
				                        	                 _.assign({}, { name: 'Charged Tips' }),
				                        	                 _.assign({}, { name: 'Tips Declared' }),
				                        	                 _.assign({}, { name: 'Total Tips' }),
				                        	                 _.assign({}, { name: 'Tips Paid' }),
				                        	                 _.assign({}, { name: 'Tips Due' }),
				                        	                 ]
				                         },
				                         {
				                        	 title: 'Tables',
				                        	 schema: [
				                        	          { key: 'name', name: 'Order Type'},
				                        	          { key: 'count', name: 'Count'},
				                        	          { key: 'percentage', name: '% of Total'},
				                        	          { key: 'turn', name: 'Turn Time'},
				                        	          ],
				                        	          data: [
				                        	                 {
				                        	                	 name: 'Dining',
				                        	                	 count: data.dine_in_count,
				                        	                	 percentage: '100%',
				                        	                	 turn: data.table_average_turn_time

				                        	                 },
				                        	                 {
				                        	                	 name: 'Retail',
				                        	                	 count: 0,
				                        	                	 percentage: '0%',
				                        	                	 turn: 0
				                        	                 },
				                        	                 {
				                        	                	 name: 'Total',
				                        	                	 count: data.dine_in_count
				                        	                 }
				                        	                 ]
				                         },
				                         {
				                        	 title: 'Guests',
				                        	 schema: [
				                        	          { key: 'name', name: 'Order Type'},
				                        	          { key: 'count', name: 'Count'},
				                        	          { key: 'avg', name: 'Avg/Guest', filter: 'myCurrencyReport'},
				                        	          ],

				                        	          data: [
				                        	                 { name: 'Dining', count: data.people_count.amount, avg: data.people_average_net.amount },
				                        	                 { name: 'Retail', count: 0, avg: 0 },
				                        	                 { name: 'Total', count: data.people_count.amount, avg: data.people_average_net.amount },
				                        	                 ]
				                         },
				                         {
				                        	 title: 'Payment by Tender',
				                        	 schema: [
				                        	          { key: 'tender', name: ''},
				                        	          { key: 'count', name: 'Count'},

				                        	          { key: 'tips_amount', name: 'Tips Amount', filter: 'myCurrencyReport'},
				                        	          { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
				                        	          ],
				                        	          data: data.net_payment_by_tender
				                         },
				                         {
				                        	 title: 'Gratuity',
				                        	 schema: [
				                        	          { key: 'name', name: ''},
				                        	          { key: 'count', name: 'Count'},
				                        	          { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
				                        	          ],
				                        	          data: []
				                         },
				                         {
				                        	 title: 'Net Sales',
				                        	 schema: [
				                        	          { key: 'name', name: ''},
				                        	          { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
				                        	          ],
				                        	          data: []
				                         },

				                         ]

				$scope.summaryReportC = [
				                         {
				                        	 title: 'Labor',
				                        	 schema: [
				                        	          { key: '', name: 'Category'},
				                        	          { key: '', name: 'Regular Hours '},
				                        	          { key: '', name: 'Overtime Hours  '},
				                        	          { key: '', name: 'Total Hours   '},
				                        	          { key: '', name: 'Regular Total '},
				                        	          { key: '', name: 'Overtime Total  '},
				                        	          { key: '', name: 'Total '},
				                        	          { key: '', name: '% Labor/Sales  '},
				                        	          ],
				                        	          data: [
				                        	                 ]
				                         },

				                         ]
			});
		};



		$scope.filterDateOptions = {
				dateFormat: 'yy-mm-dd',
				changeMonth: true,
				changeYear: true
		};

		$scope.update = function() {
			updateData();
		};


		$scope.word = function(string) {
			return string.replace(/_/gi, ' ')
		};
		// inital
		updateData($scope.dateFrom, $scope.dateTo);

	}
};

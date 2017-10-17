export class DailySummaryReportController {
	constructor($scope, $rootScope, reportsFactory, uiGridConstants, DashboardFactory, $filter, $state, ExportFactory, $q) {
		'ngInject';

		var itemsToProcess = [
		                      [
		                       'completed_paid_count',
		                       'completed_unpaid_count',
		                       'completed_partial_paid_count',
		                       ],
		                       [
		                        'gross_profit',
		                        'net_sales',
		                        'net_sales_before_discount_and_service_fee',
		                        'total_gross_sales',
		                        'gross_register_sales',
		                        'gross_invoice_sales',
		                        'gross_web_sales',
		                        'total_refunds',
		                        'register_refunds',
		                        'web_refunds',
		                        'invoice_refunds',
		                        'service_fee_in_total',
		                        'service_fee_in_total_gross_sales',
		                        'service_fee_in_total_refunds',
		                        'discount_applied',
		                        'amount_discount_applied',
		                        'percentage_discount_applied',
		                        'rounding_in_total',
		                        'rounding_applied',
		                        'rounding_refunded',
		                        'net_cogs',
		                        'register_sales_cogs',
		                        'invoice_sales_cogs',
		                        'web_sales_cogs',
		                        'register_refunds_cogs',
		                        'canceled_invoices_cogs',
		                        'web_refunds_cogs',
		                        'purchase_order_cogs',
		                        'gross_sales_internal_items',
		                        'non_sales_internal_items',
		                        'deposit_related_items',
		                        'payment_internal_items',
		                        ],
		                        [
		                         'service_fee_in_total',
		                         'service_fee_in_total_gross_sales',
		                         'service_fee_in_total_refunds',
		                         ],
		                         [
		                          'octopus_transactions_value',
		                          'octopus_payment_value',
		                          'octopus_top_up_value',
		                          ],
		                          [
		                           'payment_by_tender',
		                           'refund_by_tender',
		                           'discount_applied_by_name',
		                           'sales_by_associates',
		                           'sales_by_time_segment',
		                           'sales_by_time_segments_and_departments',
		                           'sales_by_time_segment_and_category',
		                           ],
		                           [
		                            'completed_partial_paid_amount',
		                            'completed_partial_paid_count',
		                            'completed_partial_paid_payment',
		                            'completed_partial_paid_receivable',
		                            'completed_unpaid_amount',
		                            'completed_unpaid_count',
		                            'completed_unpaid_payment',
		                            'completed_unpaid_receivable',
		                            ],
		                            [
		                             'delivery_count',
		                             'delivery_net_sales',
		                             'delivery_sales_percentage',
		                             'dine_in_count',
		                             'dine_in_net_sales',
		                             'dine_in_sales_percentage',
		                             ],
		                             [
		                              'invoice_refunds_cogs',
		                              'invoice_sales_cogs',
		                              'invoiced_unpaid_amount',
		                              'invoiced_unpaid_count',
		                              'invoiced_unpaid_payment',
		                              'invoiced_unpaid_receivable',
		                              ],
		                              [
		                               'item_average_net',
		                               'item_count',
		                               'net_sales',
		                               'net_sales_average',
		                               'balance'
		                               ],
		                               [
		                                'parties_by_zone',
		                                'payment_by_tender',
		                                'people_average_net',
		                                'pick_up_count',
		                                'pick_up_net_sales',
		                                'pick_up_sales_percentage',
		                                'purchase_order_cogs',
		                                'purchased_store_credit',
		                                'gift_card_purchased',
		                                ],
		                                [
		                                 'sales_by_department',
		                                 'sales_by_time_segment',
		                                 'sales_by_time_segment_and_category',
		                                 ],
		                                 [
		                                  'tax_collected',
		                                  'tax_refunded',
		                                  'tax_total',
		                                  'total_gross_sales',
		                                  'total_receivable',
		                                  'total_receivable_count',
		                                  'total_refunds',
		                                  'voided_amount',
		                                  'voided_count',
		                                  ]

		                      ]

		$scope.dateFrom = moment().subtract(0, 'day').format('YYYY-MM-DD');
		$scope.dateTo = moment().format('YYYY-MM-DD');

		$scope.applyFilter = function(input, filter) {
			if(!filter) {
				return input
			}
			var filterArray = filter.split(':')

			// clever trick, replce filterArray's first element with input
			var filterName = filterArray[0]
			filterArray[0] = input
			return $filter(filterName).apply(this, filterArray);
		};

		var filterEmptyData = function( tables, rawdata, filterzerocolumns, skipall ){

			if ( rawdata && rawdata.data ){

				if ( filterzerocolumns || skipall ) {

					var i = 0;
					while ( i < rawdata.data.length ){

						if (rawdata.data[i].amount === 0) {

							if ( skipall ){
								rawdata.data.splice(i, 1);
								continue;
							}

							for ( var k = 0; k < filterzerocolumns.length; k ++ ){
								if ( filterzerocolumns[k] === rawdata.data[i].name ){
									rawdata.data.splice(i, 1);
									continue;
								}
							}
						}
						i++;
					}
				}
				if ( rawdata.data.length > 0 ) {
					tables.push(rawdata);
				}
			}


		};

		var updateData = function() {
			$scope.gridMessage = "loading data...";

			var data = {};

			// load report data one by one
			var chain = itemsToProcess.reduce(function (previous, item, index) {
				return previous.then(function (res) {
					if(res) {
						_.assign(data, res.data.data)
					}
					var filter = {"exposures[]": item}
					return reportsFactory.reportApi('sales_summary_report', $scope.dateFrom, $scope.dateTo, filter)
				})
			}, $q.when());

			chain.then(function(res) {
				_.assign(data, res.data.data)


				var net_sales_data = [
				                      _.assign(data.total_gross_sales, { name: 'Gross Sales' }),
				                      _.assign(data.discount_applied, { name: '- Discounts' }),
				                      _.assign(data.total_refunds, { name: '- Refunds' }),
				                      _.assign(data.service_fee_in_total, { name: '+ Service Charge' }),
				                      _.assign(data.rounding_in_total, { name: '+ Rounding' })
				                      ];

				_.forEach(data.gross_sales_internal_items, function(item){
					net_sales_data.push(item);
				});

				net_sales_data.push(_.assign(data.net_sales, { name: 'Net Sales' }));


				var non_sales_data = [
				                      _.assign(data.gift_card_purchased, { name: 'Gift Card Purchased' }),
				                      _.assign(data.purchased_store_credit, { name: 'Store Credit Purchased' }),
				                      ];

				_.forEach(data.deposit_related_items, function(item){
					non_sales_data.push(item);
				});

				_.forEach(data.non_sales_internal_items, function(item){
					non_sales_data.push(item);
				});

				_.forEach(data.payment_internal_items, function(item){
					non_sales_data.push(item);
				});

				$scope.summaryReportA = [];

				var tables = $scope.summaryReportA;

				filterEmptyData(tables,{
					title: 'OPERATING STATISTICS',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'count', name: 'Count'},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],
					         data: [
					                _.assign(data.net_sales, { name: 'Net Sales' }),
					                _.assign(data.total_gross_sales, { name: 'Gross Order Count' }),
					                _.assign(data.net_sales_average, { name: 'Net Sales Average' }),
					                _.assign(data.people_average_net, { name: 'Cover Avg Net' }),
					                _.assign(data.item_count, { name: 'Item Count' }),
					                _.assign(data.item_average_net, { name: 'Item Avg Net' }),
					                { name: 'Balance', amount: data.balance },
					                ]
				});


				//$scope.summaryReportA.push();

				filterEmptyData(tables,{
					title: 'NET SALES',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],

					         data: net_sales_data

				});

				filterEmptyData(tables,{
					title: 'NON-SALES',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],

					         data: non_sales_data

				});
				filterEmptyData(tables,{
					title: 'TAX',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],
					         data: [
					                _.assign(data.tax_collected, { name: 'Tax Collected' }),
					                _.assign(data.tax_refunded, { name: 'Tax Refunded' }),
					                _.assign(data.tax_total, { name: 'Tax Total' }),
					                ]
				},['Tax Collected','Tax Refunded','Tax Total']);
				filterEmptyData(tables,{
					title: 'DISCOUNT BREAKDOWN',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],
					         data: data.discount_applied_by_name
				});
				filterEmptyData(tables,{
					title: 'SALES BY DEPARTMENT',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],
					         data: data.sales_by_department
				}, ['Total']);
				filterEmptyData(tables,{
					title: 'SALES BY MEAL PERIOD',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'count', name: 'Count'},
					         { key: 'party_count', name: 'Party Count'},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],
					         data: data.sales_by_time_segment
				});
				filterEmptyData(tables,{
					title: 'SALES BY TIME SEGMENT & DEPT',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],
					         data: data.sales_by_time_segments_and_departments.reduce( function(result, sales) {
					        	 result.push(sales)
					        	 if(sales.departments && sales.departments.length) {
					        		 sales.departments.forEach(function(dept) {
					        			 result.push(dept)
					        		 });
					        	 }
					        	 return result

					         }, [])
				}, ['Total']);
				filterEmptyData(tables,{
					title: 'SALES BY TIME SEGMENT & CATEGORY',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],
					         data: data.sales_by_time_segment_and_category.reduce( function(result, sales) {
					        	 result.push(sales)
					        	 if(sales.categories && sales.categories.length) {
					        		 sales.categories.forEach( function(dept) {
					        			 result.push(dept)
					        		 })
					        	 }
					        	 return result

					         }, [])
				}, ['Total']);

				filterEmptyData(tables,{
					title: 'COST',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'count', name: 'Count'},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],
					         data: [
					                _.assign(data.register_sales_cogs, { name: 'Register COGS' }),
					                _.assign(data.invoice_sales_cogs, { name: 'Invoice COGS' }),
					                _.assign(data.web_sales_cogs, { name: 'Web COGS' }),
					                _.assign(data.register_refunds_cogs, { name: 'Register Refund COGS' }),
					                _.assign(data.invoice_refunds_cogs, { name: 'Invoice Refund COGS' }),
					                _.assign(data.web_refunds_cogs, { name: 'Web Refunds COGS' }),
					                _.assign(data.purchase_order_cogs, { name: 'PO COGS' }),
					                _.assign(data.canceled_invoices_cogs, { name: 'Cancelled COGS' }),
					                ]
				});
				filterEmptyData(tables,{
					title: 'Parties By Zone',
					schema: [
					         { key: 'room_name', name: 'Room Name'},
					         { key: 'party_count', name: 'Party Count'},
					         ],
					         data: data.parties_by_zone

				});


				$scope.summaryReportB = [];

				filterEmptyData($scope.summaryReportB,{
					title: 'CHANNEL METRICS',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'count', name: 'Count' },
					         { key: 'amount', name: 'Sale Amount' , filter: 'myCurrencyReport'},
					         { key: 'percentage', name: '% Sales' , filter: 'percentage:2'},
					         ],

					         data: [
					                {
					                	name: 'Dine-in / Walk-in (offline)',
					                	count: data.dine_in_count,
					                	amount: data.dine_in_net_sales.amount,
					                	percentage: data.dine_in_sales_percentage.amount,
					                },
					                {
					                	name: 'Pickup (online / offline)',
					                	count: data.pick_up_count,
					                	amount: data.pick_up_net_sales.amount,
					                	percentage: data.pick_up_sales_percentage.amount,
					                },
					                {
					                	name: 'Delivery (online / offline)',
					                	count: data.delivery_count,
					                	amount: data.delivery_net_sales.amount,
					                	percentage: data.delivery_sales_percentage.amount,
					                },
					                {
					                	name: 'Net Sales',
					                	count: null,
					                	amount: data.net_sales.amount,
					                	percentage: null,
					                },
					                ]
				});
				filterEmptyData($scope.summaryReportB,{
					title: 'O2O METRICS',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'count', name: 'Count'},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],
					         data: [
					                _.assign(data.gross_register_sales, { name: 'Register Sales' }),
					                _.assign(data.gross_invoice_sales, { name: 'Invoice Sales' }),
					                _.assign(data.gross_web_sales, { name: 'Web Sales' }),
					                _.assign(data.total_gross_sales, { name: 'Gross Sales' }),
					                ]
				});

				filterEmptyData($scope.summaryReportB,{
					title: 'PAYMENT BREAKDOWN',
					schema: [
					         { key: 'tender', name: ''},
					         { key: 'count', name: 'Count'},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         { key: 'tips_amount', name: 'Tips Amount', filter: 'myCurrencyReport'},
					         ],
					         data: data.payment_by_tender
				}, null, true);

				filterEmptyData($scope.summaryReportB,{
					title: 'PAYMENT REFUND BREAKDOWN',
					schema: [
					         { key: 'tender', name: ''},
					         { key: 'count', name: 'Count'},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         { key: 'tips_amount', name: 'Tips Amount', filter: 'myCurrencyReport'},
					         ],
					         data: data.refund_by_tender
				}, null, true);

				filterEmptyData($scope.summaryReportB,{
					title: 'PAYMENT BY ASSOCIATE',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'count', name: 'Count'},
					         { key: 'amount', name: 'Amount', filter: 'myCurrencyReport'},
					         ],
					         data: data.sales_by_associates
				});

				filterEmptyData($scope.summaryReportB,{
					title: 'ORDER STATUS',
					schema: [
					         { key: 'name', name: ''},
					         { key: 'count', name: 'Count' },
					         { key: 'sale_amount', name: 'Sale Amount' , filter: 'myCurrencyReport'},
					         { key: 'pay_amount', name: 'Pay Amount' , filter: 'myCurrencyReport'},
					         { key: 'receivable', name: 'Receivable' , filter: 'myCurrencyReport'},
					         ],
					         data: [
					                {
					                	name: 'Unpaid',
					                	count: data.completed_unpaid_count.amount,
					                	sale_amount: data.completed_unpaid_amount.amount,
					                	pay_amount: data.completed_unpaid_payment.amount,
					                	receivable: data.completed_unpaid_receivable.amount,
					                },
					                {
					                	name: 'Partial Paid',
					                	count: data.completed_partial_paid_count.amount,
					                	sale_amount: data.completed_partial_paid_amount.amount,
					                	pay_amount: data.completed_partial_paid_payment.amount,
					                	receivable: data.completed_partial_paid_receivable.amount,
					                },
					                {
					                	name: 'Invoiced Unpaid',
					                	count: data.invoiced_unpaid_count.amount,
					                	sale_amount: data.invoiced_unpaid_amount.amount,
					                	pay_amount: data.invoiced_unpaid_payment.amount,
					                	receivable: data.invoiced_unpaid_receivable.amount,
					                },
					                {
					                	name: 'Total Receivables',
					                	count: data.total_receivable_count.amount,
					                	sale_amount: null,
					                	pay_amount: null,
					                	receivable: data.total_receivable.amount,
					                },
					                {
					                	name: 'Voids',
					                	count: data.voided_count.amount,
					                	sale_amount: data.voided_amount.amount,
					                	pay_amount: null,
					                	receivable: null,
					                },
					                ]
				});


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
		$scope.showCurrency = reportsFactory.showCurrency;

		$scope.download = function(mode) {
			reportsFactory.showCurrency = $scope.showCurrency;
			var header = reportsFactory.header($scope.dateFrom, $scope.dateTo);
			var tableA = _.map($scope.summaryReportA, reportsFactory.getReport);
			var tables = _.map($scope.summaryReportB, reportsFactory.getReport);
			tableA = tableA.concat(tables);

			var fileName = $state.params.report;
			fileName = fileName + ' ' + $scope.dateFrom + '-' + $scope.dateTo;

			ExportFactory.exportTables(mode, tableA, header, {layout:'p', showCurrency: $scope.showCurrency.value},  fileName );
		}


		// inital
		updateData($scope.dateFrom, $scope.dateTo);

	}
};





export function SalesSummaryReportControllerFactory() {
	'ngInject';

	/**
	 * Flatten the department and category into same layer
	 * @param report
	 * @param field
	 * @param name
	 * @returns {Array}
	 */
	var flattenData = function(report,field,name){
		var newdata = [];
		var length = report.data.length;
		_.each(report.data,function(value, index){
			if ( index !== length - 1 ) {
				newdata.push({'name': value.name});
			}
			else {
				newdata.push({'name': value.name,'amount': value.amount});
			}
			_.each(value[field],function(category, index2){
				var item = {};
				item[name] = category.name;
				item['amount'] = category.amount;
				newdata.push(item);
			});
			if ( index !== length - 1 ) {
				var item = {};
				item[name] = 'Subtotal';
				item['amount'] = value.amount;
				newdata.push(item);
			}
		});
		return newdata;
	}
	function word(string) {
		if(string) {
			return string.replace(/_/gi, ' ');
		} else {
			return '';
		}
	}
	return {flattenData:flattenData,word:word};
};


export class SalesSummaryReportController {
	constructor(suppliers, categories, brands, departments, $q, $scope, $rootScope, SalesSummaryReportControllerFactory, reportsFactory, uiGridConstants, DashboardFactory, $state, ExportFactory, $filter) {
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
		                        'non_sales_internal_items'
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
		                           ],
		                           [
		                            'refund_by_tender',
		                            ],
		                            [
		                             'discount_applied_by_name'
		                             ],
		                             [
		                              'sales_by_associates'
		                              ],
		                              [
		                               'sales_by_time_segment'
		                               ],
		                               [
		                                'sales_by_time_segments_and_departments'
		                                ],
		                                [
		                                 'sales_by_time_segment_and_category'
		                                 ],
		                                 [
		                                  'sales_by_time_segment_and_category'
		                                  ]
		                      ];
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

				$scope.salesSummaryReport = data;

				// reports at left side
				$scope.summaryReportA = _.compact( _.map(data, function(item, key) {
					if(_.isPlainObject(item)) {
						var newitem = {};
						newitem.title = key;
						for (var itemobjects in item) {
							newitem[itemobjects] = item[itemobjects];
						}
						return newitem;
					}
				}));

				// reports at right side
				$scope.summaryReportB = _.compact( _.map(data, function(item, key) {
					if(_.isArray(item)) {
						return {title: key, data: item};
					}
				}));
			});
		};


		$scope.showCurrency = reportsFactory.showCurrency;
		$scope.download = function(mode) {
			var header = reportsFactory.header($scope.dateFrom, $scope.dateTo);
			var tableA = [reportsFactory.getReport({data:$scope.summaryReportA,title:'Summary'})];
			var tables = _.map($scope.summaryReportB, reportsFactory.getReport);
			tableA = tableA.concat(tables);
			var fileName = $state.params.report;
			fileName = fileName + ' ' + $scope.dateFrom + '-' + $scope.dateTo;

			ExportFactory.exportTables(mode, tableA, header, {layout:'p', showCurrency: reportsFactory.showCurrency.value},  fileName );
		};

		$scope.dateFrom = moment().subtract(0, 'day').format('YYYY-MM-DD');
		$scope.dateTo = moment().format('YYYY-MM-DD');

		$scope.filterDateOptions = {
				dateFormat: 'yy-mm-dd',
				changeMonth: true,
				changeYear: true
		};

		$scope.update = function() {
			updateData();
		};

		$scope.word = SalesSummaryReportControllerFactory.word;

		// inital
		updateData($scope.dateFrom, $scope.dateTo);

	}
};

export function salesSummaryReportTable (SalesSummaryReportControllerFactory){
	'ngInject';
	return {
		scope: {
			report: '='
		},
		templateUrl: 'app/modules/reports/sales_summary_report_table.html',
		restrict: 'E',
		controller: function($scope, $element, $attrs) {
			console.log('$scope.report', $scope.report);

			$scope.word = SalesSummaryReportControllerFactory.word;
			$scope.columns = ['count', 'amount'];
			$scope.filters = [null, 'myCurrencyReport'];

			if( $scope.report.title == 'parties_by_zone' ) {
				$scope.columns = ['room_name', 'party_count']
				$scope.filters = [null, 'myCurrencyReport', 'myCurrencyReport'];
			}

			if( $scope.report.title == 'payment_by_tender' ) {
				$scope.columns = ['count', 'amount', 'tips_amount']
				$scope.filters = [null, 'myCurrencyReport', 'myCurrencyReport'];
			}
			if( $scope.report.title == 'sales_by_department' ) {
				$scope.columns = ['amount']
				$scope.filters = ['myCurrencyReport'];
			}

			if( $scope.report.title === 'sales_by_time_segment') {
				$scope.columns = ['cover', 'count', 'amount', 'Avg.']
				$scope.filters = [null, null, 'myCurrencyReport', 'myCurrencyReport'];
				$scope.report.data = _.map($scope.report.data, d => {
					d['Avg.'] = d.count > 0 ? (d.amount/d.count).toFixed(2) : 0
							d['cover'] = d['party_count'];
					delete d['party_count'];
					return d;
				});
			}
			if( $scope.report.title === 'sales_by_time_segments_and_departments'){
				$scope.columns = ['department','amount'];
				$scope.filters = [null, 'myCurrencyReport'];
				$scope.report.data = SalesSummaryReportControllerFactory.flattenData($scope.report, 'departments', 'department');
			}
			if( $scope.report.title === 'sales_by_time_segment_and_category') {
				$scope.columns = ['category','amount'];
				$scope.filters = [null, 'myCurrencyReport'];
				$scope.report.data = SalesSummaryReportControllerFactory.flattenData($scope.report, 'categories', 'category');
			}
		}
	};

};

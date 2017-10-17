export class SummaryController {
	constructor($scope, $rootScope, $http, $q, DashboardFactory, SummaryFactory, productGraphicFactory) {
		'ngInject';


		// SHARED STUFF FOR BOTH MODES
		$scope.timeframe = 'today';
		$scope.isLoadingMetrics = true;
		$scope.isLoadingTopProducts = true;
		$scope.isLoadingTopDepartments = true;
		$scope.summaryFactory = SummaryFactory;

		$scope.isMultiStore = DashboardFactory.isMultiStore();
		$scope.summaryCurrentStores = DashboardFactory.getCurrentStores();
		$scope.visible = DashboardFactory.getCurrentPermission('dashboard:access');

		var storeIds = DashboardFactory.getStoreIds();

		// get formatted date by number of days before today
		var getDateBefore = function(number, date) {
			date = date || new Date();
			var targetDate = new Date(date - number * 1000 * 60 * 60 * 24);
			var yyyy = targetDate.getFullYear().toString();
			var mm = (targetDate.getMonth() + 1).toString();
			mm = mm[1] ? mm : '0' + mm;
			var dd = (targetDate.getDate()).toString();
			dd = dd[1] ? dd : '0' + dd;
			return yyyy + '-' + mm + '-' + dd;
		};


		var _timeframeToDate = function(timeframe) {
			var timeframeDate = {};

			if(timeframe === 'today') {
				timeframeDate.currentT1 = getDateBefore(0);
				timeframeDate.currentT2 = getDateBefore(0);
				timeframeDate.lastT1 = getDateBefore(1);
				timeframeDate.lastT2 = getDateBefore(1);

			} else if(timeframe === 'yesterday') {
				timeframeDate.currentT1 = getDateBefore(1);
				timeframeDate.currentT2 = getDateBefore(1);
				timeframeDate.lastT1 = getDateBefore(2);
				timeframeDate.lastT2 = getDateBefore(2);

			} else if(timeframe === 'week') {
				timeframeDate.currentT1 = getDateBefore(6);
				timeframeDate.currentT2 = getDateBefore(0);
				timeframeDate.lastT1 = getDateBefore(13);
				timeframeDate.lastT2 = getDateBefore(7);

			} else if(timeframe === 'month') {
				timeframeDate.currentT1 = getDateBefore(29);
				timeframeDate.currentT2 = getDateBefore(0);
				timeframeDate.lastT1 = getDateBefore(59);
				timeframeDate.lastT2 = getDateBefore(30);

			} else if(timeframe === 'year') {
				timeframeDate.currentT1 = getDateBefore(364);
				timeframeDate.currentT2 = getDateBefore(0);
				timeframeDate.lastT1 = getDateBefore(729);
				timeframeDate.lastT2 = getDateBefore(365);

			} else if(timeframe === 'custom') {
				// Do nothing
			} else {
				throw 'timeframe not supported';
			}

			return timeframeDate;
		};

		var _summaryPromises = function(time1, time2) {
			return _.map(storeIds, function(id, i) {
				if ( DashboardFactory.getCurrentStore().associate_type !== 'JUNIOR' && DashboardFactory.getCurrentStore().associate_type !== 'CHAIN_MASTER' ) {
					return SummaryFactory.getSalesSummary(id, time1, time2);
				}
			});
		};

		var _currentSalesSummaryPromises = function() {
			return _summaryPromises($scope.currentT1, $scope.currentT2);
		};

		var _lastSalesSummaryPromises = function() {
			return _summaryPromises($scope.lastT1, $scope.lastT2);
		};

		var _mapReduceSummary = function(data) {
			return _.reduce(data, function(memo, data) {
				_.forOwn(data, function(value, key) {
					memo[key] = memo[key] || 0;
					memo[key] = memo[key] + value.amount;
				});
				return memo;
			}, {});
		};
		/*
      $scope.$watch('timeframe', function(newVal, old) {

        var dates = _timeframeToDate(newVal);

        $scope.currentT1 = dates.currentT1;
        $scope.currentT2 = dates.currentT2;
        $scope.lastT1 = dates.lastT1;
        $scope.lastT2 = dates.lastT2;

        $scope.updateData();
      });*/

		$scope.$watch('summaryCurrentStores', function(newVal){
			if(newVal.length > 1) {
				_.each(newVal, function(store){
					SummaryFactory.getSalesSummary(store.id, $scope.currentT1, $scope.currentT2).success(function(data){
						store.product_sales = data.product_sales
						store.number_of_product_sales = data.number_of_product_sales
					});

				});
			}

		});

		$scope.updateData = function() {
			// hacky but effective - prevent repeated updates
			if($scope.currentT1 && $scope.currentT2) {
				updateSales();
				updateTopProducts();
				updateTopDepartments();
				updateLastUpdateTime();
				$scope.lastUpdateTime = new Date().toLocaleString();
			}
		};
		$scope.setCustomRange = function() {
			$scope.newT1 = $scope.currentT1;
			$scope.newT2 = $scope.currentT2;
			$scope.isChoosingCustomRange = true;
		};
		$scope.applyCustomRange = function() {
			$scope.isChoosingCustomRange = false;
			$scope.currentT1 = $scope.summaryFactory.newT1;
			$scope.currentT2 = $scope.summaryFactory.newT2;
			var diff = (new Date($scope.currentT2) - new Date($scope.currentT1)) / (1000 * 60 * 60 * 24);
			$scope.lastT2 = getDateBefore(1, new Date($scope.currentT1));
			$scope.lastT1 = getDateBefore(diff, new Date($scope.lastT2));
			$scope.newT1 = null;
			$scope.newT2 = null;
			$scope.timeframe = 'custom';

			$scope.updateData();
		};
		$scope.cancelSettingCustomRange = function() {
			$scope.newT1 = $scope.currentT1;
			$scope.newT2 = $scope.currentT2;
			$scope.isChoosingCustomRange = false;
		};

		var getPurchaseSummary = function(timeframe){
			var dates1 = _timeframeToDate('today');

			SummaryFactory.getPuchase(storeIds, dates1.currentT1, dates1.currentT2).then( function(total){
				$scope.purchaseToday = total;
			});

			var dates2 = _timeframeToDate('week');

			SummaryFactory.getPuchase(storeIds, dates2.currentT1, dates2.currentT2).then( function(total){
				$scope.purchaseWeek = total;
			});
		};

		var getTimeframeSummary = function(timeframe){
			var dates = _timeframeToDate(timeframe);
			$q.all(_summaryPromises(dates.currentT1, dates.currentT2))
			.then(function(data) {
				var mergedData = _mapReduceSummary(data);
				$scope[timeframe] = mergedData;
			});
		};

		var getTimeframeProductSold = function() {
			var dates1 = _timeframeToDate('today');

			SummaryFactory.getProductSold(storeIds, dates1.currentT1, dates1.currentT2).then(function(total){
				$scope.productSoldToday = total;
			});

			var dates2 = _timeframeToDate('week');

			SummaryFactory.getProductSold(storeIds, dates2.currentT1, dates2.currentT2).then(function(total){
				$scope.productSoldWeek = total;
			});
		};

		var updateLastUpdateTime = function() {
			$scope.lastUpdateTime = new Date().toLocaleString();
		};

		var updateSales = function() {
			$scope.isLoadingMetrics = true;

			$q.all(_currentSalesSummaryPromises())
			.then(function(responses) {

				// current total saleses
				$scope.currentTotalSaleses = _.map(responses, function (response, i) {
					return response.net_sales.amount;
				});
				$scope.currentTotalSales = _.reduce($scope.currentTotalSaleses, function(memo, amount) {
					return memo + amount;
				}, 0);
				// current average sales
				var currentNumbersOfOrders = _.map(responses, function(response, i) {
					return response.total_gross_sales.count;
				});
				$scope.currentAverageSales = _.map(currentNumbersOfOrders, function(num, i) {
					return num !== 0 ?
							$scope.currentTotalSaleses[i] / num :
								0;
				});
				var currentNumberOfOrders = _.reduce(currentNumbersOfOrders, function(memo, num) {
					return memo + num;
				}, 0);
				$scope.currentAverageSale = currentNumberOfOrders !== 0 ?
						$scope.currentTotalSales / currentNumberOfOrders :
							0;
				// current gross profits
				$scope.currentGrossProfits = _.map(responses, function(response, i) {
					return response.gross_profit.amount;
				});
				$scope.currentGrossProfit = _.reduce($scope.currentGrossProfits, function(memo, amount) {
					return memo + amount;
				}, 0);
				// current average margins
				$scope.currentGrossMargins = _.map($scope.currentTotalSaleses, function(totalSales, i) {
					return totalSales !== 0 ?
							$scope.currentGrossProfits[i] / totalSales :
								0;
				});
				$scope.currentGrossMargin = $scope.currentTotalSales !== 0 ?
						$scope.currentGrossProfit / $scope.currentTotalSales :
							0;

				$q.all(_lastSalesSummaryPromises()).then(
						function(responses) {
							// last total saleses
							var lastTotalSaleses = _.map(responses, function (response, i) {
								return response.net_sales.amount;
							});
							$scope.totalSalesChanges = _.map(lastTotalSaleses, function(lastSale, i) {
								return lastSale !== 0 ?
										($scope.currentTotalSaleses[i] / lastSale) - 1 :
											($scope.currentTotalSaleses[i] !== 0 ? 'N/A' : 0);
							});
							var lastTotalSales = _.reduce(lastTotalSaleses, function(memo, amount) {
								return memo + amount;
							}, 0);
							$scope.totalSalesChange = lastTotalSales !== 0 ?
									($scope.currentTotalSales / lastTotalSales) - 1 :
										($scope.currentTotalSales !== 0 ? 'N/A' : 0);
									// last average sales
									var lastNumbersOfOrders = _.map(responses, function(response, i) {
										return response.total_gross_sales.count;
									});
									var lastAverageSales = _.map(lastNumbersOfOrders, function(num, i) {
										return num !== 0 ?
												lastTotalSaleses[i] / num :
													0;
									});
									$scope.averageSaleChanges = _.map(lastAverageSales, function(sale, i) {
										return sale !== 0 ?
												($scope.currentAverageSales[i] / sale) - 1 :
													($scope.currentAverageSales[i] !== 0 ? 'N/A' : 0);
									});
									var lastNumberOfOrders = _.reduce(lastNumbersOfOrders, function(memo, num) {
										return memo + num;
									}, 0);
									var lastAverageSale = lastNumberOfOrders !== 0 ?
											lastTotalSales / lastNumberOfOrders :
												0;
									$scope.averageSaleChange = lastAverageSale !== 0 ?
											($scope.currentAverageSale / lastAverageSale) - 1 :
												($scope.currentAverageSale !== 0 ? 'N/A' : 0);
											// last gross profits
											var lastGrossProfits = _.map(responses, function(response, i) {
												return  response.gross_profit.amount;
											});
											$scope.grossProfitChanges = _.map(lastGrossProfits, function(profit, i) {
												return profit !== 0 ?
														($scope.currentGrossProfits[i] / profit) - 1 :
															($scope.currentGrossProfits[i] !== 0 ? 'N/A' : 0);
											});
											var lastGrossProfit = _.reduce(lastGrossProfits, function(memo, amount) {
												return memo + amount;
											}, 0);
											$scope.grossProfitChange = lastGrossProfit !== 0 ?
													($scope.currentGrossProfit / lastGrossProfit) - 1 :
														($scope.currentGrossProfit !== 0 ? 'N/A' : 0);
													// last gross margins
													var lastGrossMargins = _.map(lastTotalSaleses, function(sales, i) {
														return sales !== 0 ?
																lastGrossProfits[i] / sales :
																	0;
													});
													$scope.grossMarginChanges = _.map(lastGrossMargins, function(margin, i) {
														return $scope.currentGrossMargins[i] - margin;
													});
													var lastGrossMargin = lastTotalSales !== 0 ?
															lastGrossProfit / lastTotalSales :
																0;
													$scope.grossMarginChange = $scope.currentGrossMargin - lastGrossMargin;

													$scope.isLoadingMetrics = false;
						},
						// error handler
						function(err) {
							console.error(err);
						});
			},
			// error handler
			function(err) {
				console.error(err);
			});
		};

		var updateTopProducts = function() {
			$scope.isLoadingTopProducts = true;
			var currentTopProductsPromises = _.map(storeIds, function(id, i) {
				return SummaryFactory.getTopProducts(id, $scope.currentT1, $scope.currentT2);
			});
			var lastTopProductsPromises = _.map(storeIds, function(id, i) {
				return SummaryFactory.getTopProducts(id, $scope.lastT1, $scope.lastT2);
			});
			$q.all(currentTopProductsPromises).then(
					function() {
						var responses = Array.prototype.slice.call(arguments)[0];
						var currentProductArray = [];
						var currentProductHash = {};
						var currentProducts = [];
						_.each(responses, function(response, i) {
							currentProductArray = currentProductArray.concat(response.data);
						});
						_.each(currentProductArray, function(product, i) {
							if(product.gtid) {
								// products with GTID
								if(currentProductHash[product.gtid]) {
									currentProductHash[product.gtid].sales += Number(product.total);
								} else {
									currentProductHash[product.gtid] = {
											name: product.name,
											gtid: product.gtid,
											sales: Number(product.total),
											change: null
									};
								}
							} else {
								// products with no GTID
								currentProducts.push({
									name: product.name,
									gtid: product.gtid,
									product_id: product.product_id,
									sales: Number(product.total),
									change: null
								});
							}
						});
						_.each(currentProductHash, function(product, gtid) {
							currentProducts.push(product);
						});

						var topProducts = currentProducts.sort(function(p1, p2) {
							return p2.sales - p1.sales;
						}).slice(0, 10);

						$q.all(lastTopProductsPromises).then(
								function() {
									var responses = Array.prototype.slice.call(arguments)[0];
									var lastProductArray = [];
									var lastProductHash = {};
									var lastProducts = [];
									_.each(responses, function(response, i) {
										lastProductArray = lastProductArray.concat(response.data);
									});
									_.each(lastProductArray, function(product, i) {
										if(product.gtid) {
											// products with GTID
											if(lastProductHash[product.gtid]) {
												lastProductHash[product.gtid].sales += Number(product.total);
											} else {
												lastProductHash[product.gtid] = {
														name: product.name,
														gtid: product.gtid,
														sales: Number(product.total),
												};
											}
										}
									});
									_.each(topProducts, function(product, i) {
										var gtid = Number(product.gtid);
										if(lastProductHash[gtid]) {
											product.change = Number(lastProductHash[gtid].sales) ?
													product.sales / Number(lastProductHash[gtid].sales) - 1 :
														null;
										}
										if(product.product_id) {
											product.big_thumb = productGraphicFactory.get(product.product_id, 'big_thumb');
										} else {
											product.big_thumb = 'assets/images/inventory_placeholder.png';
										}

									});
									$scope.topProducts = topProducts;
									$scope.isLoadingTopProducts = false;
								},
								function(err) {
									console.error(err);
								});
					},
					function(err) {
						console.error(err);
					});
		};

		var updateTopDepartments = function() {
			$scope.isLoadingTopDepartments = true;
			var currentTopDepartmentsPromises = _.map(storeIds, function(id, i) {
				return SummaryFactory.getTopDepartments(id, $scope.currentT1, $scope.currentT2);
			});
			var lastTopDepartmentsPromises = _.map(storeIds, function(id, i) {
				return SummaryFactory.getTopDepartments(id, $scope.lastT1, $scope.lastT2);
			});

			$q.all(currentTopDepartmentsPromises).then(
					function() {
						var responses = Array.prototype.slice.call(arguments)[0];
						var currentCategoryArray = _.reduce(responses, function(memo, response) {
							return memo.concat(response.data);
						}, []);
						var currentCategoryHash = {};
						_.each(currentCategoryArray, function(cat, i) {
							if(cat.department.id) {
								// belongs to an actual department
								if(currentCategoryHash[cat.department.id]) {
									currentCategoryHash[cat.department.id].sales += Number(cat.total);
								} else {
									currentCategoryHash[cat.department.id] = {
											name: cat.department.name,
											id: cat.department.id,
											sales: Number(cat.total),
											change: null
									};
								}
							} else {
								if(currentCategoryHash['N/A']) {
									currentCategoryHash['N/A'].sales += Number(cat.total);
								} else {
									currentCategoryHash['N/A'] = {
											name: 'N/A',
											id: 'N/A',
											sales: Number(cat.total),
											change: null
									};
								}
							}
						});
						var currentDepartments = _.map(currentCategoryHash, function(cat, i) {
							return cat;
						});
						var topDepartments = currentDepartments.sort(function(p1, p2) {
							return p2.sales - p1.sales;
						}).slice(0, 10);
						var totalSales = _.reduce(topDepartments, function(memo, cat) {
							return memo + cat.sales;
						}, 0);
						_.each(topDepartments, function(cat, i) {
							cat.ratio = cat.sales / totalSales;
						});

						$q.all(lastTopDepartmentsPromises).then(
								function() {
									var responses = Array.prototype.slice.call(arguments)[0];
									var lastCategoryArray = _.reduce(responses, function(memo, response) {
										return memo.concat(response.data);
									}, []);
									var lastCategoryHash = {};
									_.each(lastCategoryArray, function(cat, i) {
										if(cat.department.id) {
											// belongs to an actual department
											if(lastCategoryHash[cat.department.id]) {
												lastCategoryHash[cat.department.id].sales += Number(cat.total);
											} else {
												lastCategoryHash[cat.department.id] = {
														name: cat.department.name,
														id: cat.department.id,
														sales: Number(cat.total),
														change: null
												};
											}
										} else {
											if(lastCategoryHash['N/A']) {
												lastCategoryHash['N/A'].sales += Number(cat.total);
											} else {
												lastCategoryHash['N/A'] = {
														name: 'N/A',
														id: 'N/A',
														sales: Number(cat.total),
														change: null
												};
											}
										}
									});
									_.each(topDepartments, function(cat, i) {
										if(lastCategoryHash[cat.id]) {
											cat.change = Number(lastCategoryHash[cat.id].sales) ?
													cat.sales / Number(lastCategoryHash[cat.id].sales) - 1 :
														null;
										}
									});
									$scope.topDepartments = topDepartments;
									$scope.isLoadingTopDepartments = false;

								}, function(err) {
									console.error(err);
								});

					},
					function(err) {
						console.error(err);
					});
		};

		if ($scope.visible) {
			getPurchaseSummary()
			getTimeframeProductSold()
		}
		$scope.changeTimeframe = function( timeframe ){

			$scope.isChoosingCustomRange = false;
			$scope.timeframe = timeframe;
			var dates = _timeframeToDate(timeframe);

			$scope.currentT1 = dates.currentT1;
			$scope.currentT2 = dates.currentT2;
			$scope.lastT1 = dates.lastT1;
			$scope.lastT2 = dates.lastT2;

			$scope.updateData();
		};
		$scope.changeTimeframe('today');



	}
}

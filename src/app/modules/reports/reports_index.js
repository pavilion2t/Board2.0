export class ReportsController {
	constructor(modules, $scope, $rootScope, DashboardFactory) {
		'ngInject';

		/**
		 * Filter for report base on permission
		 * @param {object}         report              Report object
		 * @param {string}         report.title        Report title
		 * @param {boolean|string} [report.permission] Report permission required, default is snake_case of report title
		 * @returns {boolean}
		 */
		var reportPermission = function (report) {
			var permission = report.permission;
			if (typeof permission === 'boolean') {
				return permission;
			} else {
				var fixedReportString = permission || report.title.replace(/ /g, '_').toLowerCase();
				return DashboardFactory.getCurrentReportPermission(fixedReportString);
			}
		};

		var getFilteredReportGroup = function () {
			return $scope.reports.slice()
			.map(function (group) {
				var g = Object.assign({}, group);
				g.children = (g.children || []).filter(function (r) {
					return reportPermission(r);
				});
				return g;
			})
			.filter(function (group) {
				return group.children && group.children.length > 0;
			});
		};

		$scope.reports = [];
		var listOfStores = DashboardFactory.getStoreIds();
		var multipleStore = (listOfStores.length > 1);

		// Multiple Store Reports
		if (multipleStore) {
			$scope.reports.push(
					{
						'groupName': 'Inventory & Material',
						'children': [
						             { title: 'Inventory Report' },
						             ]
					});
			$scope.reports.push(
					{
						'groupName': 'Discount',
						'children': [
						             { title: 'Discount Applied Breakdown Report' },
						             ]
					});
			$scope.reports.push(
					{
						'groupName': 'Product Sold',
						'children': [
						             { title: 'Product Sold Breakdown Report' },
						             ]
					});
			$scope.reports.push(
					{
						'groupName': 'Transaction',
						'children': [
						             { title: 'Transaction Breakdown Report' },
						             ]
					});

		} else {
			// Signle Store Reports
			$scope.reports.push(
					{
						'groupName': 'Summary',
						'children': [
						             { title: 'Sales Summary Report' },
						             { title: 'Sales Summary Report By Days' },
						             { title: 'Revenue Report' },
						             { title: 'Daily Summary Report' },
						             { title: 'Daily Earning Report' },
						             { title: 'Daily Order and Item Closing Report' },
						             ]
					});

			$scope.reports.push(
					{
						'groupName': 'Sales',
						'children': [
						             { title: 'Sales by Hourly Report' },
						             { title: 'Sales by Department Report' },
						             { title: 'Sales Performance Summary Report' },
						             { title: 'Sales Breakdown Report' },
						             { title: 'Sales Performance Report' },
						             { title: 'Sales Summary Report' },
						             { title: 'Menu Sales Report' },
						             ]
					});

			$scope.reports.push(
					{
						'groupName': 'CRM',
						'children': [
						             { title: 'Customer Report' },
						             // { title: 'Gift Card Report'}, // TODO: Make this report
						             ]
					});

			$scope.reports.push(
					{
						'groupName': 'Discount',
						'children': [
						             { title: 'Discount Applied Report' },
						             { title: 'Discount Applied Breakdown Report' },
						             ]
					});

			$scope.reports.push(
					{
						'groupName': 'Inventory & Material',
						'children': [
						             { title: 'Inventory Report' },
						             { title: 'Inventory Summary Report' },
						             { title: 'Inventory Flow Report' },
						             { title: 'Serialized Report' },
						             { title: 'Expiration Date Report' },
						             { title: 'Purchase Order Breakdown Report' },
						             { title: 'Receive and Return Note Breakdown Report' },
						             { title: 'Inventory Report by Item' },
						             { title: 'Stock Transfer Breakdown Report' },
						             ]
					});

			$scope.reports.push(
					{
						'groupName': 'Stock Take',
						'children': [
						             { title: 'Stock Take Breakdown Report' },
						             { title: 'Stock Take Summary Report' },
						             ]
					});

			if (modules.restaurant_features_enabled) {
				$scope.reports.push(
						{
							'groupName': 'Restaurant',
							'children': [
							             { title: 'Party Report' },
							             { title: 'Void Report' },
							             { title: 'Table Usage Report' },
							             { title: 'Menu Sales Report' },
							             { title: 'Reservation and Deposit Report' },
							             { title: 'Deposit Credit Report' },
							             ]
						});
			}

			$scope.reports.push(
					{
						'groupName': 'Product Sold',
						'children': [
						             { title: 'Product Sold Breakdown Report' },
						             { title: 'Product Sold Report' },
						             ]
					});

			$scope.reports.push(
					{
						'groupName': 'Transaction',
						'children': [
						             { title: 'Octopus Transaction Breakdown Report' },
						             { title: 'Transaction Breakdown Report' },
						             { title: 'Batch Report' },
						             { title: 'Refund Report' },
						             { title: 'Accounts Receivable Report' },
						             { title: 'Cashier Transaction Report' },
						             ]
					});

			$scope.reports.push(
					{
						'groupName': 'Tax',
						'children': [
						             { title: 'Tax Summary Report' },
						             ]
					});

			$scope.reports.push(
					{
						'groupName': 'Voucher',
						'children': [
						             { title: 'Voucher Report' },
						             ]
					});

			$scope.reports.push(
					{
						'groupName': 'Misc',
						'children': [
						             { title: 'Time Clock Report' },
						             { title: 'Courier Performance Breakdown Report' },
						             ]
					});
		}
		$scope.filteredReport = getFilteredReportGroup();

		$scope.kebabCase = _.kebabCase;
	}
}


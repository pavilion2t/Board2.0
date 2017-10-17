import { AccountsReceivableReportController } from './accounts_receivable_report'
import { BatchReportController } from './batch_report'
import { CashierTransactionReportController } from './cashier_transaction_report'
import { columnDefsFactory } from './columnDefs_factory'
import { CourierPerformanceBreakdownReportController }  from './courier_performance_breakdown_report'
import { CuhkCustomReportController } from './cuhk_custom_report'
import { CustomerReportController } from './customer_report'
import { DailyEarningReportController } from './daily_earning_report'
import { DailyOrderAndItemClosingReportController, dailyOrderAndItemClosingReport } from './daily_order_and_item_closing_report'
import { DailySummaryReportController } from './daily_summary_report'
import { DailySystemSalesDetailReportController } from './daily_system_sales_detail_report'
import { DepositCreditReportController } from './deposit_credit_report'
import { DiscountAppliedBreakdownReportController } from './discount_applied_breakdown_report'
import { DiscountAppliedReportController } from './discount_applied_report'
import { ExpirationDateReportController } from './expiration_date_report'
import { InventoryFlowReportController } from './inventory_flow_report'
import { InventoryReportController } from './inventory_report'
import { InventoryReportByItemController } from './inventory_report_by_item'
import { InventoryReportByItemFactory } from './inventory_report_by_item_factory'
import { InventorySummaryReportController } from './inventory_summary_report'
import { MenuSalesReportController } from './menu_sales_report'
import { OctopusTransactionBreakdownReportController } from './octopus_transaction_breakdown_report'
import { PartyReportController } from './party_report'
import { ProductSoldBreakdownReportController } from './product_sold_breakdown_report'
import { ProductSoldReportController } from './product_sold_report'
import { PurchaseOrderBreakdownReportController } from './purchase_order_breakdown_report'
import { ReceiveAndReturnNoteBreakdownReportController } from './receive_and_return_note_breakdown_report'
import { RefundReportController } from './refund_report'
import { gridReport, reportTimeFilter } from './report_directive'
import { reportsFactory } from './reports_factory'
import { ReportsController } from './reports_index'
import { ReservationAndDepositReportController } from './reservation_and_deposit_report'
import { RevenueReportController } from './revenue_report'
import { SalesAccountingReportController } from './sales_accounting_report'
import { SalesBreakdownReportController } from './sales_breakdown_report'
import { SalesByDepartmentReportController } from './sales_by_department_report'
import { SalesByHourlyReportController } from './sales_by_hourly_report'
import { SalesPerformanceReportController } from './sales_performance_report'
import { SalesPerformanceSummaryReportController } from './sales_performance_summary_report'
import { SalesSummaryReportControllerFactory, SalesSummaryReportController, salesSummaryReportTable } from './sales_summary_report'
import { SalesSummaryReportByDaysController } from './sales_summary_report_by_days'
import { SerializedReportController } from './serializedReport'
import { StockTakeBreakdownReportController } from './stock_take_breakdown_report'
import { StockTakeSummaryReportController } from './stock_take_summary_report'
import { StockTransferBreakdownReportController } from './stock_transfer_breakdown_report'
import { TableUsageReportController } from './table_usage_report'
import { TaxSummaryReportController } from './tax_summary_report'
import { TimeClockReportController } from './time_clock_report'
import { TransactionBreakdownReportController } from './transaction_breakdown_report'
import { VoidReportController } from './void_report'
import { VoucherReportController } from './voucher_report'

export default angular
  .module('reports', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.reports', {
        abstract: true,
        url: '/reports',
        template: '<ui-view />',
        resolve: {
          brands: function ($stateParams, DashboardFactory) {
            if (!$stateParams.store_id) {
              return null;
            }
            return DashboardFactory.getBrands($stateParams.store_id);
          },
          departments: function ($stateParams, DashboardFactory) {
            if (!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getDepartments($stateParams.store_id);
          },
          categories: function ($stateParams, DashboardFactory) {
            if (!$stateParams.store_id) {
              return null;
            }
            return DashboardFactory.getCategories($stateParams.store_id);
          },
          suppliers: function ($stateParams, DashboardFactory) {
            if (!$stateParams.store_id || $stateParams.store_id == 'new') {
              return null;
            }
            return DashboardFactory.getSuppliers($stateParams.store_id);
          },
          associates: function ($stateParams, DashboardFactory) {
            if (!$stateParams.store_id) {
              return null;
            }
            return DashboardFactory.getAssociates($stateParams.store_id);
          },
        }
      })
      .state('app.dashboard.reports.index', {
        data: { multiStoreSupport: true },
        url: '',
        templateUrl: 'app/modules/reports/list_reports.html',
        controller: 'ReportsController'
      })
      .state('app.dashboard.reports.show', {
        data: { multiStoreSupport: true },
        url: '/:report',
        templateUrl: function ($stateParams) {
          return 'app/modules/reports/' + _.snakeCase(_.camelCase($stateParams.report)) + '.html';
        },
        controllerProvider: function ($stateParams) {
          return _.capitalize(_.camelCase($stateParams.report)) + "Controller";
        }
      })
  })
  .controller('AccountsReceivableReportController', AccountsReceivableReportController)
  .controller('BatchReportController', BatchReportController)
  .controller('CashierTransactionReportController', CashierTransactionReportController)
  .factory('columnDefsFactory', columnDefsFactory)
  .controller('CourierPerformanceBreakdownReportController', CourierPerformanceBreakdownReportController)
  .controller('CuhkCustomReportController', CuhkCustomReportController)
  .controller('CustomerReportController', CustomerReportController)
  .controller('DailyEarningReportController', DailyEarningReportController)
  .controller('DailyOrderAndItemClosingReportController', DailyOrderAndItemClosingReportController)
  .directive('dailyOrderAndItemClosingReport', dailyOrderAndItemClosingReport)
  .controller('DailySummaryReportController', DailySummaryReportController)
  .controller('DailySystemSalesDetailReportController', DailySystemSalesDetailReportController)
  .controller('DepositCreditReportController', DepositCreditReportController)
  .controller('DiscountAppliedBreakdownReportController', DiscountAppliedBreakdownReportController)
  .controller('DiscountAppliedReportController', DiscountAppliedReportController)
  .controller('ExpirationDateReportController', ExpirationDateReportController)
  .controller('InventoryFlowReportController', InventoryFlowReportController)
  .controller('InventoryReportController', InventoryReportController)
  .controller('InventoryReportByItemController', InventoryReportByItemController)
  .factory('InventoryReportByItemFactory', InventoryReportByItemFactory)
  .controller('InventorySummaryReportController', InventorySummaryReportController)
  .controller('MenuSalesReportController', MenuSalesReportController)
  .controller('OctopusTransactionBreakdownReportController', OctopusTransactionBreakdownReportController)
  .controller('PartyReportController', PartyReportController)
  .controller('ProductSoldBreakdownReportController', ProductSoldBreakdownReportController)
  .controller('ProductSoldReportController', ProductSoldReportController)
  .controller('PurchaseOrderBreakdownReportController', PurchaseOrderBreakdownReportController)
  .controller('ReceiveAndReturnNoteBreakdownReportController', ReceiveAndReturnNoteBreakdownReportController)
  .controller('RefundReportController', RefundReportController)
  .directive('gridReport', gridReport)
  .directive('reportTimeFilter', reportTimeFilter)
  .factory('reportsFactory', reportsFactory)
  .controller('ReportsController', ReportsController)
  .controller('ReservationAndDepositReportController', ReservationAndDepositReportController)
  .controller('RevenueReportController', RevenueReportController)
  .controller('SalesAccountingReportController', SalesAccountingReportController)
  .controller('SalesBreakdownReportController', SalesBreakdownReportController)
  .controller('SalesByDepartmentReportController', SalesByDepartmentReportController)
  .controller('SalesByHourlyReportController', SalesByHourlyReportController)
  .controller('SalesPerformanceReportController', SalesPerformanceReportController)
  .controller('SalesPerformanceSummaryReportController', SalesPerformanceSummaryReportController)
  .factory('SalesSummaryReportControllerFactory', SalesSummaryReportControllerFactory)
  .controller('SalesSummaryReportController', SalesSummaryReportController)
  .directive('salesSummaryReportTable', salesSummaryReportTable)
  .controller('SalesSummaryReportByDaysController', SalesSummaryReportByDaysController)
  .controller('SerializedReportController', SerializedReportController)
  .controller('StockTakeBreakdownReportController', StockTakeBreakdownReportController)
  .controller('StockTakeSummaryReportController', StockTakeSummaryReportController)
  .controller('StockTransferBreakdownReportController', StockTransferBreakdownReportController)
  .controller('TableUsageReportController', TableUsageReportController)
  .controller('TaxSummaryReportController', TaxSummaryReportController)
  .controller('TimeClockReportController', TimeClockReportController)
  .controller('TransactionBreakdownReportController', TransactionBreakdownReportController)
  .controller('VoidReportController', VoidReportController)
  .controller('VoucherReportController', VoucherReportController)

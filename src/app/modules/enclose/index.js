
export default angular
  .module('enclose', [])
  .config(function ($stateProvider) {
    'ngInject';

    $stateProvider
      .state('app.dashboard.vouchers', {
        url: '/vouchers',
        template: '<div><enclose src="vouchers"></enclose></div>'
      })
      .state('app.dashboard.workflow-set-up', {
        url: '/workflow-set-up',
        template: '<div><enclose src="workflow-set-up"></enclose></div>'
      })
      .state('app.dashboard.delivery-note', {
        url: '/delivery-note',
        template: '<div><enclose src="delivery-note"></enclose></div>'
      })
      .state('app.dashboard.inventory-variance', {
        url: '/inventory-variance',
        template: '<div><enclose src="inventory-variance"></enclose></div>'
      })
      .state('app.dashboard.line-item-status-set-up', {
        url: '/line-item-status-set-up',
        template: '<div><enclose src="line-item-status-set-up"></enclose></div>'
      })
      .state('app.dashboard.production-orders', {
        url: '/production-orders',
        template: '<div><enclose src="production-orders"></enclose></div>'
      })
      .state('app.dashboard.promo-codes', {
        url: '/promo-codes',
        template: '<div><enclose src="promo-codes"></enclose></div>'
      })
      .state('app.dashboard.advanced-report', {
        data: { multiStoreSupport: true },
        url: '/advanced-report',
        template: '<div><enclose src="advanced-report"></enclose></div>'
      })
      .state('app.dashboard.tableau', {
        data: {multiStoreSupport: true},
        url: '/tableau',
        template: '<div><enclose src="tableau"></enclose></div>'
      })
      .state('app.dashboard.bindo-admin', {
        data: {multiStoreSupport: true},
        url: '/bindo-admin',
        template: '<div><enclose src="bindo-admin"></enclose></div>'
      })
      .state('app.dashboard.settings.payments', {
        url: '/payments',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('app.dashboard.settings.payments.signature', {
        url: '/signature',
        template: '<div><enclose src="settings/payments/signature"></enclose></div>'
      })
      .state('app.dashboard.settings.payments.store-credit', {
        url: '/store-credit',
        template: '<div><enclose src="settings/payments/store-credit"></enclose></div>'
      })
      .state('app.dashboard.settings.payments.payment-type', {
        url: '/payment-type',
        template: '<div><enclose src="settings/payments/payment-type"></enclose></div>'
      })
      .state('app.dashboard.settings.add-ons', {
        url: '/add-ons',
        template: '<div><enclose src="settings/add-ons"></enclose></div>'
      })
      .state('app.dashboard.settings.business', {
        url: '/business',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('app.dashboard.settings.business.associates', {
        url: '/associates',
        template: '<div><enclose src="settings/business/associates"></enclose></div>'
      })
      .state('app.dashboard.settings.business.barcode', {
        url: '/barcode',
        template: '<div><enclose src="settings/business/barcode"></enclose></div>'
      })
      .state('app.dashboard.settings.business.stations', {
        url: '/kds-setting',
        template: '<div><enclose src="settings/business/stations"></enclose></div>'
      })
      .state('app.dashboard.settings.business.kds-setting', {
        url: '/kds-setting',
        template: '<div><enclose src="settings/business/kds-setting"></enclose></div>'
      })
      .state('app.dashboard.settings.business.table-size-segmentation', {
        url: '/table-size-segmentation',
        template: '<div><enclose src="settings/business/table-size-segmentation"></enclose></div>'
      })
      .state('app.dashboard.settings.business.table', {
        url: '/table',
        template: '<div><enclose src="settings/business/table"></enclose></div>'
      })
      .state('app.dashboard.settings.business.uom-group', {
        url: '/uom-group',
        template: '<div><enclose src="settings/business/uom-groups"></enclose></div>'
      });

  });

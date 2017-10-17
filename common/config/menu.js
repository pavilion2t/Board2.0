const DEFAULT = [
  { name: 'Summary', type: 'group' },
  { name: 'Overview', route: 'summary', type: 'link', multiStore: true },

  { name: 'Inventory Management', type: 'group' },
  { name: 'Inventory', route: 'inventory', indexRedirect: 'index', type: 'link', permission: 'inventory:view_only' },
  // { name: 'Inventory', route: 'inventory', type: 'link', permission: 'inventory:view_only', prefix: 'v2', label: 'Alpha', internal: true },
  { name: 'Modifiers', route: 'modifiers', indexRedirect: 'index', type: 'link', permission: 'modifier_set:view_only' },
  { name: 'Departments', route: 'departments', type: 'link', permission: 'inventory:view_only' },
  { name: 'Lot Inquiry', route:'lot-inquiry', type: 'link' },
  { name: 'Restaurant Menu', route: 'menus', indexRedirect: 'index', type: 'link', permission: 'menu_setup:view_only', module: 'restaurant_features_enabled' },
  { name: 'Stock Transfers', route: 'stock-transfers', indexRedirect: 'index', type: 'link' },

  { name: 'Stock Take Management', type: 'group' },
  { name: 'Inventory Variance', route: 'inventory-variance', type: 'link', prefix: 'v2', label: 'Alpha', internal: true },

  { name: 'Production Management', type: 'group' },
  { name: 'Production orders', route: 'production-orders', type: 'link', permission: 'production_order:view', module: 'bill_of_material_enabled', prefix: 'v2' },

  { name: 'Promotion', type: 'group' },
  { name: 'Discounts', route: 'discounts', indexRedirect: 'index', type: 'link', permission: 'discount:view_only' },
  { name: 'Promotion Codes', type: 'link', route: 'promo-codes', prefix: 'v2' },

  { name: 'CRM', type: 'group' },
  { name: 'Customers', route: 'customers', indexRedirect: 'index', type: 'link', permission: 'customer:view_only' },
  { name: 'Membership Levels', route: 'membership', indexRedirect: 'index', type: 'link' },
  { name: 'Gift Cards', route: 'gift-cards', indexRedirect: 'index', type: 'link', permission: 'gift_card:view_only', module: 'gift_card_enabled' },
  { name: 'Vouchers', route: 'vouchers', type: 'link', permission: 'voucher:view', module: 'voucher_feature_enabled', prefix: 'v2' },

  { name: 'Sales Management', type: 'group' },
  { name: 'Register Sales', route: 'sales', indexRedirect: 'index', type: 'link', permission: 'sales:view_only' },
  { name: 'Invoices', route: 'invoices', indexRedirect: 'index', type: 'link', permission: 'invoice:view_only', multiStore: true },
  { name: 'Delivery Note', route: 'delivery-note', type: 'link', prefix: 'v2' },
  { name: 'Line Item Status', route: 'line-items', indexRedirect: 'index', type: 'link' },
  { name: 'Line Item Status Set Up', route: 'line-item-status-set-up', type: 'link', prefix: 'v2' },
  { name: 'Workflow Set Up', route: 'workflow-set-up', type: 'link', prefix: 'v2' },

  { name: 'Supplier Management', type: 'group' },
  { name: 'Suppliers', route: 'suppliers', indexRedirect: 'index', type: 'link', permission: 'supplier:view_only' },
  { name: 'Purchase Orders', route: 'purchase-orders', indexRedirect: 'index', type: 'link', permission: 'purchase_order:view_only', multiStore: true },
  { name: 'Goods Received Note', route: 'goods', indexRedirect: 'index', type:'link', permission: 'purchase_order:view_only', module: 'warehouse_management_enabled' },
  { name: 'Return Note', route: 'returnnote', indexRedirect: 'index', type:'link', permission: 'purchase_order:view_only', module: 'warehouse_management_enabled' },

  { name: 'Advanced Management', type: 'group' },
  { name: 'Event & Devices', route: 'event-devices', type: 'link', permission: 'settings:view_only', module: 'device_whitelist_enabled' },

  { name: 'Reports', type: 'group' },
  { name: 'Reports', route: 'reports', indexRedirect: 'index', type: 'link', permission: 'report', multiStore: true },
  { name: 'Advanced Reports', route: 'advanced-report', type: 'link', multiStore: true, prefix: 'v2' },
  { name: 'Tableau', route: 'tableau', type: 'link', multiStore: true, label: 'Alpha', internal: true, prefix: 'v2'},
  { name: 'Admin', route: 'bindo-admin', type: 'link', multiStore: true, label: 'Admin', internal: true, prefix: 'v2'},


  { name: 'Settings', type: 'group' },
  { name: 'Settings', route: 'settings', subRoute: 'settings', type: 'menu', permission: 'settings', children: [
    {
      name: 'Business',
      permission: 'settings:business',
      subRoute: 'business',
      children: [
        { name: 'Policies', route: 'settings/business/policies', subRoute: 'policies', state: 'settings.policy', prefix: 'v2' },
        { name: 'Storefront', route: 'settings/iframe', state: 'settings.iframe', indexRedirect: 'index' },
        { name: 'Tax Options', route: 'settings/tax', state: 'settings.tax', indexRedirect: 'index' },
        { name: 'Associates', route: 'settings/business/associates', subRoute: 'associates', state: 'settings.business.associates' },
        { name: 'Rounding Behavior', route: 'settings/business/rounding-behavior', subRoute: 'rounding-behavior', prefix: 'v2', state: 'settings.rounding' },
        { name: 'Opening Hours', route: 'settings/time/opening-hours', state: 'settings.time.opening-hours' },
        { name: 'Time Segments', route: 'settings/time/segments', state: 'settings.time.segments' },
        { name: 'Permissions', route: 'settings/permissions', indexRedirect: 'index', state: 'settings.permissions' },
        { name: 'Additional Fees', route: 'settings/additionalfee', indexRedirect: 'index', state: 'settings.additionalfee' },
        { name: 'Email Template', route: 'settings/email-template', indexRedirect: 'index', state: 'settings.email-template' },
        { name: 'Currencies', route: 'settings/currency', indexRedirect: 'index', state: 'settings.currency' },
        { name: 'Languages', route: 'settings/languages', state: 'settings.languages' },
        { name: 'Custom Attributes', route: 'settings/custom-attributes', state: 'settings.custom-attributes' },
        { name: 'Stations', route: 'settings/business/stations', subRoute: 'stations', prefix: 'v2', state: 'settings.business.stations' },
        { name: 'Embedded Barcodes', route: 'settings/business/barcode', subRoute: 'barcode', prefix: 'v2', state: 'settings.business.barcode' },
        { name: 'Tables', route: 'settings/business/table', subRoute: 'table', prefix: 'v2', state: 'settings.business.table' },
        { name: 'Table Size Segmentations', route: 'settings/business/table-size-segmentation', subRoute: 'table-size-segmentation', prefix: 'v2', state: 'settings.business.table-size-segmentation' },
        { name: 'UOM Groups', route: 'settings/business/uom-groups', subRoute: 'uom-groups', prefix: 'v2', state: 'settings.business.uom-group' },
      ]
    },
    { name: 'Payments',
      permission: 'settings:payment',
      subRoute: 'payments',
      children: [
        { name: 'Store Credit', route: 'settings/payments/store-credit', subRoute: 'store-credit', prefix: 'v2', state: 'settings.payments.store-credit' },
        { name: 'Signature', route: 'settings/payments/signature', subRoute: 'signature', prefix: 'v2', state: 'settings.payments.signature' },
        { name: 'Payment Types', route: 'settings/payments/payment-type', subRoute: 'payment-type', prefix: 'v2', state: 'settings.payments.payment-type' },
      ]
    },
    { name: 'Add-ons',
      permission: 'settings:add_ons',
      children: [
        { name: 'Add-ons', route: 'settings/add-ons', subRoute: 'add-ons', prefix: 'v2', state: 'settings.add-ons' },
      ]
    },
  ]
  }
];

const CHAIN_MASTER_MENUS = [
  { name: 'Item Master', route: 'item-master', type: 'link', indexRedirect: 'index', multiStore: true },
  { name: 'Discounts', route: 'discounts', type: 'link', indexRedirect: 'index' },
];

module.exports = {
  DEFAULT: DEFAULT,
  CHAIN_MASTER_MENUS: CHAIN_MASTER_MENUS,
};

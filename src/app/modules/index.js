import _DASHBOARD from './_DASHBOARD'
import activating from './activating'
import customers from './customers'
import departments from './departments'
import discounts from './discounts'
import enclose from './enclose'
import event_devices from './event_devices'
import gift_cards from './gift_cards'
import goods from './goods'
import inventory from './inventory'
import invoices from './invoices'
import item_master from './item_master'
import line_items from './line_items'
import login from './login'
import lot_inquiry from './lot_inquiry'
import membership from './membership'
import menus from './menus'
import modifiers from './modifiers'
import purchase_orders from './purchase_orders'
import reports from './reports'
import sales from './sales'
import settings from './settings'
import stock_transfers from './stock_transfers'
import summary from './summary'
import suppliers from './suppliers'
import welcome from './welcome'
import workflow from './workflow'


export default angular
  .module('modules', [
    _DASHBOARD.name,
    activating.name,
    customers.name,
    departments.name,
    discounts.name,
    enclose.name,
    event_devices.name,
    gift_cards.name,
    goods.name,
    inventory.name,
    invoices.name,
    item_master.name,
    line_items.name,
    login.name,
    lot_inquiry.name,
    membership.name,
    menus.name,
    modifiers.name,
    purchase_orders.name,
    reports.name,
    sales.name,
    settings.name,
    stock_transfers.name,
    summary.name,
    suppliers.name,
    workflow.name
  ])

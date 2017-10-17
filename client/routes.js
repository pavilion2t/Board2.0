import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import { wrapConnect } from './helpers/connectHelper';
import { requireAuth } from './helpers/requireAuthHelper';
import { ROUTE as R } from '~/constants';

import * as actions from './actions';
import IndexIndex from './pages/index/index';
import LoginBase from './pages/login/base';
import LoginIndex from './pages/login/index';
import BaseLayout from './pages/layout/base/base';

import InventoryBase from './pages/inventory/base';
import InventoryIndex from './pages/inventory/index';
import InventoryShow from './pages/inventory/show';
import InventoryShowOverview from './pages/inventory/showOverview';
import InventoryShowSupplier from './pages/inventory/showSupplier';
import InventoryShowTaxOption from './pages/inventory/showTaxOption';
import InventoryShowLog from './pages/inventory/showLog';
import InventoryEditOverView from './pages/inventory/editOverview';
import InventoryEditSupplier from './pages/inventory/editSupplier';
import InventoryEditTaxOption from './pages/inventory/editTaxOption';
import InventoryNewItem from './pages/inventory/newItem';
import InventoryImporter from './pages/inventory/importer';

import DeliveryIndex from './pages/delivery-note/index';
import DeliveryNewItem from './pages/delivery-note/new-item';
import DeliveryItem from './pages/delivery-note/item';
import LineItemStatusSetupIndex from './pages/lineItemStatusSetUp/index';

import WorkflowSetupIndex from './pages/workflowSetUp/index';
import WorkflowSetupItem from './pages/workflowSetUp/item';

import MembershipIndex from './pages/membership-level/index';
import MembershipItem from './pages/membership-level/item';
import MembershipItemOverview from './pages/membership-level/item-overview';
import MembershipItemOverviewEdit from './pages/membership-level/item-overview-edit';
import MembershipNewItem from './pages/membership-level/newItem';

import ProductionOrderIndex from './pages/production-order';
import ProductionOrderNewItem from './pages/production-order/new-item';
import ProductionOrderItem from './pages/production-order/item';
import ProductionOrderItemOverview from './pages/production-order/item-overview';
import ProductionOrderItemMaterialList from './pages/production-order/item-materialList';

import InventoryVarianceIndex from './pages/inventory-variance/index';
import InventoryVarianceNewItem from './pages/inventory-variance/new-item';
import InventoryVarianceItem from './pages/inventory-variance/item';

import VoucherIndex from './pages/voucher/index';
import VoucherItem from './pages/voucher/item';
import VoucherOverviewShow from './pages/voucher/overviewShow';
import VoucherOverviewEdit from './pages/voucher/overviewEdit';
import VoucherNewItem from './pages/voucher/newItem';

import VoucherDeleteItem from './pages/voucher/deleteItem';
import associatedProductsEdit from './pages/voucher/associatedProductsEdit';
import associatedProductsShow from './pages/voucher/associatedProductsShow';
import VoucherVouchers from './pages/voucher/vouchers';

import { NEW as INVOICE_NEW } from './pages/invoice/constant';
import InvoiceItem from './pages/invoice/invoice';
import InvoiceCreate from './pages/invoice/invoice-create';
import QuoteItem from './pages/invoice/quote';
import QuoteCreate from './pages/invoice/quote-create';

import { PROMO_CODE } from './constants';
import PromoCodeList from './pages/promo-code/index';
import PromoCodeItem from './pages/promo-code/item';
import PromoCodeNewItem from './pages/promo-code/new-item';

import SettingsBusinessPolicies from './pages/settings/business/policies';
import SettingsBusinessDelivery from './pages/settings/business/delivery';
import SettingsBusinessAssociates from './pages/settings/business/associates';
import SettingsBusinessRoundingbehavior from './pages/settings/business/rounding-behavior';
import SettingsBusinessKdsIndex from './pages/settings/business/kds';
import SettingsBusinessKdsItem from './pages/settings/business/kds/item';
import SettingsBusinessEmbededBarcode from './pages/settings/business/embedded-barcode';
import SettingsBusinessTable from './pages/settings/business/table';
import SettingsBusinessTableSizingSegmentation from './pages/settings/business/table-sizing-segmentation';
import UomGroupIndex from './pages/settings/business/uom-group';
import UomGroupItem from './pages/settings/business/uom-group/item';
import SettingsPaymentsStorecredit from './pages/settings/payments/store-credit';
import SettingsPaymentsSignature from './pages/settings/payments/signature';
import SettingsPaymentsPaymenttype from './pages/settings/payments/payment-type';
import SettingsAddons from './pages/settings/add-ons/add-ons';

import Tableau from './pages/tableau'
import AdvancedReport from './pages/tableau/advanced'
import BindoAdmin from './pages/tableau/admin'

export default (
  <Route path="/">
    <IndexRedirect to={ `/${R.SITE_PREFIX}` }/>
    <Route path={ R.SITE_PREFIX }>
      <IndexRoute component={ wrapConnect(requireAuth(IndexIndex), actions) } />

      <Route path=":store_id" component={ wrapConnect(requireAuth(BaseLayout), actions) }>
        <Route path="inventory" component={ wrapConnect(InventoryBase, actions) } >
          <Route path="importer" component={ wrapConnect(InventoryImporter, actions) } />
          <Route path="new" component={ wrapConnect(InventoryNewItem, actions) } />
          <IndexRoute component={ wrapConnect(InventoryIndex, actions) } />

          <Route path=":listing_id" component={ wrapConnect(InventoryShow, actions) }>
            <IndexRedirect to="overview" />
            <Route path="overview">
              <IndexRoute component={ InventoryShowOverview } />
              <Route path="edit" component={ wrapConnect(InventoryEditOverView, actions) } />
            </Route>
            <Route path="supplier">
              <IndexRoute component={ wrapConnect(InventoryShowSupplier, actions) } />
              <Route path="edit-supplier" component={ wrapConnect(InventoryEditSupplier, actions) } />
            </Route>
            <Route path="tax">
              <IndexRoute component={ wrapConnect(InventoryShowTaxOption, actions) } />
              <Route path="edit-tax" component={ wrapConnect(InventoryEditTaxOption, actions) } />
            </Route>
            <Route path="log" component={ wrapConnect(InventoryShowLog, actions) } />
            <Route path="edit" component={ wrapConnect(InventoryEditOverView, actions) } />
          </Route>
        </Route>

        <Route path={ R.PRODUCTION_ORDERS }>
          <IndexRoute component={ ProductionOrderIndex } />
          <Route path="new" component={ ProductionOrderNewItem } />
          <Route path=":production_order_id" component={ ProductionOrderItem }>
            <IndexRedirect to="overview" />
            <Route path="overview" component={ ProductionOrderItemOverview }/>
            <Route path="material-list" component={ ProductionOrderItemMaterialList }/>
          </Route>
        </Route>

        <Route path={ R.INVENTORY_VARIANCE }>
          <IndexRoute component={ InventoryVarianceIndex } />
          <Route path="new" component={ InventoryVarianceNewItem }/>
          <Route path=":inventory_variance_id" component={ InventoryVarianceItem } />
        </Route>

        <Route path={ R.LINE_ITEM_STATUS_SET_UP } component={ LineItemStatusSetupIndex } />

        <Route path={ R.WORKFLOW_SET_UP }>
          <IndexRoute component={ WorkflowSetupIndex } />
          <Route path="new" component={ WorkflowSetupItem } />
          <Route path=":workflow_id" component={ WorkflowSetupItem } />
        </Route>

        <Route path="membership-levels">
          <IndexRoute component={ MembershipIndex } />
          <Route path="new" component={ MembershipNewItem } />
          <Route path=":membership_id" component={ MembershipItem } >
            <IndexRedirect to="overview" />
            <Route path="overview">
              <IndexRoute component={ MembershipItemOverview } />
              <Route path="edit" component={ MembershipItemOverviewEdit } />
            </Route>
          </Route>

        </Route>

        <Route path="vouchers">
          <IndexRoute component={ VoucherIndex } />
          <Route path="new" component={ VoucherNewItem } />
          <Route path="delete">
            <Route path=":discount_id" component={ VoucherDeleteItem } />
          </Route>

          <Route path=":discount_id" component={ VoucherItem } >
            <IndexRedirect to="overview" />
            <Route path="overview">
              <IndexRoute component={ VoucherOverviewShow } />
              <Route path="edit" component={ VoucherOverviewEdit } />
            </Route>
            <Route path="associate">
              <IndexRoute component={ associatedProductsShow } />
              <Route path="edit" component={ associatedProductsEdit } />
            </Route>
            <Route path="vouchers" component={ VoucherVouchers } />
          </Route>
        </Route>

        <Route path={ R.PROMO_CODES }>
          <IndexRoute component={ PromoCodeList } />
          <Route path={ PROMO_CODE.MODE.NEW } component={ PromoCodeNewItem } />
          <Route path=":promo_code_id" component={ PromoCodeItem } />
        </Route>

        <Route path={ R.DELIVERY_NOTE }>
          <IndexRoute component={ DeliveryIndex } />
          <Route path="new/for/:type/:ref_id" component={ DeliveryNewItem } />

          <Route path=":delivery_id" component={ DeliveryItem } />
        </Route>

        <Route path={ R.INVOICES }>
          <Route path={ INVOICE_NEW } component={ InvoiceCreate } />
          <Route path=":order_number" component={ InvoiceItem } />
        </Route>

        <Route path={ R.QUOTES }>
          <Route path={ INVOICE_NEW } component={ QuoteCreate } />
          <Route path=":order_number" component={ QuoteItem } />
        </Route>

        <Route path={ R.SETTINGS }>
          <Route path={ R.BUSINESS }>
            <Route path="policies" component={ SettingsBusinessPolicies } />
            <Route path="delivery" component={ SettingsBusinessDelivery } />
            <Route path="associates" component={ SettingsBusinessAssociates } />
            <Route path="rounding-behavior" component={ SettingsBusinessRoundingbehavior } />
            <Route path={ R.STATIONS }>
              <IndexRoute component={ wrapConnect(SettingsBusinessKdsIndex, actions) } />
              <Route path=":station_id" component={ SettingsBusinessKdsItem } />
            </Route>
            <Route path="barcode" component={ SettingsBusinessEmbededBarcode } />
            <Route path="table" component={ SettingsBusinessTable } />
            <Route path="table-size-segmentation" component={ SettingsBusinessTableSizingSegmentation } />
            <Route path={ R.UOM_GROUPS }>
              <IndexRoute component={ UomGroupIndex } />
              <Route path="new" component={ UomGroupItem } />
              <Route path=":uom_group_id" component={ UomGroupItem } />
            </Route>
          </Route>
          <Route path="payments">
            <Route path="store-credit" component={ SettingsPaymentsStorecredit } />
            <Route path="signature" component={ SettingsPaymentsSignature } />
            <Route path="payment-type" component={ SettingsPaymentsPaymenttype } />
          </Route>
          <Route path="add-ons">
            <IndexRoute component={ SettingsAddons } />
          </Route>
        </Route>
        <Route path="tableau" component={Tableau} />
        <Route path="advanced-report" component={AdvancedReport}/>
        <Route path="bindo-admin" component={BindoAdmin}/>
      </Route>
      <Route path={ R.LOGIN } component={ wrapConnect(LoginBase, actions) }>
        {/*<IndexRedirect to="index"/>*/}
        <Route path="index" component={ wrapConnect(LoginIndex, actions) } />
        <Route path="forget-password" component={ wrapConnect(LoginIndex, actions) } />
      </Route>
    </Route>
  </Route>
);

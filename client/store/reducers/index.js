import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import baseReducer from './baseReducer';
import alertReducer from './alertReducer';
import storeReducer from './storeReducer';
import userReducer from './userReducer';
import pathReducer from './pathReducer';
import { listingsReducer, listingReducer } from './listingReducer';
import listingStatusReducer from './listingStatusReducer';
import entityReducer from './entityReducer';
import voucherReducer from './voucherReducer';
import voucherCouponReducer from './voucherCouponReducer';
import kdsReducer from './kdsReducer';
import kdsStatusReducer from './kdsStatusReducer';
import { importerReducer } from './importerReducer';
import savedFiltersReducer from './savedFiltersReducer';
import storeSuppliersReducer from './storeSuppliersReducer';
import deliveryOrderReducer from './deliveryOrderReducer';
import inventoryVarianceReducer from './inventoryVarianceReducer';
import invoiceReducer from './invoiceReducer';
import tableReducer from './tableReducer';
import promoCodeReducer from './promoCodesReducer';

import formsReducer from './formsReducer';
import pagesReducer from './pagesReducer';
import components from './componentReducer';

const rootReducer = combineReducers({
  base: baseReducer,
  alerts: alertReducer,
  form: formReducer,
  user: userReducer,
  path: pathReducer,
  stores: storeReducer,
  storeSuppliers: storeSuppliersReducer,
  savedFilters: savedFiltersReducer,
  listings: listingsReducer,
  currentListing: listingReducer,
  listingStatus: listingStatusReducer,
  entities: entityReducer,
  importerStatus: importerReducer,
  voucher: voucherReducer,
  voucherCoupon: voucherCouponReducer,
  deliveryOrder: deliveryOrderReducer,
  invoice: invoiceReducer,
  inventoryVariance: inventoryVarianceReducer,
  promoCode: promoCodeReducer,
  kds: kdsReducer,
  kdsStatus: kdsStatusReducer,
  table: tableReducer,
  forms: formsReducer,
  pages: pagesReducer,
  components,
});

export default rootReducer;

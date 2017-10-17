import { combineReducers } from 'redux';

import { default as addLineItemStatus } from './addLineItemStatus';
import { default as addListingByBarcode } from './addListingByBarcode';
import { default as departmentSelection } from './departmentSelectionReducer';
import { default as stationOverview } from './stationOverviewReducer';
import { default as statusSelection } from './statusSelectionReducer';
import { default as workflowOverview } from './workflowOverview';
import { default as embeddedBarcode } from './embeddedBarcodeReducer';
import { default as tableSizeSegmentation } from './tableSizeSegmentation';

import { default as uomOverview } from './uomOverview';

import { default as productionOrderItem } from './productionOrderItem';
import { default as fileImporter } from './fileImporter';
import { default as paymentRefund } from './paymentRefund';

const formsReducer = combineReducers({
  addLineItemStatus,
  addListingByBarcode,
  departmentSelection,
  stationOverview,
  statusSelection,
  workflowOverview,
  embeddedBarcode,
  tableSizeSegmentation,
  uomOverview,
  productionOrderItem,
  fileImporter,
  paymentRefund,
});

export default formsReducer;

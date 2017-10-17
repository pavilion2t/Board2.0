import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  QUANTITY_ALLOW_DECIMAL_ALLOW_ALL,
  QUANTITY_ALLOW_DECIMAL_ALLOW_PARTIALLY,
  INVENTORY_VARIANCE,
} from '~/constants';
const { TYPE, TYPE_LABEL, MODE } = INVENTORY_VARIANCE;

import { inventoryVarianceLabel, inventoryVarianceColor } from '~/helpers/statusHelper';

import {
  MainContentSection,
} from '~/pages/layout/main-content';
import {
  listingComponent,
  currencyInputComponent,
  numberInputComponent,
  countSerialNumberComponent,
} from  '~/components/griddle-components';
import FormGroup from '~/components/form-group/formGroup';
import Status from '~/components/status/status';
import { Grid } from '~/components/grid';
import AddListingButton from '~/components/add-listing/addListing';
import { DateField, TimestampDisplay } from '~/components/date';
import InputCurrency from '~/components/input-currency';

import * as ivActions from '~/actions/inventoryVarianceActions';


function mapStateToProp(state) {
  const { inventoryVariance: pathState = {} } = state;
  return { pathState };
}

function mapDispatchToProp(dispatch) {
  const actions = {
    ...ivActions,
  };
  return { actions: bindActionCreators(actions, dispatch) };
}

@connect(mapStateToProp, mapDispatchToProp)
@listingComponent
@currencyInputComponent
@numberInputComponent
@countSerialNumberComponent
export default class ItemTemplate extends Component {

  static contextTypes = {
    currentStore: PropTypes.object,
  };

  static propTypes  = {
    actions:    PropTypes.object,
    pathState:  PropTypes.object,
  };

  removeLineItem = (data) => {
    this.props.actions.removeListings([data.listingId]);
  };

  goToPage = (page) => {
    this.props.actions.listingGoToPage(page);
  };

  addListing = (data) => {
    this.props.actions.addListings(data);
  };

  handleRowChangeFactory = (field) => (value, row) => {
    const { actions } = this.props;
    const actionMap = {
      actualQty:     actions.updateActualQty,
      varianceQty:   actions.updateVarianceQty,
      cost:          actions.updateCost,
      serialNumbers: actions.updateSerialNumbers,
    };
    const func = actionMap[field];
    if (func){
      func(row.listingId, value);
    }
  };

  handleFieldChange = (field, value) => {
    this.props.actions.updateIvField(field, value);
  };

  render(){
    const { pathState = {} } = this.props;
    const {
      currentStore = {},
      mode, type,
      currentPage, totalPages, totalEntries,
      varianceCostTotal,
      iv = {},
      activeItems = [],
    } = pathState;
    const { module: storeModule = {} } = currentStore;
    const { quantity_allow_decimal, quantity_decimal_points } = storeModule;
    const qtyAllowDpAll = quantity_allow_decimal === QUANTITY_ALLOW_DECIMAL_ALLOW_ALL;
    const qtyAllowDpPartially = quantity_allow_decimal === QUANTITY_ALLOW_DECIMAL_ALLOW_PARTIALLY;
    const isNew = mode === MODE.NEW;
    const isView = mode === MODE.VIEW;
    const isEdit = mode === MODE.EDIT;
    const data = activeItems;
    const columns = [
      {
        columnName: "productName",
        displayName: "Product", // BPID, BLID, UPC/EAN, PLU/SKU
        customComponent: this.listingComponent([
          'bpid' ,
          'blid',
          'ean13',
          'listingBarcode',
          'listingReferenceCodes'
        ]),
      },
      {
        columnName: "qtyBefore",
        displayName: "System Count",
        hide: type == TYPE.OPENING,
        customComponent: this.numberInputComponent,
        customComponentProps: {
          style: { minWidth: 120 },
          readOnly: true,
          dp: (props) => qtyAllowDpAll || (qtyAllowDpPartially && props.rowData.quantityAllowDecimal) ? quantity_decimal_points : 0,
        },
      },
      {
        columnName: "actualQty",
        displayName: "Actual Count",
        hide: type == TYPE.VARIANCE_QTY_ADJ || type == TYPE.COST_ADJ,
        customComponent: this.numberInputComponent,
        customComponentProps: {
          style: { minWidth: 120 },
          readOnly: (props) => (
            isView ||
            (type != TYPE.OPENING && type != TYPE.ACTUAL_QTY_ADJ) ||
            props.rowData.serialNumberEnabled
          ),
          dp: (props) => qtyAllowDpAll || (qtyAllowDpPartially && props.rowData.quantityAllowDecimal) ? quantity_decimal_points : 0,
          onChange: this.handleRowChangeFactory('actualQty'),
        },
      },
      {
        columnName: "varianceQty",
        displayName: "Qty Variance",
        hide: type == TYPE.OPENING || type == TYPE.COST_ADJ,
        customComponent: this.numberInputComponent,
        customComponentProps: {
          style: { minWidth: 120 },
          readOnly: (props) => (
            isView ||
            type != TYPE.VARIANCE_QTY_ADJ ||
            props.rowData.serialNumberEnabled
          ),
          dp: (props) => qtyAllowDpAll || (qtyAllowDpPartially && props.rowData.quantityAllowDecimal) ? quantity_decimal_points : 0,
          onChange: this.handleRowChangeFactory('varianceQty'),
        },
      },
      {
        columnName: "costBefore",
        displayName: "Unit Cost (Before)",
        hide: type != TYPE.COST_ADJ,
        customComponent: this.currencyInputComponent,
        customComponentProps: {
          style: { minWidth: 120 },
          readOnly: true,
        },
      },
      {
        columnName: "cost",
        displayName: "Unit Cost",
        customComponent: this.currencyInputComponent,
        customComponentProps: {
          style: { minWidth: 120 },
          readOnly: isView || (type != TYPE.OPENING && type != TYPE.COST_ADJ),
          onChange: this.handleRowChangeFactory('cost'),
        },
      },
      {
        columnName: "varianceCost",
        displayName: "Cost Variance",
        hide: type == TYPE.OPENING,
        customComponent: this.currencyInputComponent,
        customComponentProps: {
          style: { minWidth: 120 },
          readOnly: true,
        },
      },
      {
        columnName: "totalCost",
        displayName: "Total Cost",
        hide: type != TYPE.OPENING,
        customComponent: this.currencyInputComponent,
        customComponentProps: {
          style: { minWidth: 120 },
          readOnly: true,
        },
      },
      {
        columnName: 'lots',
        displayName: 'Lots',
        hide: type == TYPE.COST_ADJ || true,
      },
      {
        columnName: "serialNumbers",
        displayName: "Serial Numbers",
        hide: type == TYPE.COST_ADJ,
        customComponent: this.countSerialNumberComponent,
        customComponentProps: {
          productName: (props) => props.rowData.productName,
          hide: (props) => !props.rowData.serialNumberEnabled,
          readOnly: isView,
          onConfirm: (value, rowData) => this.handleRowChangeFactory('serialNumbers')(value, rowData),
        },
      },
      {
        columnName: "errors",
        displayName: "Error",
        hide: isNew,
        customComponent: this.countSerialNumberComponent,
        customComponentProps: {
          productName: 'Errors',
          hide: (props) => (props.rowData.errors || []).length <= 0,
          readOnly: true,
        },
      },
    ];
    const actions = null;
    const onRemove = isEdit || isNew ? this.removeLineItem : null;
    const bodyConfig = { data, columns, actions, onRemove, border: true };
    const footerConfig = {
      currentPage,
      totalPages,
      goToPage: this.goToPage,
      hideRowPerPage: true,
    };

    return (
      <div>
        <MainContentSection>
          <div className="row">
            <FormGroup
              className="col-xs-6 col-lg-4 col-xl-3"
              label="Store Name"
              display={ currentStore.title }
              autoHideHelpText
              />
            <FormGroup
              className="col-xs-6 col-lg-4 col-xl-3"
              label="Type"
              display={ TYPE_LABEL[type] }
              autoHideHelpText
              />
            <FormGroup
              className="col-xs-6 col-lg-4 col-xl-3"
              label="Status"
              autoHideHelpText
              >
                <Status formControl state={ iv.status } labelTransformer={ inventoryVarianceLabel } colorTransformer={ inventoryVarianceColor } />
            </FormGroup>
            <FormGroup
              label="Record Name"
              className="col-xs-6 col-lg-4 col-xl-3"
              autoHideHelpText
              >
                <input
                  className="form-control"
                  value={ iv.name }
                  onChange={ (event) => this.handleFieldChange('name', event.target.value) }
                  readOnly={ isView }
                  />
            </FormGroup>
            <FormGroup
              className="col-xs-6 col-lg-4 col-xl-3"
              label="Record ID"
              display={ iv.number }
              autoHideHelpText
              />
            <FormGroup
              label="Effective Date"
              className="col-xs-6 col-lg-4 col-xl-3"
              autoHideHelpText
              >
                <DateField
                  value={ iv.effectiveDate }
                  readOnly={ isView || true }
                  onChange={ (event) => this.handleFieldChange('effective_date', event.target.value) }
                  />
            </FormGroup>
          </div>
          <div className="row">
            <FormGroup
              label="Created"
              className="col-xs-6 col-lg-4 col-xl-3"
              autoHideHelpText
              >
                <TimestampDisplay at={ iv.createdAt } by={ iv.createdBy } formField />
            </FormGroup>
            <FormGroup
              label="Updated"
              className="col-xs-6 col-lg-4 col-xl-3"
              autoHideHelpText
              >
                <TimestampDisplay at={ iv.updatedAt } by={ iv.updatedBy } formField />
            </FormGroup>
            <FormGroup
              label="Cancelled"
              className="col-xs-6 col-lg-4 col-xl-3"
              autoHideHelpText
              >
                <TimestampDisplay at={ iv.canceledAt } by={ iv.canceledBy } formField />
            </FormGroup>
            <FormGroup
              label="Rejected"
              className="col-xs-6 col-lg-4 col-xl-3"
              autoHideHelpText
              >
                <TimestampDisplay at={ iv.rejectedAt } by={ iv.rejectedBy } formField />
            </FormGroup>
            <FormGroup
              label="Approved"
              className="col-xs-6 col-lg-4 col-xl-3"
              autoHideHelpText
              >
                <TimestampDisplay at={ iv.approvedAt } by={ iv.approvedBy } formField />
            </FormGroup>
            <FormGroup
              label="Voided"
              className="col-xs-6 col-lg-4 col-xl-3"
              autoHideHelpText
              >
                <TimestampDisplay at={ iv.voidedAt } by={ iv.voidedBy } formField />
            </FormGroup>
          </div>
          <div className="row">
            <FormGroup
              className="col-xs-6 col-lg-4 col-xl-3"
              label="Total Number of SKU"
              display={ totalEntries }
              autoHideHelpText
              />
            <FormGroup
              className="col-xs-6 col-lg-4 col-xl-3"
              label={ type === TYPE.OPENING ? 'Total Cost' : 'Total Cost Variance' }
              autoHideHelpText
              >
              <InputCurrency className="form-control" style={ { textAlign: 'left' } } value={ varianceCostTotal } readOnly/>
            </FormGroup>
          </div>
        </MainContentSection>

        <Grid bodyConfig={ bodyConfig } footerConfig={ footerConfig } style={ { paddingBottom: 0 } } />

        {
          isView ? null :
            <AddListingButton
              withBarcode
              baseSearch={ { filter: { trackQuantity: true } } }
              onSave={ this.addListing }
            >Add New Items</AddListingButton>
        }

        <MainContentSection>
          <FormGroup label="Note">
            <textarea
              className="form-control"
              style={ { height: 200 } }
              value={ iv.remarks }
              readOnly={ isView }
              onChange={ (event) => this.handleFieldChange('remarks', event.target.value) }
              />
          </FormGroup>
        </MainContentSection>
      </div>
    );
  }
}

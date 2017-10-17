import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InputSelectBox from '~/components/input-select-box';
import Loading from '~/components/loading/loading';
// import AddListingByBarcode from '~/components/add-listing-by-barcode';
import * as actions from '~/actions/formActions/productionOrderItem';
import { dateTimeFormatter } from '~/helpers/formatHelper';
import Select from 'react-select';
import ListingName from '~/components/listing-name';
import {
  capitalizeFirstLetterComponent
} from '~/components/griddle-components';
import {
  getCurrentPermission
} from '~/helpers/permissionHelper';
import AddListingButton from '~/components/add-listing/addListing';
import { camelizeKeys } from 'humps';

const options = [
  { value: 1, label: 'Assembly' },
  { value: 0, label: 'Disassembly' }
];

const labelMap = {
  'created': 'Created',
  'approved': 'Approved',
  'fulfilled': 'Finished',
  'canceled': 'Cancalled',
  'fulfilling': 'Processing'
};

function mapStateToProp(state) {
  let formState = state.forms.productionOrderItem;
  return { ...formState };
}

function mapDispatchToProp(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

@connect(mapStateToProp, mapDispatchToProp)
@dateTimeFormatter
@capitalizeFirstLetterComponent
@getCurrentPermission
export default class ProductionOrderItemOverview extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    currentStore: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    editMode: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
    productionOrderItems: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    isCreating: PropTypes.bool.isRequired
  };

  handleAdd = (d) => {
    if (d.length) {
      this.props.actions.addListingItem(camelizeKeys(d));
    }
  };

  renderRows() {
    const {
      editMode,
      productionOrderItems,
      actions,
      initialValues,
      isCreating
    } = this.props;

    if (!productionOrderItems.length) return null;
    let plannedEditable = editMode && (isCreating || initialValues.state === 'created');
    let processedEditable = editMode && (['approved', 'fulfilling'].indexOf(initialValues.state) > -1);
    let removeable = editMode && (isCreating || initialValues.state === 'created');

    return (
      <tbody>
      {  productionOrderItems.map((item, index) => {
        return (
          <tr key={  index  }>
            <td><ListingName {  ...item  }/></td>
            <td>{  plannedEditable ? (<input disabled={  !editMode }
                                             value={ item.quantityInDisplayUnit }
                                             type="number"
                                             onChange={ (e) => actions.changePlannedQuantity(e.target.value, index) }/>) : (
              <span>{ item.quantityInDisplayUnit }</span>) }</td>
            <td>{  processedEditable ? (<input disabled={ !editMode }
                                               value={ item.qtyFulfilledInDisplayUnit }
                                               type="number"
                                               onChange={ (e) => actions.changeProcessedQuantity(e.target.value, index) }/>)
              : (<span>{ item.qtyFulfilledInDisplayUnit }</span>) }</td>
            <td>{  (plannedEditable && item.hasUnitGroup) ? <Select value={ item.displayUnitId }
                                             options={ item.units }
                                             disabled={  !editMode  }
                                             clearable={ false }
                                             labelKey="name"
                                             valueKey="id"
                                             onChange={  opt => actions.changeUom(opt, index) }/> :
              <span>{ item.displayUnit }</span> }</td>
            <td>{ item.listingQuantity }</td>
            <td>{ item.listingQtyReservedForProductionOrder }</td>
            <td>
              {  editMode ? <button type="button"
                                    className="btn btn-primary btn-sm"
                                    disabled={ !removeable }
                                    onClick={  () => actions.removeListingItem(index)  }>Remove
              </button> : null  }
            </td>
          </tr>
        );
      }) }
      </tbody>);
  }

  renderContent() {
    const {
      isSubmitting,
      isLoading,
      isCreating,
      editMode,
      initialValues,
      // params,
      actions
    } = this.props;
    const { currentStore } = this.context;

    const cancalPermission = this.getCurrentPermission('production_order:cancel');
    const approvePermission = this.getCurrentPermission('production_order:approval');

    const approveable = approvePermission && initialValues.state === 'created';
    const cancelable = cancalPermission && ['canceled', 'fulfilled'].indexOf(initialValues.state) === -1;
    let editable = ['canceled', 'fulfilled'].indexOf(initialValues.state) === -1;
    let addable = editMode && (isCreating || initialValues.state === 'created');
    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"/>
          <div>
            {  (!editMode && cancelable) &&
            <button className="btn btn-primary btn-sm" disabled={  isSubmitting  } onClick={ actions.cancel }>Cancel
              Order</button>  }
            {  (!editMode && approveable) &&
            <button className="btn btn-primary btn-sm" disabled={  isSubmitting  } onClick={ actions.approve }>Approve
              Order</button>  }
            {  editMode &&
            <button className="btn btn-secondary btn-sm" disabled={  isSubmitting  } onClick={ actions.discard }>
              Cancel</button>  }
            {  editMode &&
            <button className="btn btn-primary btn-sm" disabled={  isSubmitting  } onClick={ actions.submit }>
              Save</button>  }
            {  (!editMode) &&
            <button className="btn btn-secondary btn-sm" onClick={ actions.enableEditMode }
                    disabled={ !editable || isLoading  }>Edit</button>  }
          </div>
        </header>
        <div className="main-content-section">
          <div className="row">
            <div className="col-md-6">
              <h4>{  currentStore.title  }</h4>
              <div className="w-50">
                <InputSelectBox title="PRODUCTION ORDER TYPE"
                                value={  1  }
                                disabled
                                placeholder="Select order type"
                                resetValue={  undefined  }
                                clearable={  false  }
                                onChange={  () => {
                                }  }
                                options={  options  }/>
              </div>
            </div>
            {  !isCreating && <div className="col-md-6">
              <table>
                <tbody>
                <tr>
                  <td>ORDER NUMBER:</td>
                  <td>{  initialValues.number  }</td>
                </tr>
                <tr>
                  <td>CREATED AT:</td>
                  <td>{  this.dateTime(initialValues.createdAt)  }</td>
                </tr>
                <tr>
                  <td>CREATED BY:</td>
                  <td>{ initialValues.userFullName }</td>
                </tr>
                <tr>
                  <td>STATUS:</td>
                  <td>{  this.capitalizeFirstLetterComponent({ data: labelMap[initialValues.state] || initialValues.state })  }</td>
                </tr>
                </tbody>
              </table>
            </div>  }
          </div>
        </div>
        <div className="main-content-section">
          <p>ITEMS</p>
          <table className="table data-table data-table--no-border data-table--primary-link">
            <thead>
            <tr>
              <th>Name</th>
              <th>PLANNED QTY</th>
              <th>PROCESSED QTY</th>
              <th>UOM</th>
              <th>LATEST QTY ON SHELF</th>
              <th>LATEST QTY PENDING TO ASSEMBLE</th>
              <th/>
            </tr>
            </thead>
            {  this.renderRows()  }
          </table>
          { addable && <div>
            <AddListingButton
              withBarcode
              onSave={ this.handleAdd }
            >Add New Items</AddListingButton>
          </div> }
        </div>
      </div>
    );
  }

  renderLoading() {
    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"/>
        </header>
        <div className="main-content-section">
          <Loading>Loading ...</Loading>
        </div>
      </div>
    );
  }

  render() {
    const { isLoading } = this.props;
    return isLoading ? this.renderLoading() : this.renderContent();
  }
}

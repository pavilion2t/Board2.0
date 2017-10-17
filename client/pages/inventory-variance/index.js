import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pick, cloneDeep } from 'lodash';

import { INVENTORY_VARIANCE } from '~/constants';
const { TYPE_LABEL } = INVENTORY_VARIANCE;
import routeHelper from '~/helpers/routeHelper';
import FilterHelper from '~/helpers/filterHelper';
import {
  inventoryVarianceColor,
  inventoryVarianceLabel,
} from '~/helpers/statusHelper';
import { GridFooter, GridBody } from '~/components/grid';
import Loading from '~/components/loading/loading';
import SelectDepartment from '~/components/select-department/selectDepartment';
import {
  orderStatusComponent,
  timeComponent,
  linkComponent,
  capitalizeFirstLetterComponent
} from '~/components/griddle-components';
import {
  MainContent,
  MainContentHeader,
  MainContentHeaderButtons,
} from '~/pages/layout/main-content';

import * as ivActions from '~/actions/inventoryVarianceActions';
import * as ivIndexActions from '~/actions/pageActions/inventoryVarianceIndex';
import * as departmentSelectionActions from '~/actions/formActions/departmentSelection';

function mapStateToProp(state) {
  let pageState = state.pages.inventoryVarianceIndex;
  let forms = state.forms;

  return { ...pageState, departmentSelectionState: forms.departmentSelection };
}

function mapDispatchToProp(dispatch) {
  const actions = {
    ...ivIndexActions,
    ...ivActions,
  };
  return {
    actions: bindActionCreators(actions, dispatch),
    departmentSelectionActions: bindActionCreators(departmentSelectionActions, dispatch),
  };
}

@connect(mapStateToProp, mapDispatchToProp)
@capitalizeFirstLetterComponent
@orderStatusComponent
@timeComponent
@linkComponent
export default class InventoryVarianceIndex extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    currentStore: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    totalEntries: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
    departmentSelectionState: PropTypes.object.isRequired,
    departmentSelectionActions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.gridActions = [
      {
        name: 'View',
        onClick: (item) => {
          const { id } = item;
          let { store_id } = this.props.params;
          this.props.actions.clearIvType();
          routeHelper.goInventoryVariance(store_id, id);
        }
      }
    ];
    this.IVTypes = {
      opening: 'Opening',
      actual_qty: 'Adjustment by Actual QTY',
      var_qty: 'Adjustment by Variance QTY',
      cost_adjust: 'Cost Adjustment'
    };

    this.columnMetadatas = [
      {
        columnName: "storeTitle",
        displayName: "STORE NAME"
      },
      {
        columnName: "createdAt",
        displayName: "CREATED AT",
        customComponent: this.timeComponent
      },
      {
        columnName: "effectiveDate",
        displayName: "EFFECTIVE AT",
        customComponent: this.timeComponent
      },
      {
        columnName: "number",
        displayName: "RECORD ID",
        customComponent: this.linkComponent,
      },
      {
        columnName: "name",
        displayName: "RECORD NAME"
      },
      {
        columnName: "humanizedType",
        displayName: "ADJUSTMENT TYPE",
        customComponent: this.capitalizeFirstLetterComponent
      },
      {
        columnName: "createdBy",
        displayName: "CREATED BY"
      },
      {
        columnName: "updatedAt",
        displayName: "LAST UPDATED AT",
        customComponent: this.timeComponent
      },
      {
        columnName: "updatedBy",
        displayName: "LAST UPDATED BY"
      },
      {
        columnName: "approvedBy",
        displayName: "APPROVED BY"
      },
      {
        columnName: "createdBy",
        displayName: "COMMITTED BY"
      },
      {
        columnName: "status",
        displayName: "STATUS",
        customComponent: this.orderStatusComponent,
        customComponentProps: {
          colorTransformer: inventoryVarianceColor,
          labelTransformer: inventoryVarianceLabel,
        }
      }
    ];

    this.filterSettings = this.columnMetadatas
      .filter(col => col.hasOwnProperty('filterConditions'))
      .map(column => pick(column, 'columnName', 'displayName', 'filterConditions'));
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  componentDidMount() {
    let { store_id } = this.props.params;
    let { count, page, filters } = this.props.location.query;

    this.props.actions.load(store_id, page, count, undefined, filters);
  }

  goToPage = (page) => {
    const { store_id } = this.props.params;
    let { count, filters } = this.props.location.query;
    let filterString = FilterHelper.filtersToString(filters);

    this.context.router.push({
      pathname: routeHelper.inventoryVariances(store_id),
      query: {
        page: page,
        count: count,
        filters: filterString
      }
    });
    this.props.actions.changePage(page);
  };

  updateRowsPerPage = (val) => {
    const { store_id } = this.props.params;
    let { filters } = this.props.location.query;
    let filterString = FilterHelper.filtersToString(filters);

    this.context.router.push({
      pathname: routeHelper.inventoryVariances(store_id),
      query: {
        page: 1,
        count: val,
        filters: filterString
      }
    });
    this.props.actions.changeRowsPerPage(val);
  };

  handleTypeChange(event) {
    this.props.actions.changeIVType(event.target.value);
  }

  render() {
    const {
      totalEntries,
      isLoading,
      rowsPerPage,
      currentPage,
      totalPages,
      data,
      departmentSelectionState,
      departmentSelectionActions,
      actions,
    } = this.props;
    const { currentStore } = this.context;
    let ivDepartmentSelectionActions = Object.assign({}, departmentSelectionActions,
      {
        submitDepartmentSelection: () => {
          actions.createInventoryVarianceByDepartments(currentStore);
        }
      });
    let getCustomerHeader = () => {
      return (
        <div>
          <select onChange={ this.handleTypeChange } className="form-control form-control-sm">
            {
              Object.keys(TYPE_LABEL)
                .map(key => <option value={ key } key={ key }>{ TYPE_LABEL[key] }</option>)
            }
          </select>
        </div>
      );
    };

    const btnConfig = [
      {
        content: 'New Inventory Variance',
        permission: '',
        btnType: 'primary',
        onClick: () => {
          this.props.actions.clearIvType();
          departmentSelectionActions.openDepartmentSelection({ selected: [], params: { 'opener': 'inventoryVariance' } });
        },
      }
    ];

    return (
      <MainContent>
        <MainContentHeader title="Inventory Variance">
          <MainContentHeaderButtons config={ btnConfig } />
        </MainContentHeader>
        <SelectDepartment customerHeader={ getCustomerHeader } { ...departmentSelectionState } { ...ivDepartmentSelectionActions } />
        {
          isLoading ? <Loading>Loading...</Loading> :
            <div className="grid">
              <GridBody data={ cloneDeep(data) }
                actions={ this.gridActions }
                columns={ this.columnMetadatas } />
              <GridFooter totalEntries={ totalEntries }
                rowsPerPage={ rowsPerPage }
                currentPage={ currentPage }
                totalPages={ totalPages }
                goToPage={ this.goToPage }
                updateRowsPerPage={ this.updateRowsPerPage } />
            </div>
        }
      </MainContent>
    );
  }
}

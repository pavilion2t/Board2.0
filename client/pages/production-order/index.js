import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GridFooter, GridBody } from '~/components/grid';
import cloneDeep from 'lodash/cloneDeep';
import FilterHelper from '~/helpers/filterHelper';
import routeHelper from '~/helpers/routeHelper';
import CascadeFilterCollection from '~/components/cascade-filter/cascadeFilterCollection';
import Loading from '~/components/loading/loading';
import { pick } from 'lodash';
import {
  statusComponent,
  timeComponent,
  linkComponent,
  capitalizeFirstLetterComponent
} from '~/components/griddle-components';
import {
  getCurrentPermission
} from '~/helpers/permissionHelper';

import * as actions from '~/actions/pageActions/productionOrderIndex';

function mapStateToProp(state) {
  let pageState = state.pages.productionOrderIndex;

  return { ...pageState };
}

function mapDispatchToProp(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

@connect(mapStateToProp, mapDispatchToProp)
@capitalizeFirstLetterComponent
@statusComponent
@timeComponent
@linkComponent
@getCurrentPermission
export default class ProductionOrderIndex extends Component {
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
    filters: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.gridActions = [
      {
        name: 'View',
        onClick: (item) => {
          const { id } = item;
          let { store_id } = this.props.params;
          routeHelper.goProductionOrders(store_id, id);
        }
      },
      {
        name: 'Approve',
        hide: (item) => item.state !== 'created',
        onClick: (item) => {
          const { id } = item;
          let { store_id } = this.props.params;
          this.props.actions.approve(id, store_id)
            .then(resp => {
              const { error } = resp;
              if (error) {
                alert(error.message);
              }
            });
        }
      },
      {
        name: 'Cancel',
        hide: (item) => ['finished', 'canceled'].indexOf(item.state) > -1,
        onClick: (item) => {
          if (!confirm('Do you really want to cancel this order?')) return false;
          const { id } = item;
          let { store_id } = this.props.params;
          this.props.actions.cancel(id, store_id).then(resp => {
            const { error } = resp;
            if (error) {
              alert(error.message);
            }
          });
        }
      },
    ];
    const { store_id } = this.props.params;

    this.columnMetadatas = [{
      columnName: "store",
      displayName: "STORE",
      customComponent: () => {
        const { currentStore } = this.context;
        const { title } = currentStore;
        return (<span>{ title }</span>);
      },
      customComponentProps: {
        pathAccessor: (item) => routeHelper.productionOrders(store_id, item.id)
      }
    }, {
      columnName: "number",
      displayName: "ORDER NUMBER",
      filterConditions: ['equal'],
      customComponent: this.linkComponent
    }, {
      columnName: "humanizedType",
      displayName: "ORDER TYPE",
      customComponent: this.capitalizeFirstLetterComponent
    }, {
      columnName: "createdAt",
      displayName: "CREATED AT",
      customComponent: this.timeComponent
    }, {
      columnName: "state",
      displayName: "STATUS",
      customComponent: this.statusComponent('order'),
    }];

    this.filterSettings = this.columnMetadatas
      .filter(col => col.hasOwnProperty('filterConditions'))
      .map(column => pick(column, 'columnName', 'displayName', 'filterConditions'));
  }

  componentDidMount() {
    let { store_id } = this.props.params;
    let { count, page, filters } = this.props.location.query;

    this.props.actions.load(store_id, page, count, undefined, filters);
  }

  handleCreate = () => {
    let { store_id } = this.props.params;
    routeHelper.goProductionOrders(store_id, 'new');
  };

  handleSearch = (filters) => {
    const { store_id } = this.props.params;
    let { count, page } = this.props.location.query;
    let filterString = FilterHelper.filtersToString(filters);

    this.context.router.push({
      pathname: routeHelper.productionOrders(store_id),
      query: {
        page: page,
        count: count,
        filters: filterString
      }
    });
    this.props.actions.changeFilters(filters);
  };

  goToPage = (page) => {
    const { store_id } = this.props.params;
    let { count, filters } = this.props.location.query;
    let filterString = FilterHelper.filtersToString(filters);

    this.context.router.push({
      pathname: routeHelper.productionOrders(store_id),
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
      pathname: routeHelper.productionOrders(store_id),
      query: {
        page: 1,
        count: val,
        filters: filterString
      }
    });
    this.props.actions.changeRowsPerPage(val);
  };

  render() {
    const {
      totalEntries,
      isLoading,
      rowsPerPage,
      currentPage,
      totalPages
    } = this.props;

    const createPermission = this.getCurrentPermission('production_order:create');
    const { data, filters } = this.props;
    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"/>
          { createPermission && <button className="btn btn-primary btn-sm" onClick={ this.handleCreate }>New</button> }

        </header>
        <div className="main-content -main-filter">
          <CascadeFilterCollection
            group="stations"
            settings={ this.filterSettings }
            filters={ filters }
            onSearch={ this.handleSearch }
          />
        </div>
        <div className="main-content">
          <div>
            { isLoading ?
              (
                <Loading>Loading...</Loading>
              ) : (
              <div className="grid">
                <GridBody data={ cloneDeep(data) }
                          actions={ this.gridActions }
                          columns={ this.columnMetadatas }/>
                <GridFooter totalEntries={ totalEntries }
                            rowsPerPage={ rowsPerPage }
                            currentPage={ currentPage }
                            totalPages={ totalPages }
                            goToPage={ this.goToPage }
                            updateRowsPerPage={ this.updateRowsPerPage }/>
              </div>
            )
            }
          </div>
        </div>
      </div>
    );
  }
}

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';

import Griddle from 'griddle-react';
import FilterHelper from '../../helpers/filterHelper';
import CascadeFilterCollection from '../../components/cascade-filter/cascadeFilterCollection';

import Loading from '../../components/loading/loading';
import AddInvoiceButton from '../../components/add-invoice/add-invoice';
import IndexName from './components/indexName';
import IndexDate from './components/indexDate';
import IndexShipDate from './components/indexShipDate';
import IndexType from './components/indexType';
import IndexQuantity from './components/indexQuantity';
import IndexStatus from './components/indexStatus';

import { ROOT_ROUTE } from './constant';

function noop() { }

const columnMetadatas = [
  {
    columnName: 'order_ids',
    displayName: 'Type',
    customComponent: IndexType,
    // TODO: filter by Type
  },
  {
    columnName: "number",
    displayName: "D.N. Number",
    customComponent: IndexName,
    filterConditions: ['contain']
  },
  {
    columnName: "customer_name",
    displayName: "Customer",
  },
  {
    columnName: 'delivery_order_items',
    displayName: 'Qty',
    customComponent: IndexQuantity,
  },
  {
    columnName: "ship_date",
    customComponent: IndexShipDate,
    displayName: "Delivery Date"
  },
  {
    columnName: 'state',
    displayName: 'Status',
    customComponent: IndexStatus,
    // TODO: filter by status
  },
  {
    columnName: "created_at",
    customComponent: IndexDate,
    displayName: "Created At"
  },
];

// Columns for grid display
const columns = columnMetadatas.map(i => i.columnName);

// Columns for filter
const filterSettings = columnMetadatas
  .filter(i => i.displayName && i.filterConditions)
  .map(i => {
    return {
      columnName: i.columnName,
      displayName: i.displayName,
      filterConditions: i.filterConditions
    };
  });


const mapStateToProps = (state, props) => {
  let pathKey = props.location.pathname + props.location.search;
  let pathState = state.path[pathKey];
  let appState = state;
  let { base: { loading }, entities } = state;
  return { appState, pathState, entities, loading };
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

class DeliveryNoteIndex extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    appState: PropTypes.object.isRequired,
    entities: PropTypes.object,
    pathState: PropTypes.object,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.updateData(this.props);
  }

  componentDidUpdate(prevProps) {
    let pathKey = this.props.location.pathname + this.props.location.search;

    if (prevProps.location.pathname + prevProps.location.search !== pathKey) {
      this.updateData(this.props);
    }
  }

  updateData(props) {
    let { params: {store_id}, location: {pathname, search, query: { count, page, filters }}} = props;
    let filtersObject = FilterHelper.stringToFilters(filters);
    let pathKey = pathname + search;

    props.actions.getDeliveryOrders(store_id, page, count, undefined, filtersObject, pathKey);
  }

  setPage = (index) => {
    let { params: {store_id}, location: { query: { filters }}} = this.props;
    let { pathState: { delivery_orders_meta: { count, totalPages } } } = this.props;
    let page = index >= totalPages ? totalPages : index < 1 ? 1 : index + 1;

    this.context.router.push({
      pathname: `/v2/${store_id}/${ROOT_ROUTE}`,
      query: {
        page: page,
        count: count,
        filters: filters
      }
    });
  }

  handleSearch = (filters) => {
    let { params: {store_id} } = this.props;
    let { pathState: { delivery_orders_meta: { page, count } } } = this.props;
    let filterString = FilterHelper.filtersToQueryString(filters);

    this.context.router.push({
      pathname: `/v2/${store_id}/${ROOT_ROUTE}`,
      query: {
        page: page,
        count: count,
        filters: filterString
      }
    });
  }

  handleFilterSave = (name, filter) => {
    this.props.actions.saveFilter('voucher', name, filter);
  }

  handleFilterRemove = (name) => {
    this.props.actions.removeFilter('voucher', name);
  }

  handleFilterSelected = (selectedFilter) => {
    this.props.actions.updateVoucherFilters(selectedFilter);
  }

  createByInvoice = (invoices = []) => {
    let [{ number: ref_id }] = invoices;
    let { params: { store_id } } = this.props;
    let path = `/v2/${store_id}/${ROOT_ROUTE}/new/for/invoice/${ref_id}`;
    if (store_id && ref_id) {
      this.context.router.push({
        pathname: path
      });
    }
  }

  render() {
    let props = this.props;
    let { location: { query: { filters: filtersStr } } } = props;
    let { pathState = {}, entities = {}, loading } = props;
    let { delivery_orders, delivery_orders_meta = {} } = pathState;
    let { page, count, totalPages } = delivery_orders_meta;
    let filters = FilterHelper.stringToFilters(filtersStr);
    let noDataMessage = filters ? 'No search result' : 'There is no listing data';
    let gridData = (delivery_orders || []).map(id => {
      let {deliveryOrders = {}} = entities;
      let item = deliveryOrders[id];
      return item;
    })
      .filter(item => !!item);

    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Delivery note</h1>
          {
            // TODO: allow filter by Customer
          }
          <AddInvoiceButton
            singleSelect
            onConfirm={ this.createByInvoice }
            filters={ { inventory_status: ['unfulfilled', 'in_transit'] } }
            className="btn btn-primary btn-sm">Create D.N.for Invoice</AddInvoiceButton>
        </header>
        <div className="main-content -main-filter">
          <CascadeFilterCollection
            group="delivery_orders"
            settings={ filterSettings }
            filters={ filters }
            onSearch={ this.handleSearch }
            />
        </div>
        <div className="main-content">
          {
            !loading && delivery_orders ? (
              <div>
                <Griddle
                  useExternal
                  useGriddleStyles={ false }
                  tableClassName="table table-bordered data-table"
                  externalSetPage={ this.setPage }
                  externalChangeSort={ noop }
                  externalSetFilter={ noop }
                  externalSetPageSize={ noop }
                  externalMaxPage={ totalPages }
                  externalCurrentPage={ page - 1 }
                  resultsPerPage={ count }
                  results={ gridData }
                  noDataMessage={ noDataMessage }
                  columns={ columns }
                  columnMetadata={ columnMetadatas }/>
              </div>

            ) : <Loading>Loading delivery note</Loading>
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryNoteIndex);


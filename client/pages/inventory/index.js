import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';
import pick from 'lodash/pick';

import FilterHelper from '../../helpers/filterHelper';
import CascadeFilterCollection from '../../components/cascade-filter/cascadeFilterCollection';
import ListingNameDisplay from './components/listingNameDisplay';
import ListingDepartmentDisplay from './components/listingDepartmentDisplay';

import Loading from '../../components/loading/loading';
import Can from '~/components/can/can';
import { Link } from 'react-router';


const columnMetadatas = [{
  columnName: "name",
  displayName: "PRODUCT NAME",
  customComponent: ListingNameDisplay,
  filterConditions: [ 'contain' ]
},{
  columnName: "brand_name",
  displayName: "BRAND",
  filterConditions: [ 'contain' ]
},{
  columnName: "department_id",
  displayName: "DEPARTMENT ID",
  customComponent: ListingDepartmentDisplay,
  filterConditions: [ 'equal' ]
},{
  columnName: "quantity",
  displayName: "QTY ON SHELF",
  filterConditions: ['equal', 'between']
},{
  columnName: "qty_stockroom",
  displayName: "STOCKROOM QTY",
  filterConditions: ['equal', 'between']
},{
  columnName: "price",
  displayName: "PRICE",
  filterConditions: ['equal', 'between']
},{
  columnName: "gtid",
  displayName: "UPC/EAN",
  hide: true
},{
  columnName: "listing_barcode",
  displayName: "PLU/SKU",
  filterConditions: ['equal', 'contain'],
  hide: true
},{
  columnName: "updated_at",
  displayName: "Updated At",
  filterConditions: ['date_between', 'date_equal'],
  hide: true
}];

const columns = columnMetadatas.filter(i => !i.hide).map(i => i.columnName);
const filterSettings = columnMetadatas
  .filter(column => column.displayName && column.filterConditions && column.filterConditions.length > 0)
  .map(column => pick(column, 'columnName', 'displayName', 'filterConditions'));

filterSettings.push({
  columnName: "upc",
  displayName: "UPC/EAN",
  filterConditions: ['equal', 'contain'],
});

class InventoryIndex extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentDidMount() {
    let {store_id} = this.props.params;
    let {count, page, filters} = this.props.location.query;
    let filtersObject = FilterHelper.stringToFilters(filters);

    this.props.actions.getDepartments(store_id);
    this.props.actions.getListings(store_id, page, count, undefined, filtersObject);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname ||
        this.props.location.search !== nextProps.location.search) {
      let { store_id } = nextProps.params;
      let { count, page, filters } = nextProps.location.query;
      let filtersObject = FilterHelper.stringToFilters(filters);

      this.props.actions.getDepartments(store_id);
      this.props.actions.getListings(store_id, page, count, undefined, filtersObject);
    }
  }

  setPage = (index) => {
    let {store_id} = this.props.params;
    let {count, filters} = this.props.location.query;
    let filtersObject = FilterHelper.stringToFilters(filters);
    let {listingStatus} = this.props.appState;
    let page = index >= listingStatus.totalPages? listingStatus.totalPages : index < 1 ? 1 : index + 1;

    this.props.actions.getListings(store_id, page, count, undefined, filtersObject);
    this.context.router.push({
      pathname: `/v2/${store_id}/inventory`,
      query: {
        page: page,
        count: count,
        filters: filters
      }
    });
  }

  changeSort = (sort, sortAscending) => {}

  setFilter = (filter) => {}

  setPageSize = (size) => {}

  handleSearch = (filters) => {
    let {store_id, page, count} = this.props.params;
    let filterString = FilterHelper.filtersToString(filters);

    this.props.actions.updateFilters(filters);

    this.props.actions.getListings(store_id, page, count, undefined, filters);
    this.context.router.push({
      pathname: `/v2/${store_id}/inventory`,
      query: {
        page: page,
        count: count,
        filters: filterString
      }
    });
  }

  render() {
    let { params, location, appState } = this.props;
    let { listings, entities, listingStatus } = appState;
    let importerPath = `/v2/${params.store_id}/inventory/importer`;
    let newItemPath = `/v2/${params.store_id}/inventory/new`;

    let data = listings.reduce((acc,id) => {
        let listing = entities.listings[id];

        if (listing) {
          acc.push(pick(listing, 'id',
                                 'name',
                                 'store_id',
                                 'image_url',
                                 'gtid',
                                 'brand_name',
                                 'category_name',
                                 'department_id',
                                 'quantity',
                                 'qty_stockroom',
                                 'price',
                                 'listing_barcode'));
        } else {
          console.warn('listing id', id, 'not found in entities');
        }
        return acc;
      }, []);
    let noDataMessage;

    if (location.query.filters) {
      noDataMessage = 'No search result';

    } else {
      noDataMessage = 'There is no listing data';

    }

    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Inventory</h1>
          <Can action="inventory:edit">
            <Link to={ importerPath } className="btn btn-secondary btn-sm">Import</Link>
          </Can>
          &nbsp;
          <Can action="inventory:edit">
            <Link to={ newItemPath } className="btn btn-primary btn-sm">New Item</Link>
          </Can>

        </header>
        <div className="main-content -main-filter">
          <CascadeFilterCollection
            group="inventory"
            settings={ filterSettings }
            filters={ listingStatus.filters }
            onSearch={ this.handleSearch }
            />
        </div>
        <div className="main-content">
          <div>
            { listingStatus.loading ?
              (
                <Loading>Loading listings...</Loading>
              ) : (
                <Griddle
                  useExternal
                  useGriddleStyles={ false }
                  tableClassName="table table-bordered data-table"
                  externalSetPage={ this.setPage }
                  externalChangeSort={ this.changeSort }
                  externalSetFilter={ this.setFilter }
                  externalSetPageSize={ this.setPage }
                  externalMaxPage={ listingStatus.totalPages }
                  externalCurrentPage={ listingStatus.page - 1 }
                  resultsPerPage={ listingStatus.count }
                  noDataMessage={ noDataMessage }
                  results={ data }
                  columns={ columns }
                  columnMetadata={ columnMetadatas }/>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default InventoryIndex;

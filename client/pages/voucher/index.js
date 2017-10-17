import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Griddle from 'griddle-react';

import { getVouchers, updateVoucherFilters } from '../../actions/voucherActions';
import { saveFilter, removeFilter } from '../../actions/savedFiltersActions';
import FilterHelper from '../../helpers/filterHelper';
import CascadeFilterCollection from '../../components/cascade-filter/cascadeFilterCollection';

import Loading from '../../components/loading/loading';
import { Link } from 'react-router';
import IndexName from './components/indexName';
import Dropdown from '~/components/drop-down/dropDown';
import Can from '~/components/can/can';

let LinkComponent = function (props) {
  let { id, store_id } = props.rowData;
  let path = `/v2/${store_id}/vouchers/delete/${id}`;
  return (
    <div>
      <Dropdown>
        <Link key={ id } to={ path } className="dropdown-item text-danger">Delete</Link>
      </Dropdown>
    </div>
  );
};
LinkComponent.propTypes = {
  rowData: PropTypes.object
};


// Voucher list settings
const columnMetadatas = [{
  columnName: "name",
  displayName: "VOUCHER NAME",
  customComponent: IndexName,
  filterConditions: [ 'contain' ]
},{
  columnName: "face_value",
  displayName: "FACE VALUE"
},{
  columnName: "revenue_recognition",
  displayName: "REVENUE RECOGNITION"
},{
  columnName: "sold_qty",
  displayName: "SOLD QTY"
},{
  columnName: "redeemed_qty",
  displayName: "REDEEMED QTY",
},{
  columnName: "pending_qty",
  displayName: "PENDING QTY",
},{
  columnName: "",
  displayName: "",
  customComponent: LinkComponent,
}];

// Columns for grid display
const columns = columnMetadatas.filter(i => !i.hide)
                               .map(i => i.columnName);

// Columns for filter
const filterSettings = columnMetadatas
  .filter(i => i.displayName && i.filterConditions && i.filterConditions.length > 0)
  .map(i => {
    return {
      columnName: i.columnName,
      displayName: i.displayName,
      filterConditions: i.filterConditions
    };
  });

class VoucherIndex extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    voucher: PropTypes.object.isRequired,
    vouchers: PropTypes.array,
    savedFilters: PropTypes.object,
    params: PropTypes.shape({
      store_id: PropTypes.string.isRequired
    }).isRequired,
    actions: PropTypes.shape({
      getVouchers: PropTypes.func.isRequired,
      updateVoucherFilters: PropTypes.func.isRequired,
      saveFilter: PropTypes.func.isRequired,
      removeFilter: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        count: PropTypes.string,
        page: PropTypes.string,
        filters: PropTypes.string
      })
    }).isRequired
  };

  componentWillMount() {
    const { store_id } = this.props.params;
    const { count, page, filters } = this.props.location.query;
    const filtersObject = FilterHelper.stringToFilters(filters);
    const { getVouchers } = this.props.actions;

    getVouchers(store_id, page, count, undefined, filtersObject);
  }

  setPage = (index) => {

    const { store_id } = this.props.params;
    const { count, filters } = this.props.location.query;
    const filtersObject = FilterHelper.stringToFilters(filters);
    const { criteria } = this.props.voucher;
    const page = index >= criteria.totalPages? criteria.totalPages : index < 1 ? 1 : index + 1;
    const { getVouchers } = this.props.actions;

    getVouchers(store_id, page, count, undefined, filtersObject);
    this.context.router.push({
      pathname: `/v2/${store_id}/vouchers`,
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

  handleFiltersChange = (filters) => {
    const { updateVoucherFilters } = this.props.actions;

    updateVoucherFilters(filters);
  }

  handleSearch = () => {
    const { store_id } = this.props.params;
    const { count, page } = this.props.location.query;
    const { filters } = this.props.voucher.criteria;
    const filterString = FilterHelper.filtersToQueryString(filters);
    const { getVouchers } = this.props.actions;

    getVouchers(store_id, page, count, undefined, filters);
    this.context.router.push({
      pathname: `/v2/${store_id}/vouchers`,
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

  render() {
    const { store_id } = this.props.params;

    const {
      voucher: {
        criteria,
        fetchingData
      },
      vouchers,
    } = this.props;


    // Show loading if still fetching
    if (fetchingData) {
      return <Loading>Loading vouchers...</Loading>;
    }
    const path = `/v2/${store_id}/vouchers/new`;

    let noDataMessage;

    if (this.props.location.query.filters) {
      noDataMessage = 'No search result';

    } else {
      noDataMessage = 'There is no listing data';

    }

    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Vouchers</h1>
          <Can action="voucher:create"><Link to={ path } className="btn btn-primary btn-sm">New Voucher</Link></Can>
        </header>
        <div className="main-content -main-filter">
          <CascadeFilterCollection
            group="voucher"
            settings={ filterSettings }
            filters={ criteria.filters }
            onSearch={ this.handleSearch }
            />
        </div>
        <div className="main-content">
          <div>
            <Griddle
              useExternal
              useGriddleStyles={ false }
              tableClassName="table table-bordered data-table"
              externalSetPage={ this.setPage }
              externalChangeSort={ this.changeSort }
              externalSetFilter={ this.setFilter }
              externalSetPageSize={ this.setPage }
              externalMaxPage={ criteria.totalPages }
              externalCurrentPage={ criteria.page - 1 }
              resultsPerPage={ criteria.perPage }
              results={ vouchers }
              noDataMessage={ noDataMessage }
              columns={ columns }
              columnMetadata={ columnMetadatas }/>
          </div>
        </div>
      </div>
    );
  }
}

const cookVouchers = (currentVouchers, vouchers) => {
  let mappedVouchers;

  try {
    mappedVouchers = currentVouchers.map(i => vouchers[i]);

  } catch (e) {
    mappedVouchers = [];
  }

  return mappedVouchers;
};

const mapStateToProps = (state) => {
  const { voucher, savedFilters, entities } = state;
  return {
    voucher: voucher,
    vouchers: cookVouchers(voucher.currentVouchers, entities.vouchers),
    savedFilters: savedFilters.voucher
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = { getVouchers, updateVoucherFilters, saveFilter, removeFilter };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VoucherIndex);

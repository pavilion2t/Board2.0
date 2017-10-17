import './addListing.scss';

import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import map from 'lodash/map';
import compact from 'lodash/compact';
import Griddle from 'griddle-react';

import filterHelper from '~/helpers/filterHelper';

import ActionButton from '../action-button/action-button';
import inventoryService from '~/services/inventoryService';
import CascadeFilterCollection from '~/components/cascade-filter/cascadeFilterCollection';
import Loading from '~/components/loading/loading';
import AddListingByBarcode from '~/components/add-listing-by-barcode';

const filterSettings = [
  {
    columnName: "name",
    displayName: "PRODUCT NAME",
    filterConditions: [ 'contain' ]
  },{
    columnName: "brand_name",
    displayName: "BRAND",
    filterConditions: [ 'contain' ]
  },{
    columnName: "department_id",
    displayName: "DEPARTMENT ID",
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
    filterConditions: ['equal', 'contain'],
  },{
    columnName: "listing_barcode",
    displayName: "PLU/SKU",
    filterConditions: ['equal', 'contain'],
  },{
    columnName: "updated_at",
    displayName: "Updated At",
    filterConditions: ['date_between', 'date_equal'],
}];

class AddListingButton extends Component {
  static propTypes = {
    children:    PropTypes.node,
    onSave:      PropTypes.func,
    withBarcode: PropTypes.bool,
    baseSearch:  PropTypes.shape({
      query:    PropTypes.object,
      wildcard: PropTypes.object,
      range:    PropTypes.object,
      missing:  PropTypes.object,
      fields:   PropTypes.arrayOf(PropTypes.string),
      sort:     PropTypes.arrayOf(PropTypes.object),
    }),
  };

  static contextTypes = {
    currentStore: React.PropTypes.object.isRequired
  }

  state = {
    searchListing: false,
    listings: null,
    advanceSearch: false,
    currentFilters: [],
    currentPage: 0,
    totalPages: 1,
    loading: false,
  };

  listingCheckboxs = {}

  closeModal = () => {
    this.setState({
      searchListing: false
    });
  }
  openModal = () => {
    this.setState({
      listings: null,
      searchListing: true
    });
  }
  advanceSearch = () => {
     this.setState({
      advanceSearch: true
    });
  }
  simpleSearch = () => {
     this.setState({
      advanceSearch: false
    });
  }

  save = () => {
    let checkedIds = compact(map(this.listingCheckboxs, (checkbox, id) => checkbox && checkbox.checked ? id : null));
    let products = checkedIds.map(id => this.state.listings.find(listing => listing.id == id));
    this.props.onSave && this.props.onSave(products);
    this.closeModal();
  }

  onAddByBarcode = (listings) => {
    this.props.onSave && this.props.onSave(listings);
  }

  search = (event) => {
    event.preventDefault();

    let { value }  = this.refs.keyword;

    if (!value.trim()) {
      return;
    }

    let filters = [{
      column: "name",
      condition: "contain",
      conditionValue: value,
    }];

    this.searchByFilter(filters);
  }
  setSearchPage = (index) => {
    let page = index + 1;
    this.searchByFilter(this.state.currentFilters, page);
    this.setState({
      currentPage: index,
    });
  }

  searchByFilter = (filters, page = 1) => {
    const { baseSearch } = this.props;
    const baseFilter = filterHelper.searchParamToFilters(baseSearch);
    const combinedFilters = [].concat(filters||[], baseFilter||[]);
    this.setState({loading: true});

    let store_id = this.context.currentStore.id;
    inventoryService.search(store_id, page, 50, undefined, combinedFilters).then(res => {
      this.setState({
        listings: res.data,
        currentFilters: filters,
        currentPage: res.page - 1,
        totalPages: res.totalPages,
        loading: false,
      });
    }).catch(e => {
      this.setState({loading: false});
    });
  }

  render() {
    let listingCheckboxs = this.listingCheckboxs;

    function noop() {}

    function listingCheckbox(props) {
      let id = props.rowData.id;
      return <input type="checkbox" ref={ (c) => listingCheckboxs[id] = c }/>;
    }

    const columnMetadatas = [
      {
        columnName: "name",
        displayName: "PRODUCT NAME",
      },{
        columnName: "price",
        displayName: "PRICE",
      },{
        columnName: "quantity",
        displayName: "QTY ON SHELF",
      },{
        columnName: "id",
        displayName: "SELECT",
        customComponent: listingCheckbox,
    }];
    const columns = columnMetadatas.map(c => c.columnName);

    let { children, withBarcode, baseSearch } = this.props;
    const { currentStore = {} } = this.context;
    const { id: storeId } = currentStore;
    return (
      <span>
        <ActionButton type="add" onClick={ this.openModal }>{ children }</ActionButton>

        {
          !withBarcode ? null :
            <AddListingByBarcode storeId={ storeId } baseSearch={ baseSearch } onAdd={ this.onAddByBarcode } />
        }


        <Modal className="ReactModal__Content--fixed" isOpen={ this.state.searchListing } onRequestClose={ this.closeModal }>
          <div className="modal-content">
            <div className="modal-header">
              <div className="row">
                <div className="col-md-7">
                 <h5 className="modal-title">Select Inventory</h5>
                </div>
                <div className="col-md-5 align-right">
                  {
                    this.state.advanceSearch ? (
                      <button className="btn btn-link" onClick={ this.simpleSearch }>simple</button>
                    ) : (
                      <form className="form-inline align-right" onSubmit={ this.search }>
                        <div className="input-group">
                          <input type="text" className="form-control" placeholder="Enter inventory name" ref="keyword" />
                          <div className="input-group-addon">
                            <a className="a small" onClick={ this.advanceSearch }>advance</a>
                          </div>

                        </div>
                        &nbsp; <button className="btn btn-secondary">Search</button>
                      </form>
                    )
                  }
                </div>
              </div>
              {
                this.state.advanceSearch ?
                  <CascadeFilterCollection
                    settings={ filterSettings }
                    filters={ this.state.currentFilters }
                    group="inventory"
                    onSearch={ this.searchByFilter }
                    /> : null
              }
            </div>
            <div className="modal-body">
            {
              !this.state.listings ? (
                <div className="card-block">
                  <p>Search for inventory you need.</p>
                </div>

              ) : (
                <Griddle
                  useExternal
                  externalSetPage={ this.setSearchPage }
                  externalChangeSort={ noop }
                  externalSetFilter={ noop }
                  externalSetPageSize={ noop }
                  externalMaxPage={ this.state.totalPages }
                  externalCurrentPage={ this.state.currentPage }

                  useGriddleStyles={ false }
                  tableClassName="table table-bordered data-table"
                  results={ this.state.listings }
                  columns={ columns }
                  columnMetadata={ columnMetadatas }
                  noDataMessage="No search result"
                />
              )
            }
            </div>
            <div className="modal-footer">
              <span className="btn btn-sm btn-secondary" onClick={ this.closeModal }>Cancel</span> &nbsp;
              <button className="btn btn-sm btn-primary" onClick={ this.save }>Save</button>
            </div>
            {
              this.state.loading ? <div className="mask"><Loading /></div> : null
            }
          </div>
        </Modal>
      </span>
    );
  }
}


export default AddListingButton;

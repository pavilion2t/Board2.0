import './select-customer.scss';

import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import findKey from 'lodash/findKey';
import Griddle from 'griddle-react';
import { decamelizeKeys } from 'humps';

import customerService from '~/services/customerService';
import CascadeFilterCollection from '~/components/cascade-filter/cascadeFilterCollection';
import Loading from '~/components/loading/loading';

const filterSettings = [
  {
    columnName: "name",
    displayName: "CUSTOMER NAME",
    filterConditions: [ 'contain' ]
  },
  {
    columnName: "phone",
    displayName: "PHONE",
    filterConditions: [ 'contain' ]
  },
  {
    columnName: "address",
    displayName: "ADDRESS",
    filterConditions: [ 'equal' ]
  },
  {
    columnName: "customer_code",
    displayName: "CUSTOMER CODE",
    filterConditions: ['equal']
  },
];

class SelectCustomer extends Component {
  static propTypes = {
    customer: PropTypes.object,
    children: PropTypes.node,
    onSave: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool,
  };

  static contextTypes = {
    currentStore: React.PropTypes.object.isRequired
  }

  state = {
    searchListing: false,
    customers: null,
    selectedCustomer: null,
    advanceSearch: false,
    currentFilters: [],
    currentPage: 0,
    totalPages: 1,
    loading: false,
  };

  componentWillReceiveProps = (nextProps) => {
    const oldCust = this.props.customer || {};
    const newCust = decamelizeKeys(nextProps.customer || {});
    if (oldCust.id != newCust.id) {
      this.setState({ selectedCustomer: newCust });
    }
  }

  listingCheckboxs = {}

  closeModal = () => {
    this.setState({
      searchListing: false
    });
  }
  openModal = () => {
    this.setState({
      customers: null,
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
  resetCustomer = () => {
     this.setState({
      selectedCustomer: {}
    });
    this.props.onChange && this.props.onChange(null);
  }

  save = () => {
    let checkedId = findKey(this.listingCheckboxs, (checkbox, id) => checkbox && checkbox.checked);
    let customer = this.state.customers.find(listing => listing.id == checkedId);
    this.setState({
      selectedCustomer: { customer_name: customer.name }
    });
    this.props.onSave && this.props.onSave(customer);
    this.props.onChange && this.props.onChange(customer);
    this.props.onBlur && this.props.onBlur(customer);
    this.closeModal();
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
    this.setState({loading: true});
    let store_id = this.context.currentStore.id;
    customerService.search(store_id, page, 50, undefined, filters).then(res => {
      this.setState({
        customers: res.data,
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
      let id = props.data;
      return <input type="radio" name="input-radio" ref={ (c) => listingCheckboxs[id] = c }/>;
    }

    const columnMetadatas = [
      {
        columnName: "name",
        displayName: "PRODUCT NAME",
      },{
        columnName: "address",
        displayName: "ADDRESS",
      },{
        columnName: "phone",
        displayName: "PHONE",
      },{
        columnName: "id",
        displayName: "SELECT",
        customComponent: listingCheckbox,
    }];
    const columns = columnMetadatas.map(c => c.columnName);
    let selectedCustomer = this.state.selectedCustomer || this.props.customer || {};
    const { readOnly } = this.props;

    return (
      <span>

        <div className="form-group">
          <div className="input-group">
            <input type="text" className="form-control"
              value={ selectedCustomer.customer_name || selectedCustomer.name || '' }
              onClick={ readOnly ? noop : this.openModal }
              onChange={ noop }
              readOnly={ readOnly } />
            {
              readOnly ? null :
                <div className="input-group-addon a" onClick={ this.resetCustomer }>&times;</div>
            }
          </div>
        </div>
        <Modal className="ReactModal__Content--fixed" isOpen={ this.state.searchListing } onRequestClose={ this.closeModal }>
          <div className="modal-content">
            <div className="modal-header">
              <div className="row">
                <div className="col-md-7">
                 <h5 className="modal-title">Select customer</h5>
                </div>
                <div className="col-md-5 align-right">
                  {
                    this.state.advanceSearch ? (
                      <button className="btn btn-link" onClick={ this.simpleSearch }>simple</button>
                    ) : (
                      <form className="form-inline align-right" onSubmit={ this.search }>
                        <div className="input-group">
                          <input type="text" className="form-control" placeholder="Enter customer name" ref="keyword" />
                          <div className="input-group-addon">
                            <a className="a small" onClick={ this.advanceSearch }>advance</a>
                          </div>

                        </div>
                        &nbsp; <button className="btn btn-secondary btn-sm">Search</button>
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
                    group="customer"
                    onSearch={ this.searchByFilter }
                    /> : null
              }
            </div>
            <div className="modal-body">
            {
              !this.state.customers ? (
                <div className="card-block">
                  <p>Search for customer you need.</p>
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
                  results={ this.state.customers }
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


export default SelectCustomer;

import './add-invoice.scss';

import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import map from 'lodash/map';
import compact from 'lodash/compact';
import Griddle from 'griddle-react';


import ActionButton from '../action-button/action-button';
import OrderCorrespondenceService from '~/services/orderCorrespondenceService';
import Loading from '~/components/loading/loading';

const RAND = () => (new Date()).getTime();

function noop() { }

function listingCheckboxFactory(scope, name, singleSelect, refsMap) {
  const listingCheckbox = (props) => {
    let id = props.rowData.id;
    return (
      <input type={ singleSelect ? 'radio' : 'checkbox' }
        name={ name }
        data-orderid={ id }
        ref={ (c) => refsMap[id] = c } />
    );
  };
  listingCheckbox.propTypes = {
    rowData: PropTypes.object,
  };
  return listingCheckbox;
}


class AddInvoiceButton extends Component {
  static propTypes = {
    children: PropTypes.node,
    onConfirm: PropTypes.func,
    singleSelect: PropTypes.bool,
    className: PropTypes.string,
    filters: PropTypes.shape({
      inventory_status: PropTypes.arrayOf(
        PropTypes.oneOf(['in_transit', 'unfulfilled', 'fulfilled', 'cancel', 'return'])
      ),
      customer_id: PropTypes.number,
    }),
    excludeInvoices: PropTypes.arrayOf(PropTypes.number),
  };

  static contextTypes = {
    currentStore: React.PropTypes.object.isRequired
  }

  state = {
    isOpen: false,
    listings: null,
    currentFilters: [],
    currentPage: 0,
    totalPages: 1,
    loading: false,
  };

  listingCheckboxs = {}

  closeModal = () => {
    this.setState({
      isOpen: false
    });
  }
  openModal = () => {
    this.setState({
      listings: null,
      isOpen: true,
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

  confirm = () => {
    let checkedIds = compact(map(this.listingCheckboxs, (checkbox, id) => checkbox && checkbox.checked ? id : null));
    let invoices = checkedIds.map(id => this.state.listings.find(listing => listing.id == id));
    this.props.onConfirm && this.props.onConfirm(invoices);
    this.closeModal();
  }

  search = (event) => {
    event.preventDefault();

    const { value: number } = this.refs.keyword;
    const { value: correspondence_state } = this.refs.status;
    const { filters = {} } = this.props;
    const { inventory_status, customer_id } = filters;
    let filtersObj = { number, correspondence_state, inventory_status, customer_id };
    filtersObj = Object.keys(filtersObj).reduce((ret, key) => {
      let value = filtersObj[key];
      if (value != null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
        ret[key] = value;
      }
      return ret;
    }, {});

    this.searchByFilter(filtersObj);
  }

  setPage = (index) => {
    let page = index + 1;
    this.searchByFilter(this.state.currentFilters, page);
    this.setState({
      currentPage: index,
    });
  }

  searchByFilter = (filters, page = 1) => {
    this.setState({ loading: true });

    let store_id = this.context.currentStore.id;
    let { excludeInvoices = []} = this.props;
    OrderCorrespondenceService.getList(store_id, page, 50, undefined, [], filters).then(res => {
      let { result = [], meta = {}, entities: { orderCorrespondences = {} } } = res;
      let { page, totalPages } = meta;
      let gridData = result
        .map(id => orderCorrespondences[id])
        .filter(d => !!d)
        .filter(d => excludeInvoices.indexOf(d.id) < 0);
      this.setState({
        listings: gridData,
        currentFilters: filters,
        currentPage: page - 1,
        totalPages: totalPages,
        loading: false,
      });
    }).catch(e => {
      console.error(Error(e));
      this.setState({ loading: false });
    });
  }

  render() {
    let { children, singleSelect = false, className } = this.props;

    const columnMetadatas = [
      {
        columnName: "customer_name",
        displayName: "CUSTOMER",
      }, {
        columnName: "number",
        displayName: "ORDER NUMBER",
      }, {
        columnName: "id",
        displayName: "REFERENCE NUMBER",
      },
      {
        columnName: "billed_total",
        displayName: "AMOUNT",
      },
      {
        columnName: " ",
        displayName: "",
        customComponent: listingCheckboxFactory(this, `add-invoice__checkbox--${RAND()}`, singleSelect, this.listingCheckboxs),
      }];
    const columns = columnMetadatas.map(c => c.columnName);
    return (
      <span>
        {
          className && className !== '' ?
            <a className={ className } onClick={ this.openModal }>{ children }</a>
            :
            <ActionButton type="add" onClick={ this.openModal }>{ children }</ActionButton>
        }

        <Modal className="ReactModal__Content--fixed" isOpen={ this.state.isOpen } onRequestClose={ this.closeModal }>
          <div className="modal-content">
            <div className="modal-header">
              <div className="row">
                <div className="col-md-7">
                  <h5 className="modal-title">Select Invoice</h5>
                </div>
                <div className="col-md-5 align-right">
                  {
                    <form className="form-inline align-right" onSubmit={ this.search }>
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="Enter invoice number" ref="keyword" />
                      </div>
                      <button className="btn btn-secondary">Search</button>
                    </form>
                  }
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <form className="form-group align-left">
                    <div className="form-group">
                      <select ref="status" className="form-control">
                        <option key="0" value="">All Status</option>
                        <option key="1" value="partial_paid">Partial Paid</option>
                        <option key="2" value="unpaid">Unpaid</option>
                        <option key="3" value="paid">Paid</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>

            </div>
            <div className="modal-body">

              {
                !this.state.listings ? (
                  <div className="card-block">
                    <p>Search for invoice you need.</p>
                  </div>

                ) : (
                    <Griddle
                      useExternal
                      useGriddleStyles={ false }
                      tableClassName="table table-bordered data-table"
                      externalSetPage={ this.setPage }
                      externalChangeSort={ noop }
                      externalSetFilter={ noop }
                      externalSetPageSize={ noop }
                      externalMaxPage={ this.state.totalPages }
                      externalCurrentPage={ this.state.currentPage }
                      resultsPerPage={ this.state.count }
                      results={ this.state.listings }
                      noDataMessage={ 'No search result' }
                      columns={ columns }
                      columnMetadata={ columnMetadatas }
                      />
                  )
              }
            </div>
            <div className="modal-footer">
              <span className="btn btn-sm btn-secondary" onClick={ this.closeModal }>Cancel</span> &nbsp;
              <button className="btn btn-sm btn-primary" onClick={ this.confirm }>Done</button>
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


export default AddInvoiceButton;

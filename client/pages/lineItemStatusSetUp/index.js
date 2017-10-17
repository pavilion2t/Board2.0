import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import values from 'lodash/values';

import AddLineItemStatus from './addLineItemStatus';
import { GridBody } from '~/components/grid';

import Loading from '~/components/loading/loading';
import * as addLineItemStatusActions from '~/actions/formActions/addLineItemStatus';
import { removeLineItemStatus, getLineItemStatuses } from '~/actions/lineItemStatusAction';
import { dateTime } from '~/helpers/formatHelper';

function mapStateToProps(state, ownProps) {
  const { entities } = state;
  let lineItemStatuses = [];

  if (entities.lineItemStatuses) {
    lineItemStatuses = values(entities.lineItemStatuses);
  }

  return {
    addLineItemStatusState: state.forms.addLineItemStatus,
    lineItemStatuses
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addLineItemStatusActions: bindActionCreators(addLineItemStatusActions, dispatch),
    removeLineItemStatus: bindActionCreators(removeLineItemStatus, dispatch),
    getLineItemStatuses: bindActionCreators(getLineItemStatuses, dispatch),
  };
}

class LineItemStatusSetUp extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    currentStore: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    lineItemStatuses: PropTypes.array.isRequired,
    addLineItemStatusState: PropTypes.object.isRequired,

    addLineItemStatusActions: PropTypes.object.isRequired,
    removeLineItemStatus: PropTypes.func.isRequired,
    getLineItemStatuses: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
    this.gridActions = [
      { name: 'Edit', onClick: (item) => {
        let { store_id } = this.props.params;
        this.props.addLineItemStatusActions.openAddLineItemStatus({ storeId: store_id, initialValues: item, isCreating: false });
      } },
      { name: 'Remove', onClick: (item) => {
        if (!confirm('Do you really want to remove this item?')) return false;
        const { id, store_id } = item;
        this.props.removeLineItemStatus(id, store_id).then(resp => {
          const { error } = resp;
          if (error) {
            alert('Remove item successfully.');
          } else {
            alert('Remove item failed.');
          }
        });
      } },
    ];

    this.columns = [
      { columnName: 'status', displayName:  'TITLE' },
      { columnName: 'created_at', displayName:  'CREATED AT', customComponent: this.timeFormatter },
    ];
  }

  componentDidMount() {
    let { store_id } = this.props.params;
    this.props.getLineItemStatuses(store_id).then(() => {
      this.setState({ loading: false });//eslint-disable-line react/no-did-mount-set-state
    });
  }

  handleCreate = () => {
    let { store_id } = this.props.params;
    this.props.addLineItemStatusActions.openAddLineItemStatus({ storeId: store_id, isCreating: true });
  };

  timeFormatter = (props) => {
    const { data } = props;//eslint-disable-line react/prop-types
    let timezine = this.context.currentStore && this.context.currentStore.timezone;
    return <span>{ dateTime(data, timezine) }</span>;
  };

  render() {
    const { addLineItemStatusState, addLineItemStatusActions, lineItemStatuses } = this.props;
    const { loading } = this.state;
    return (
      <div className="main-content">
        <AddLineItemStatus { ...addLineItemStatusState } { ...addLineItemStatusActions } />
        <div className="main-content-tab">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active">Overview</a>
            </li>

          </ul>
        </div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"/>
          <div>
            <button className="btn btn-secondary btn-sm"
                    onClick={ () => {} }
                    type="submit">Cancel</button>
              &nbsp;
            <button className="btn btn-primary btn-sm"
                    onClick={ this.handleCreate }
                    type="submit">New Line Item Status</button>
          </div>
        </header>
        <div className="main-content-section ">
          { loading ?
            (
              <Loading>Loading...</Loading>
            ): (
            <div className="grid">
              <GridBody data={ lineItemStatuses }
                        selectable={ false }
                        actions={ this.gridActions }
                        columns={ this.columns }/>
            </div>
          ) }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineItemStatusSetUp);


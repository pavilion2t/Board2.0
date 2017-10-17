import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import pick from 'lodash/pick';
import keys from 'lodash/keys';
import cloneDeep from 'lodash/cloneDeep';

import Loading from '~/components/loading/loading';
import { GridBody } from '~/components/grid';
import { Link } from 'react-router';

import * as actions from '~/actions/uomGroupActions';
import { dateTime } from '~/helpers/formatHelper';
import routeHelper from '~/helpers/routeHelper';

class UomGroupIndex extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    getGroups: PropTypes.func.isRequired,
    removeGroup: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };

    this.gridActions = [
      {
        name: 'View', onClick: (item) => {
        const { id } = item;
        const { store_id } = this.props.params;
        routeHelper.goUomGroups(store_id, id);
      }
      },
      {
        name: 'Delete', onClick: (item) => {
        if (!confirm('Do you really want to delete this item?')) return false;
        this.props.removeGroup(item.id, this.props.params.store_id)
          .then(resp => {
            const { error } = resp;
            if (error) alert(error.message);
          });
      }
      },
    ];

    this.columnMetadatas = [{
      columnName: "name",
      displayName: "GROUP NAME",
      filterConditions: ['contain', 'equal'],
      customComponent: (props) => {
        const { rowData, data } = props;//eslint-disable-line react/prop-types
        const { id } = rowData;
        const { store_id } = this.props.params;
        let path = routeHelper.uomGroups(store_id, id);
        return (<Link to={ path }>{ data }</Link>);
      }
    }, {
      columnName: "updatedAt",
      displayName: "LAST UPDATE",
      filterConditions: ['equal'],
      customComponent: (props) => {
        let { data } = props;//eslint-disable-line react/prop-types
        let timezine = this.context.currentStore && this.context.currentStore.timezone;
        return <span>{ dateTime(data, timezine) }</span>;
      }
    }];

    this.filterSettings = this.columnMetadatas
      .map(column => pick(column, 'columnName', 'displayName', 'filterConditions'));
  }

  componentDidMount() {
    let { store_id } = this.props.params;
    this.props.getGroups(store_id)
      .then(resp => {
        const { error } = resp;
        if (error) alert(error.message);
        this.setState({ isLoading: false });// eslint-disable-line react/no-did-mount-set-state
      });
  }

  handleCreate = () => {
    let { store_id } = this.props.params;
    routeHelper.goUomGroups(store_id, 'new');
  };

  render() {
    const { data } = this.props;
    const { isLoading } = this.state;

    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"> </h1>
          <button className="btn btn-primary btn-sm" onClick={ this.handleCreate }>New</button>
        </header>
        <div className="main-content">
          <div>
            { isLoading ?
              (
                <Loading>Loading ...</Loading>
              ) : (
              <div className="grid">
                <GridBody data={ cloneDeep(data) }
                          actions={ this.gridActions }
                          columns={ this.columnMetadatas } />
              </div>
            )
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let data = [];
  if (state.entities.uomGroups){
    keys(state.entities.uomGroups).forEach(key => {
      data.push(state.entities.uomGroups[key]);
    });
  }
  return { data };
}

function mapDispatchToProps(dispatch) {
  return {
    getGroups: bindActionCreators(actions.getGroups, dispatch),
    removeGroup:  bindActionCreators(actions.remove, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UomGroupIndex);

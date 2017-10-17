import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import values from 'lodash/values';

import routeHelper from '~/helpers/routeHelper';

import Loading from '~/components/loading/loading';
import OverviewForm from './components/overviewForm';
import SelectDepartment from '~/components/select-department/selectDepartment';
import SelectStatus from './components/selectStatus';

import { getStation } from '~/actions/kdsActions';
import { getDepartments } from '~/actions/departmentActions';
import { getLineItemStatuses } from '~/actions/lineItemStatusAction';
import * as departmentSelectionActions from '~/actions/formActions/departmentSelection';
import * as statusSelectionActions from '~/actions/formActions/statusSelection';
import * as stationOverviewActions from '~/actions/formActions/stationOverview';

function mapStateToProps(state, ownProps) {
  const { params } = ownProps;
  const { station_id } = params;

  const { kdsStatus, entities, forms } = state;
  let departments = [];
  let station = {};

  if (entities.departments) {
    departments = values(entities.departments);
  }
  if (entities.stations) {
    station = entities.stations[station_id];
  }

  return {
    kdsStatus,
    departments,
    station,
    overviewState: forms.stationOverview,
    departmentSelectionState: forms.departmentSelection,
    statusSelectionState: forms.statusSelection
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getStation: bindActionCreators(getStation, dispatch),
    getDepartments: bindActionCreators(getDepartments, dispatch),
    getLineItemStatuses: bindActionCreators(getLineItemStatuses, dispatch),
    departmentSelectionActions: bindActionCreators(departmentSelectionActions, dispatch),
    statusSelectionActions: bindActionCreators(statusSelectionActions, dispatch),
    stationOverviewActions: bindActionCreators(stationOverviewActions, dispatch),
  };
}

class SettingsBusinessKdsItem extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    kdsStatus: PropTypes.object.isRequired,
    departments: PropTypes.array.isRequired,
    station: PropTypes.object.isRequired,
    overviewState: PropTypes.object.isRequired,
    departmentSelectionState: PropTypes.object.isRequired,
    statusSelectionState: PropTypes.object.isRequired,

    getStation: PropTypes.func.isRequired,
    getDepartments: PropTypes.func.isRequired,
    getLineItemStatuses: PropTypes.func.isRequired,
    departmentSelectionActions: PropTypes.object.isRequired,
    statusSelectionActions: PropTypes.object.isRequired,
    stationOverviewActions: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    const { params, station } = this.props;
    const { getStation, getDepartments, getLineItemStatuses, stationOverviewActions } = this.props;
    const { station_type } = station;
    const { store_id, station_id } = params;

    const isKds = !station_type;

    if (isKds) {
      getDepartments(store_id);
      getLineItemStatuses(store_id);
    }

    if (!station.station_key) {
      getStation(station_id, store_id).then(result => {
        const { station, error } = result;
        if (!error) {
          stationOverviewActions.showStationOverview(station);
        }
      });
    } else {
      stationOverviewActions.showStationOverview(station);
    }
  }

  goBack = () => {
    const { params } = this.props;
    const { store_id } = params;
    routeHelper.goStations(store_id);
  };

  render() {
    const {
      params,
      kdsStatus,
      overviewState,
      stationOverviewActions,
      departmentSelectionState,
      departmentSelectionActions,
      statusSelectionState,
      statusSelectionActions
    } = this.props;

    const { store_id } = params;

    return (
    <div className="main-content">
      <SelectDepartment { ...departmentSelectionState } { ...departmentSelectionActions } />
      <SelectStatus store_id={ store_id } { ...statusSelectionState } { ...statusSelectionActions } />
      <div className="main-content-tab">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active">Overview</a>
          </li>

        </ul>
      </div>
      { kdsStatus.loading ?
        (
          <Loading>Loading...</Loading>
        ) : (
          <OverviewForm openDepartmentSelection={ departmentSelectionActions.openDepartmentSelection }
                        openStatusSelection={ statusSelectionActions.openStatusSelection }
                        store_id={ store_id }
                        discard={ this.goBack }
                        { ...overviewState }
                        { ...stationOverviewActions } />
      ) }
    </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SettingsBusinessKdsItem);

import { updateStation } from '~/actions/kdsActions';

export const SHOW_STATION_OVERVIEW = 'SHOW_STATION_OVERVIEW';
export const DISCARD_STATION_OVERVIEW = 'DISCARD_STATION_OVERVIEW';
export const CHANE_STATION_NAME = 'CHANE_STATION_NAME';
export const CHANGE_SHOW_IN_PROGRESS_STATE = 'CHANGE_SHOW_IN_PROGRESS_STATE';
export const SELECT_DISPLAY_VIEW = 'SELECT_DISPLAY_VIEW';
export const ADD_MATCHING_CRITERIA = 'ADD_MATCHING_CRITERIA';
export const CHANGE_PRIORITY = 'CHANGE_PRIORITY';
export const TOGGLE_AGGREGATION = 'TOGGLE_AGGREGATION';
export const CHANGE_AGGREGATION_TIME = 'CHANGE_AGGREGATION_TIME';
export const CHANGE_MATCHING_CRITERIA = 'CHANGE_MATCHING_CRITERIA';

export const SUBMIT_STATION_OVERVIEW_REQUEST = 'SUBMIT_STATION_OVERVIEW_REQUEST';
export const SUBMIT_STATION_OVERVIEW_SUCCESS = 'SUBMIT_STATION_OVERVIEW_SUCCESS';
export const SUBMIT_STATION_OVERVIEW_FAILURE = 'SUBMIT_STATION_OVERVIEW_FAILURE';

export const showStationOverview = (station) => ({ type: SHOW_STATION_OVERVIEW, station });

export const changeStationName = (value) => ({ type: CHANE_STATION_NAME, value });

export const changeShowInProgressState = (value) => ({ type: CHANGE_SHOW_IN_PROGRESS_STATE, value });

export const selectDisplayView = (view) => ({ type: SELECT_DISPLAY_VIEW, view });

export const addMatchingCriteria = () => ({ type: ADD_MATCHING_CRITERIA });

export const changePriority = (priority) => ({ type: CHANGE_PRIORITY, priority });

export const toggleAggregation = (value) => ({ type: TOGGLE_AGGREGATION, value });

export const changeAggregationTime = (value) => ({ type: CHANGE_AGGREGATION_TIME, value });

export const changeMatchingCriteria = ({ number, departments, status, showPrematureItems }) => ({ type: CHANGE_MATCHING_CRITERIA, number, departments, status, showPrematureItems });

export const save = () => (dispatch, getState) => {
  const state = getState();
  const { initialValues, name, need_aggregation, aggregation_minutes, station_priorities, matchCriteria } = state.forms.stationOverview;

  let data = {};
  data.name = name;
  data.need_aggregation = need_aggregation;
  data.aggregation_minutes = aggregation_minutes;
  data.station_priorities_attributes = prioritiesDiff(initialValues.station_priorities, station_priorities);
  data.station_departments_attributes = departmentDiff(initialValues.station_departments, matchCriteria);

  dispatch({ type: SUBMIT_STATION_OVERVIEW_REQUEST });
  dispatch(updateStation(data, initialValues.id, initialValues.store_id)).then(result => {
    const { data, error } = result;
    if (!error) {
      let { station } = data;
      dispatch({ type: SUBMIT_STATION_OVERVIEW_SUCCESS, station });
      alert('Update station successfully.');
    } else {
      dispatch({ type: SUBMIT_STATION_OVERVIEW_FAILURE });
      alert('Update station failed.');
    }
  });
};

function prioritiesDiff(prev, next) {
  let prevPriority = {};
  let newPriority = [];
  prev.forEach(d => {
    let { id } = d;
    prevPriority[id] = d;
  });

  next.forEach(p => {
    if (prevPriority[p.id]) {
      prevPriority[p.id] = Object.assign({}, prevPriority[p.id], p);
    } else {
      newPriority.push({
        // id: p.id,
        id: "",
        name: p.name,
        minutes: p.minutes,
        color: p.color
      });
    }
  });

  let nextPriorityIDs = next.map(d => d.id).filter(d => d != false);
  let removePriorityIDs = Object.keys(prevPriority).filter(i => nextPriorityIDs.indexOf(parseInt(i)) === -1);
  if (removePriorityIDs.length) {
    removePriorityIDs.forEach(i => prevPriority[i]['_destroy'] = true);
  }

  return Object.keys(prevPriority).map(id => prevPriority[id]).concat(newPriority);
}

function departmentDiff(prev, groups) {

  let out = [];

  groups.forEach(match => {
    let prevDepartment = {};
    prev.forEach(d => {
      if (match.match_group_number === d.match_group_number) prevDepartment[d.department_id] = d;
    });
    let newDepartment = {};

    let { departments, status } = match;

    departments.forEach(d => {
      let { department_id: id } = d;
      if (prevDepartment[id]){
        prevDepartment[id] = {
          id: prevDepartment[id].id,
          department_id: id,
          match_group_number: match.match_group_number,
          show_premature_items: match.show_premature_items,
          station_department_statuses_attributes: statusDiff(prevDepartment[id].station_department_statuses || [], status)
        };
      } else {
        newDepartment[id] = {
          id: '',
          department_id: id,
          match_group_number: match.match_group_number,
          show_premature_items: match.show_premature_items,
          station_department_statuses_attributes: statusDiff([], status)
        };
      }
    });

    let nextDepartmentIDs = departments.map(d => d.department_id).filter(d => d != false);
    let removeDepartmentIDs = Object.keys(prevDepartment).filter(i => nextDepartmentIDs.indexOf(parseInt(i)) === -1);
    if (removeDepartmentIDs.length) {
      removeDepartmentIDs.forEach(i => prevDepartment[i]['_destroy'] = true);
    }

    out = out.concat(Object.keys(prevDepartment).map(id => prevDepartment[id]));
    out = out.concat(Object.keys(newDepartment).map(id => newDepartment[id]));
  });

  return out;
}

function statusDiff(prev, next) {
  let prevStatus = {};
  let newStatus = [];
  prev.forEach(d => prevStatus[d.line_item_status_id] = d);

  next.forEach(status => {
    if (!prevStatus[status.line_item_status_id]) {
      newStatus.push({ id: '', line_item_status_id: status.line_item_status_id });
    }
  });

  let nextStatusIDs = next.map(d => d.line_item_status_id).filter(d => d != false);
  let removeStatusIDs = Object.keys(prevStatus).filter(i => nextStatusIDs.indexOf(parseInt(i)) === -1);
  if (removeStatusIDs.length) {
    removeStatusIDs.forEach(i => prevStatus[i]['_destroy'] = true);
  }

  return Object.keys(prevStatus).map(id => prevStatus[id]).concat(newStatus);
}

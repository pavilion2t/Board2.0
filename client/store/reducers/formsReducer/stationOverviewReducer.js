import { unionBy }  from 'lodash';

import * as actions from '~/actions/formActions/stationOverview';

import { SAVE_DEPARTMENT_SELECTION } from '~/actions/formActions/departmentSelection';
import { SAVE_STATUS_SELECTION } from '~/actions/formActions/statusSelection';
import { createReducer } from '~/helpers/reduxHelper';


const initialState = {
  initialValues: {},
  name: '',
  need_aggregation: false,
  aggregation_minutes: 10,
  station_priorities: [],
  matchCriteria: [],
  //pending
  show_in_progress: false,
  display_view: 1
};

const defaultPriorities = [
  {
    "id": "defalut1",
    "name": "Critical",
    "minutes": 3,
    "color": "#f1735c",
  },
  {
    "id": "default2",
    "name": "High",
    "minutes": 3,
    "color": "#3db3bf",
  },
  {
    "id": "defalut3",
    "name": "Low",
    "minutes": 3,
    "color": "#adcf67",
  }
];

const actionHandlers = {
  [actions.SHOW_STATION_OVERVIEW]: (state, action) => {
    const { station } = action;
    let { name, need_aggregation, aggregation_minutes, station_departments, station_priorities } = station;
    let matchCriteria = [];
    if (station_departments && station_departments.length) {
      let match = {};
      station_departments.forEach(d => {
        let { department_id, department_name, match_group_number, show_premature_items, station_department_statuses } = d;
        station_department_statuses = station_department_statuses || [];

        let department = { id: department_id, department_id, department_name };
        if (!match[match_group_number]) {
          match[match_group_number] = {
            match_group_number,
            departments: [department],
            status: station_department_statuses,
            show_premature_items
          };
        } else {
          if (match[match_group_number].departments.length) {
            match[match_group_number].departments.push(department);
          } else {
            match[match_group_number].departments = [department];
          }

          if (match[match_group_number].status.length) {
            let prev = match[match_group_number].status;
            match[match_group_number].status = prev.concat(station_department_statuses);
          } else {
            match[match_group_number].status = station_department_statuses;
          }
          let map = {};
          match[match_group_number].status.forEach(s => map[s.line_item_status_id] = s);
          match[match_group_number].status = Object.keys(map).map(key => map[key]);
        }
      });
      matchCriteria = Object.keys(match).map(key => match[key]);
    }
    if (!station_priorities || !station_priorities.length) {
      station_priorities = defaultPriorities;
    }

    return Object.assign({}, state, {
      initialValues: station,
      name: name || '',
      need_aggregation,
      aggregation_minutes: aggregation_minutes || 10,
      station_priorities,
      matchCriteria
    });
  },
  [actions.ADD_MATCHING_CRITERIA]: (state) => {
    let { matchCriteria } = state;
    let numbers = matchCriteria.map(match => match.match_group_number).sort((a, b) => a - b);
    let nextNumber = numbers.length ? numbers[numbers.length - 1] + 1 : 1;
    matchCriteria.push({match_group_number: nextNumber, departments: [], status: [], show_premature_items: false });
    return Object.assign({}, state, { matchCriteria });
  },
  [actions.CHANE_STATION_NAME]: (state, action) => {
    return Object.assign({}, state, { name: action.value });
  },
  [actions.CHANGE_SHOW_IN_PROGRESS_STATE]: (state, action) => {
    return Object.assign({}, state, { show_in_progress: action.value });
  },
  [actions.SELECT_DISPLAY_VIEW]: (state, action) => {
    return Object.assign({}, state, { display_view: action.view });
  },
  [actions.CHANGE_PRIORITY]: (state, action) => {
    const { id, minutes } = action.priority;
    let { station_priorities } = state;
    let prev = station_priorities.map((m, i) => m.id === id? i: null).filter(i => i!==null);
    if (prev && prev.length) {
      station_priorities[prev[0]].minutes =  minutes;
      return Object.assign({}, state, station_priorities);
    } else {
      return state;
    }
  },
  [actions.TOGGLE_AGGREGATION]: (state, action) => {
    return Object.assign({}, state, { need_aggregation: action.value });
  },
  [actions.CHANGE_AGGREGATION_TIME]: (state, action) => {
    return Object.assign({}, state, { aggregation_minutes: action.value });
  },
  [actions.CHANGE_MATCHING_CRITERIA]: (state, action) => {
    const { number, departments, status, showPrematureItems } = action;
    let { matchCriteria } = state;
    let prev = matchCriteria.map((m, i) => m.match_group_number === number? i: null).filter(i => i!==null);
    if (prev && prev.length) {
      if (departments !== undefined){
        matchCriteria[prev[0]].departments =  unionBy(departments, 'department_id');
      }
      if (status !== undefined) matchCriteria[prev[0]].status =  status;
      if (showPrematureItems !== undefined) matchCriteria[prev[0]].show_premature_items = showPrematureItems;
      return Object.assign({}, state, { matchCriteria });
    }
    return state;
  },
  [actions.SUBMIT_STATION_OVERVIEW_SUCCESS]: (state, action) => {
    const { station } = action;
    return Object.assign({}, state, { initialValues: station });
  },
  [SAVE_DEPARTMENT_SELECTION]: (state, action) => {
    const { selected, params } = action;
    if (params.opener !== 'settings-kds')
        return state;
    const { number } = params;
    let { matchCriteria } = state;
    let prev = matchCriteria.map((m, i) => m.match_group_number === number? i: null).filter(i => i!==null);
    if (prev && prev.length) {
      matchCriteria[prev[0]].departments =  unionBy(matchCriteria[prev[0]].departments, selected, 'department_id');
      return Object.assign({}, state, { matchCriteria: matchCriteria });
    }
    return state;
  },
  [SAVE_STATUS_SELECTION]: (state, action) => {
    const { selected, params } = action;
    const { number } = params;
    let { matchCriteria } = state;
    let prev = matchCriteria.map((m, i) => m.match_group_number === number? i: null).filter(i => i!==null);
    if (prev && prev.length) {
      matchCriteria[prev[0]].status =  selected;
      return Object.assign({}, state, { matchCriteria: matchCriteria });
    }
    return state;
  }
};

export default createReducer(initialState, actionHandlers);

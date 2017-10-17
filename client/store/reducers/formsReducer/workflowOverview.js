import { differenceBy, unionBy } from 'lodash';

import * as actions from '~/actions/formActions/workflowOverview';

import { createReducer } from '~/helpers/reduxHelper';


const initialState = {
  initialValues: null,
  title: '',
  steps: [],
  isCreating: true
};


function linksToList(trans) {
  let links = {};
  let all = {};
  let froms = [];
  let tos = [];
  trans.forEach(({ from_status, to_status }) => {
    from_status = from_status || {};
    to_status = to_status || {};
    froms.push(from_status);
    tos.push(to_status);
    links[from_status.id] = to_status.id;
    all[from_status.id] = from_status;
    all[to_status.id] = to_status;
  });
  let start = differenceBy(unionBy(froms, tos, 'id'), tos, 'id');
  if (start.length) {
    let from = start[0].id;
    let list = [];
    list.push(start[0]);
    let to = links[from];
    while (to!==undefined){
      list.push(all[to]);
      to = links[to];
    }
    return list;
  } else {
    return [];
  }
}

const actionHandlers = {
  [actions.SHOW_WORKFLOW_OVERVIEW]: (state, action) => {
    const { initialValues, isCreating } = action;
    if (isCreating){
      return initialState;
    } else {
      let steps = [];
      const { workflow_statuses }  = initialValues;
      if (workflow_statuses && workflow_statuses.length) {
        steps = linksToList(workflow_statuses);
        steps.forEach(s => {
          s.value = s.status;
          s.label = s.status;
        });
      }
      return Object.assign({}, state, { initialValues, title: initialValues.name, steps, isCreating });
    }
  },
  [actions.CHANGE_WORKFLOW_TITLE]: (state, action) => {
    return Object.assign({}, state, { title: action.value });
  },
  [actions.ADD_WORKFLOW_NEXT_STEP]: (state, action) => {
    let { steps } = state;
    steps.push(undefined);
    return Object.assign({}, state, { steps });
  },
  [actions.SELECT_WORKFLOW_STEP_STATUS]: (state, action) => {
    const { stepNumber, lineItemStatus } = action;
    let { steps } = state;
    if (!steps.length) {
      steps.push(lineItemStatus);
    } else {
      if (!lineItemStatus) {
        steps.splice(stepNumber, 1);
      } else {
        steps[stepNumber] = lineItemStatus;
      }
    }
    return Object.assign({}, state, { steps });
  }
};

export default createReducer(initialState, actionHandlers);

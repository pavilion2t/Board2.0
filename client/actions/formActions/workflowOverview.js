import unionBy from 'lodash/unionBy';

import { updateWorkflow, createWorkflow } from '~/actions/workflowActions';

export const SHOW_WORKFLOW_OVERVIEW = 'SHOW_WORKFLOW_OVERVIEW';
export const CHANGE_WORKFLOW_TITLE = 'CHANGE_WORKFLOW_TITLE';
export const SELECT_WORKFLOW_STEP_STATUS = 'SELECT_WORKFLOW_STEP_STATUS';
export const ADD_WORKFLOW_NEXT_STEP = 'ADD_WORKFLOW_NEXT_STEP';

export const SAVE_WORKFLOW_SETTING_REQUEST = 'SAVE_WORKFLOW_SETTING_REQUEST';
export const SAVE_WORKFLOW_SETTING_SUCCESS = 'SAVE_WORKFLOW_SETTING_SUCCESS';
export const SAVE_WORKFLOW_SETTING_FAILURE = 'SAVE_WORKFLOW_SETTING_FAILURE';

export const showWorkflowOverview = ({ initialValues, isCreating  }) => ({ type: SHOW_WORKFLOW_OVERVIEW, initialValues, isCreating });

export const changeWorkflowTitle = value => ({ type: CHANGE_WORKFLOW_TITLE, value });

export const selectWorkflowTitle = ({ stepNumber, lineItemStatus }) => ({ type: SELECT_WORKFLOW_STEP_STATUS, stepNumber, lineItemStatus });

export const addWorkflowNextStep = () => ({ type: ADD_WORKFLOW_NEXT_STEP });

export const saveWorkflowSetting = (storeId) => (dispatch, getState) => {
  const state = getState();

  const { initialValues, title: name, steps, isCreating } = state.forms.workflowOverview;

  if (steps.length === 1) {
    alert('Please select 0 or more than 1 steps');
    return;
  }

  let badInput = validateFalseSteps(steps);
  if (badInput.length) {
    alert(`Please select status for step ${badInput.map(i => i + 1).join(', ')}`);
    return;
  }

  let hasComplete = -1;
  steps.forEach((s, i) => {if (s.id === -3) hasComplete = i; });
  if (hasComplete > 0 && steps[steps.length - 1].id !== -3) {
    alert(`'Completed' should be the last status.`);
    return;
  }

  let duplicatedInput = validateDuplicatedSteps(steps);
  if (duplicatedInput.length) {
    alert(`Please check the duplicated status: ${duplicatedInput.map(s => s.status).join(', ')}`);
    return;
  }
  let nextAction = isCreating ? createWorkflow(makeNewWorkflow(name, steps), storeId) : updateWorkflow(initialValues.id, { name, workflow_statuses_attributes: actionDiff(initialValues.workflow_statuses, steps)}, storeId);

  dispatch({ type: SAVE_WORKFLOW_SETTING_REQUEST });
  dispatch(nextAction).then(resp => {
    const { error } = resp;
    if (!error) {
      dispatch({ type: SAVE_WORKFLOW_SETTING_SUCCESS });
      alert('Update workflow successfully.');
    } else {
      dispatch({ type: SAVE_WORKFLOW_SETTING_FAILURE, error });
      alert('Update workflow failed.');
    }
  }).catch(error => {
    dispatch({ type: SAVE_WORKFLOW_SETTING_FAILURE, error });
    alert('Update workflow failed.');
  });

};


function makeNewWorkflow(title, statuses) {
  let workflow = { name:title };
  let trans = [];
  for (let i = 1; i < statuses.length; i++) {
    let from = statuses[i-1];
    let to = statuses[i];
    trans.push({
      id: '',
      action: `from ${from.status} to ${to.status}`,
      from_status_id: from.id,
      to_status_id: to.id
    });
  }
  workflow.workflow_statuses_attributes = trans;
  return workflow;
}

function actionDiff(prev, steps) {
  let nextActions = [];

  for (let i=1;i<steps.length;i++) {
    let from = steps[i-1];
    let to = steps[i];
    nextActions.push({
      id: '',
      action: `from ${from.status} to ${to.status}`,
      from_status_id: from.id,
      to_status_id: to.id
    });
  }
  if (nextActions.length >= prev.length) {
    for (let i=0;i<prev.length;i++){
      nextActions[i].id = prev[i].id;
    }
  } else if (nextActions.length < prev.length) {
    for (let i=0;i<nextActions.length;i++){
      nextActions[i].id = prev[i].id;
    }
    for (let i=nextActions.length;i<prev.length;i++){
      let action = prev[i];
      nextActions.push({
        id: action.id,
        action: action.action,
        from_status_id: action.from_status.id,
        to_status_id: action.to_status.id,
        '_destroy': true
      });
    }
  }
  return nextActions;
}

function validateFalseSteps(steps) {
  return steps.map((s, i) => s == null ? i: null).filter(i => i !== null);
}

function validateDuplicatedSteps(steps) {
  let ids = {};
  steps.forEach(s => {
    if (ids[s.id] === undefined){
      ids[s.id] = 1;
    } else {
      ids[s.id] = ids[s.id] + 1;
    }
  });
  return unionBy(steps.filter(s => ids[s.id] !== undefined && ids[s.id] > 1), 'id');
}

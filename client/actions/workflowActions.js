import workflowService from '~/services/workflowService';

import { startFetch, stopFetch } from './baseActions';

import {
  ADD_ENTITY,
  SET_ENTITIES,
  UPDATE_ENTITY,
  REMOVE_ENTITY
} from './entityActions';

export const createWorkflow = (workflow, storeId) => dispatch => {
  dispatch(startFetch());

  return workflowService.createWorkflow(workflow, storeId)
    .then(resp => {
      let { workflow, message } = resp;
      if (workflow) {
        const { id } = workflow;
        dispatch({ type: ADD_ENTITY, collection: 'workflows', id, data: workflow});
        dispatch(stopFetch());
        return { workflow };
      }
      if (message) {
        return { error: new Error(message)};
      }
    })
    .catch(e => {
      dispatch(stopFetch());
      return { error: e };
    });
};

export const getWorkflows = storeId => dispatch => {
  dispatch(startFetch());

  return workflowService.getWorkflows(storeId)
    .then(resp => {
      dispatch(stopFetch());
      let { data, message } = resp;
      let { workflows } = data;
      if (workflows) {
        let entities = {};
        workflows.forEach(s => {
          let { id } = s;
          entities[id] = s;
        });

        dispatch({ type: SET_ENTITIES, collection: 'workflows', data: entities });
        return { workflows };
      }
      if (message) {
        return { error: new Error(message)};
      }
    })
    .catch(e => {
      dispatch(stopFetch());
      return { error: e };
    });
};

export const getWorkflow = (id, storeId) => dispatch => {
  dispatch(startFetch());

  return workflowService.getWorkflow(id, storeId)
    .then(resp => {
      let { workflow, message } = resp;
      if (workflow) {
        const { id } = workflow;
        dispatch({ type: ADD_ENTITY, collection: 'workflows', id, data: workflow});
        dispatch(stopFetch());
        return { workflow };
      }
      if (message) {
        return { error: new Error(message)};
      }
    })
    .catch(e => {
      dispatch(stopFetch());
      return { error: e };
    });
};

export const updateWorkflow = (id, workflow, storeId) => (dispatch) => {
  dispatch(startFetch());

  return workflowService.updateWorkflow(id, workflow, storeId).then(resp => {
    dispatch(stopFetch());

    let { workflow } = resp;
    if (workflow) {
      dispatch({ type: UPDATE_ENTITY, collection: 'workflows', id, workflow });
      return { workflow };
    } else {
      return { error: new Error()};
    }
  }).catch(e => {
    dispatch(stopFetch());

    return { error: e };
  });
};

export const removeWorkflow = (id, storeId) => (dispatch) => {
  dispatch(startFetch());

  return workflowService.removeWorkflow(id, storeId).then(resp => {
    dispatch(stopFetch());

    let { message } = resp;
    if (message === 'success') {
      dispatch({ type: REMOVE_ENTITY, collection: 'workflows', id});
    } else {
      return { error: new Error(message)};
    }
  }).catch(e => {
    dispatch(stopFetch());

    return { error: e };
  });
};

import values from 'lodash/values';

import { createLineItemStatus } from '~/actions/lineItemStatusAction';

export const OPEN_STATUS_SELECTION = 'OPEN_STATUS_SELECTION';
export const CLOSE_STATUS_SELECTION = 'CLOSE_STATUS_SELECTION';
export const TOGGLE_STATUS = 'TOGGLE_STATUS';
export const CHANGE_STATUS_INPUT = 'CHANGE_STATUS_INPUT';
export const SAVE_STATUS_SELECTION = 'SAVE_STATUS_SELECTION';

export const ADD_STATUS_REQUEST = 'ADD_STATUS_REQUEST';
export const ADD_STATUS_SUCCESS = 'ADD_STATUS_SUCCESS';
export const ADD_STATUS_FAILURE = 'ADD_STATUS_FAILURE';

export const openStatusSelection = ({ selected, params }) => (dispatch, getState) => {
  const state = getState();
  const { lineItemStatuses } = state.entities;
  let all = values(lineItemStatuses);
  all = all.map(s => ({ line_item_status_id: s.id, line_item_status_name: s.status }));
  dispatch({ type: OPEN_STATUS_SELECTION, all: all, selected: selected.slice(), params });
};

export const closeStatusSelection = () => ({ type: CLOSE_STATUS_SELECTION });

export const changeStatusInput = (value) => ({ type: CHANGE_STATUS_INPUT, value});

export const submitStatusSelection = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { selected, params } = state.forms.statusSelection;
    dispatch({ type: SAVE_STATUS_SELECTION, selected, params });
  };
};

export const toggleStatusSelection = ({ item, checked }) => ({ type: TOGGLE_STATUS, item, checked });

export const createStatus = ({ status, color, store_id }) => {
  return dispatch => {
    dispatch({ type: ADD_STATUS_REQUEST });
    dispatch(createLineItemStatus(status, color, store_id)).then((result) => {
      const { data } = result;
      if (data) {
        data.line_item_status_name = data.status;
        data.line_item_status_id = data.id;
        dispatch({ type: ADD_STATUS_SUCCESS, data});
        dispatch(changeStatusInput(''));
      } else {
        dispatch({ type: ADD_STATUS_FAILURE });
      }
    });
  };
};


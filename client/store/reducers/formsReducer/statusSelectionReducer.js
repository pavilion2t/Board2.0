import * as actions from '~/actions/formActions/statusSelection';

import { createReducer } from '~/helpers/reduxHelper';


const initialState = {
  isOpen: false,
  params: {},
  all: [],
  selected: [],
  input: {
    value: '',
    failure: false,
    success: false
  }
};

const actionHandlers = {
  [actions.OPEN_STATUS_SELECTION]: (state, action) => {
    const { all, selected, params } = action;
    return Object.assign({}, state, {all, selected, isOpen: true, params });
  },
  [actions.CLOSE_STATUS_SELECTION]: () => initialState,
  [actions.SAVE_STATUS_SELECTION]: () => initialState,
  [actions.TOGGLE_STATUS]: (state, action) => {
    const { item, checked } = action;
    let { selected } = state;
    if (checked) {
      selected.push(item);
    } else {
      selected = selected.filter(i => i.line_item_status_id !== item.line_item_status_id);
    }
    return Object.assign({}, state,  { selected });
  },
  [actions.CHANGE_STATUS_INPUT]: (state, action) => {
    let { input } = state;
    input.value = action.value;
    return Object.assign({}, state, { input });
  },
  [actions.ADD_STATUS_REQUEST]: (state) => {
    let { input } = state;
    input = Object.assign({}, input, { failure: false, success: false });
    return Object.assign({}, state, { input });
  },
  [actions.ADD_STATUS_SUCCESS]: (state, action) => {
    const { data } = action;
    let { all, input } = state;
    all.push({ line_item_status_name: data.status, line_item_status_id: data.id });
    input = Object.assign({}, input, { failure: false, success: true });
    return Object.assign({}, state, { all, input });
  },
  [actions.ADD_STATUS_FAILURE]: (state) => {
    let { input } = state;
    input = Object.assign({}, input, { failure: true, success: false });
    return Object.assign({}, state, { input });
  }
};

export default createReducer(initialState, actionHandlers);

import * as actions from '~/actions/formActions/addLineItemStatus';

import { createReducer } from '~/helpers/reduxHelper';


const initialState = {
  storeId: null,
  isOpen: false,
  initialValues: null,
  isCreating: true,
  input: {
    value: '',
    failure: false,
    success: false
  }
};

const actionHandlers = {
  [actions.OPEN_ADD_LINE_ITEM_STATUS]: (state, action) => {
    const { storeId, isCreating, initialValues } = action;
    let { input } = initialState;
    if (initialValues && initialValues.status) {
      input.value = initialValues.status;
    }
    return Object.assign({}, state, { isOpen: true, input, storeId, isCreating, initialValues });
  },
  [actions.CLOSE_ADD_LINE_ITEM_STATUS]: () => initialState,
  [actions.CHANGE_LINE_ITEM_STATUS_INPUT]: (state, action) => {
    let { input } = state;
    input.value = action.value;
    input.failure = false;
    input.success = false;
    return Object.assign({}, state, { input });
  },
  [actions.SAVE_LINE_ITEM_STATUS_REQUEST]: (state) => {
    let { input } = state;
    input = Object.assign({}, input, { failure: false, success: false });
    return Object.assign({}, state, { input });
  },
  [actions.SAVE_LINE_ITEM_STATUS_SUCCESS]: (state) => {
    let { input } = state;
    input = Object.assign({}, input, { failure: false, success: true });
    return Object.assign({}, state, { input });
  },
  [actions.SAVE_LINE_ITEM_STATUS_FAILURE]: (state) => {
    let { input } = state;
    input = Object.assign({}, input, { failure: true, success: false });
    return Object.assign({}, state, { input });
  }
};

export default createReducer(initialState, actionHandlers);

import { actionTypes } from '~/actions/pageActions/inventoryVarianceIndex';

import { createReducer } from '~/helpers/reduxHelper';
import { INVENTORY_VARIANCE } from '~/constants';
const { TYPE } = INVENTORY_VARIANCE;

const initialState = {
  isLoading: true,
  totalEntries: 0,
  currentPage: 1,
  rowsPerPage: 25,
  totalPages: 1,
  filters: [],
  storeId: 0,
  data: [],
  type: TYPE.OPENING,
};

const actionHandlers = {
  [actionTypes.LOAD_INVENTORY_VARIANCE_INDEX_REQUEST]: (state, action) => {
    const { storeId } = action;
    return { ...state, storeId, isLoading: true };
  },
  [actionTypes.LOAD_INVENTORY_VARIANCE_INDEX_SUCCESS]: (state, action) => {
    return { ...state, ...action, isLoading: false };
  },
  [actionTypes.LOAD_INVENTORY_VARIANCE_INDEX_FAILURE]: (state) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.CHANGE_INVENTORY_VARIANCE_INDEX_ROWS_PER_PAGE]: (state, action) => {
    return { ...state, rowsPerPage: action.value };
  },
  [actionTypes.CHANGE_INVENTORY_VARIANCE_INDEX_PAGE_NUMBER]: (state, action) => {
    return { ...state, currentPage: action.value };
  },
  [actionTypes.CHANGE_INVENTORY_VARIANCE_INDEX_FILTERS]: (state, action) => {
    return { ...state, filters: action.filters };
  },
  [actionTypes.CHANGE_INVENTORY_VARIANCE_TYPE]: (state, action) => {
    state.modification = state.modification + 1;
    return Object.assign({}, state, { type: action.ivType });
  },
  [actionTypes.CLEAR_IV_TYPE]: (state, action) => {
    const type = initialState.type;
    return Object.assign({}, state, { type });
  },
};

export default createReducer(initialState, actionHandlers);

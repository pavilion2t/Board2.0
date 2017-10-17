import { actionTypes } from '~/actions/pageActions/productionOrderIndex';

import { createReducer } from '~/helpers/reduxHelper';

const initialState = {
  isLoading: true,
  totalEntries: 0,
  currentPage: 1,
  rowsPerPage: 25,
  totalPages: 1,
  filters: [],
  storeId: 0,
  data: []
};

const actionHandlers = {
  [actionTypes.LOAD_PRODUCTION_ORDER_INDEX_REQUEST]: (state, action) => {
    const { storeId } = action;
    return { ...state, storeId, isLoading: true };
  },
  [actionTypes.LOAD_PRODUCTION_ORDER_INDEX_SUCCESS]: (state, action) => {
    return { ...state, ...action, isLoading: false };
  },
  [actionTypes.LOAD_PRODUCTION_ORDER_INDEX_FAILURE]: (state) => {
    return { ...state, isLoading: false };
  },
  [actionTypes.CHANGE_PRODUCTION_ORDER_INDEX_ROWS_PER_PAGE]: (state, action) => {
    return { ...state, rowsPerPage: action.value };
  },
  [actionTypes.CHANGE_PRODUCTION_ORDER_INDEX_PAGE_NUMBER]: (state, action) => {
    return { ...state, currentPage: action.value };
  },
  [actionTypes.CHANGE_PRODUCTION_ORDER_INDEX_FILTERS]: (state, action) => {
    return { ...state, filters: action.filters };
  }
};


export default createReducer(initialState, actionHandlers);

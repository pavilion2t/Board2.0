import keykey from 'keykey';
import { searchInventoryVariances } from '~/actions/inventoryVarianceActions';

export const actionTypes = keykey([
  'LOAD_INVENTORY_VARIANCE_INDEX_REQUEST',
  'LOAD_INVENTORY_VARIANCE_INDEX_SUCCESS',
  'LOAD_INVENTORY_VARIANCE_INDEX_FAILURE',

  'CHANGE_INVENTORY_VARIANCE_INDEX_ROWS_PER_PAGE',
  'CHANGE_INVENTORY_VARIANCE_INDEX_PAGE_NUMBER',
  'CHANGE_INVENTORY_VARIANCE_INDEX_FILTERS',

  'CHANGE_INVENTORY_VARIANCE_TYPE',
  'CLEAR_IV_TYPE',
]);

export const load = (storeId, currentPage, rowsPerPage, filters) => (dispatch) => {
  dispatch({ type: actionTypes.LOAD_INVENTORY_VARIANCE_INDEX_REQUEST, storeId });
  dispatch(searchInventoryVariances(storeId, currentPage, rowsPerPage, undefined, filters))
    .then(resp => {
      const { page, count, totalCount, totalPages, error, data } = resp;
      if (error) {
        // alert(error.message);
        dispatch({ type: actionTypes.LOAD_INVENTORY_VARIANCE_INDEX_FAILURE, error });
      } else {
        dispatch({
          type: actionTypes.LOAD_INVENTORY_VARIANCE_INDEX_SUCCESS,
          data: data.inventoryVariances,
          totalEntries: totalCount,
          currentPage: page,
          rowsPerPage: count,
          totalPages: totalPages
        });
      }
    });
};

export const changeRowsPerPage = (value) => (dispatch, getState) => {
  dispatch({ type: actionTypes.CHANGE_INVENTORY_VARIANCE_INDEX_ROWS_PER_PAGE, value });
  const state = getState();
  const { currentPage, filters, storeId } = state.pages.inventoryVarianceIndex;
  dispatch(load(storeId, currentPage, value, filters));
};

export const changePage = (value) => (dispatch, getState) => {
  dispatch({ type: actionTypes.CHANGE_INVENTORY_VARIANCE_INDEX_PAGE_NUMBER, value });
  const state = getState();
  const { rowsPerPage, filters, storeId } = state.pages.inventoryVarianceIndex;
  dispatch(load(storeId, value, rowsPerPage, filters));
};

export const changeFilters = (filters) => (dispatch, getState) => {
  dispatch({ type: actionTypes.CHANGE_INVENTORY_VARIANCE_INDEX_FILTERS, filters });
  const state = getState();
  const { rowsPerPage, currentPage, storeId } = state.pages.inventoryVarianceIndex;
  dispatch(load(storeId, currentPage, rowsPerPage, filters));
};

export const changeIVType = (type) => (dispatch, getState) => {
    dispatch({type: actionTypes.CHANGE_INVENTORY_VARIANCE_TYPE, ivType: type});
};

export const clearIvType = () => (dispatch, getState) => {
    dispatch({type: actionTypes.CLEAR_IV_TYPE});
};

import keykey from 'keykey';
import { getProductionOrders } from '~/actions/productionOrderAction';

export const actionTypes = keykey([
  'LOAD_PRODUCTION_ORDER_INDEX_REQUEST',
  'LOAD_PRODUCTION_ORDER_INDEX_SUCCESS',
  'LOAD_PRODUCTION_ORDER_INDEX_FAILURE',

  'CHANGE_PRODUCTION_ORDER_INDEX_ROWS_PER_PAGE',
  'CHANGE_PRODUCTION_ORDER_INDEX_PAGE_NUMBER',
  'CHANGE_PRODUCTION_ORDER_INDEX_FILTERS'
]);

export const load = (storeId, currentPage, rowsPerPage, filters) => (dispatch) => {
  dispatch({ type: actionTypes.LOAD_PRODUCTION_ORDER_INDEX_REQUEST, storeId });
  dispatch(getProductionOrders(storeId, currentPage, rowsPerPage, undefined, filters))
    .then(resp => {
      const { page, count, totalCount, totalPages, error, data } = resp;
      if (error) {
        // alert(error.message);
        dispatch({ type: actionTypes.LOAD_PRODUCTION_ORDER_INDEX_FAILURE, error });
      } else {
        dispatch({
          type: actionTypes.LOAD_PRODUCTION_ORDER_INDEX_SUCCESS,
          data: data.productionOrders,
          totalEntries: totalCount,
          currentPage: page,
          rowsPerPage: count,
          totalPages: totalPages
        });
      }
    });
};

export const changeRowsPerPage = (value) => (dispatch, getState) => {
  dispatch({ type: actionTypes.CHANGE_PRODUCTION_ORDER_INDEX_ROWS_PER_PAGE, value });
  const state = getState();
  const { currentPage, filters, storeId } = state.pages.productionOrderIndex;
  dispatch(load(storeId, currentPage, value, filters));
};

export const changePage = (value) => (dispatch, getState) => {
  dispatch({ type: actionTypes.CHANGE_PRODUCTION_ORDER_INDEX_PAGE_NUMBER, value });
  const state = getState();
  const { rowsPerPage, filters, storeId } = state.pages.productionOrderIndex;
  dispatch(load(storeId, value, rowsPerPage, filters));
};

export const changeFilters = (filters) => (dispatch, getState) => {
  dispatch({ type: actionTypes.CHANGE_PRODUCTION_ORDER_INDEX_FILTERS, filters });
  const state = getState();
  const { rowsPerPage, currentPage, storeId } = state.pages.productionOrderIndex;
  dispatch(load(storeId, currentPage, rowsPerPage, filters));
};

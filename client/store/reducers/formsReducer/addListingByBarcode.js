import { actionTypes } from '~/actions/formActions/addListingByBarcode';

import { createReducer } from '~/helpers/reduxHelper';

const initialState = {
  value: '',
  isSearching: false
};

const actionHandlers = {
  [actionTypes['ADD_LISTING_BY_BARCODE_CHANGE_INPUT']]: (state, action) => {
    const { value } = action;
    return Object.assign({}, state, { value });
  },
  [actionTypes['ADD_LISTING_BY_BARCODE_SUBMIT_REQUEST']]: (state) => {
    return Object.assign({}, state, { isSearching: true });
  },
  [actionTypes['ADD_LISTING_BY_BARCODE_SUBMIT_SUCCESS']]: (state) => {
    return Object.assign({}, state, { isSearching: false, value: '' });
  },
  [actionTypes['ADD_LISTING_BY_BARCODE_SUBMIT_FAILURE']]: (state) => {
    return Object.assign({}, state, { isSearching: false });
  }
};

export default createReducer(initialState, actionHandlers);

import { SET_SUPPLIERS } from '../../actions/supplierActions.js';
import merge from 'lodash/merge';

const initialState = {};

export default function storeSuppliersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SUPPLIERS: {
      let newState = merge({}, state);
      newState[action.data.storeId] = action.data.supplierIds;
      return newState;
    }
    default:
      return state;
  }
}

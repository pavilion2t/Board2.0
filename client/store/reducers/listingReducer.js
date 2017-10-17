import without from 'lodash/without';
import unionBy from 'lodash/unionBy';

import {
  SET_LISTINGS,
  SET_LISTING,
  REMOVE_LISTING
} from '../../actions/inventoryActions';

import {
  SWITCH_STORE,
} from '../../actions/storeActions';

const initialState = [];

export function listingsReducer(state = initialState, action) {
  switch (action.type) {
    // LIST
    case SET_LISTINGS:
      return action.data;

    case REMOVE_LISTING:
      return without(action.data, action.id);

      // ITEM
    case SET_LISTING:
      return unionBy(state, [action.data], 'id');

    case SWITCH_STORE:
      return [];

    default:
      return state;
  }
}

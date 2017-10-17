import merge from 'lodash/merge';
import { SAVE_FILTER, REMOVE_SAVED_FILTER } from '../../actions/savedFiltersActions.js';

const initialState = {};

export default function savedFiltersReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SAVE_FILTER:
      newState = merge({}, state, action.data);
      return newState;

    case REMOVE_SAVED_FILTER:
      delete state[action.data.group][action.data.name];
      newState = Object.assign({}, state);
      return newState;

    default:
      return state;
  }
}

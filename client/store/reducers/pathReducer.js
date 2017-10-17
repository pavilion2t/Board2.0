import { SET_PATH_STATE } from '../../actions/baseActions';

const initialState = {};

export default function pathReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PATH_STATE: {
      let currentState;
      try {
        currentState = state[action.path][action.stateName];
      } catch (e) {
        console.warn('state', action.path, action.stateName, 'not exist yet, set to null.');
        currentState = null;
      }

      let newState = {
        [action.path]: Object.assign({}, state[action.path], {
          [action.stateName] : action.callback ? action.callback(currentState, action.result) : action.result
        })
      };
      if (action.meta) {
        newState[action.path][action.stateName+'_meta'] = action.meta;
      }

      return Object.assign({}, state, newState);
    }

    default:
      return state;
  }
}

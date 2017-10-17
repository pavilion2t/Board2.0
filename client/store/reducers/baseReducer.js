import {
  START_FETCH,
  STOP_FETCH,
} from '../../actions/baseActions';

let initialState = {
  loading: false
};

function baseReducer(state = initialState, action) {
  switch (action.type) {
    case START_FETCH:
      return Object.assign({}, state, { loading: true });

    case STOP_FETCH:
      return Object.assign({}, state, { loading: false });

    default:
      return state;
  }
}

export default baseReducer;

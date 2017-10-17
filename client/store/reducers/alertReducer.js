import concat from 'lodash/concat';
import reject from 'lodash/reject';

import {
  ADD_ALERT,
  REMOVE_ALERT,
  TRUNCATE_ALERT,
} from '../../actions/alertActions';

let initialState = [];

function alertReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ALERT: {
      return concat(state, {
        style: action.style,
        message: action.message
      });
    }

    case REMOVE_ALERT: {
      let newState = reject(state, { message: action.message });
      return newState;
    }

    case TRUNCATE_ALERT: {
      return [];
    }

    default: {
      return state;
    }
  }
}

export default alertReducer;

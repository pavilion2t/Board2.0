import { LOGIN_SUCCESS, LOGIN_FAILURE } from '../../actions/userActions';

const initialState = null;

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return action.user;

    case LOGIN_FAILURE:
      return null;

    default:
      return state;
  }
}

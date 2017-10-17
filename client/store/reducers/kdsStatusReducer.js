import { SET_STATIONS_STATUS } from '~/actions/kdsActions';

const initialState = {
  page: 1,
  count: 25,
  totalCount: 0,
  totalPages: 1,
  filters: [],
  loading: false,
};

export default function kdsStatusReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STATIONS_STATUS:
      return Object.assign({}, state, action.data);

    default:
      return state;
  }
}

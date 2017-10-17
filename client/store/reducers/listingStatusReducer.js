import { SET_LISTINGS_STATUS } from '../../actions/inventoryActions';

const initialState = {
  page: 1,
	count: 25,
	totalCount: 0,
  totalPages: 1,
  filters: [],
  loading: false,
};

export default function listingStatusReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LISTINGS_STATUS:
      return Object.assign({}, state, action.data);

    default:
      return state;
  }
}

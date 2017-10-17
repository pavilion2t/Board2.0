import { SET_VOUCHERS, SET_VOUCHERS_FILTERS, REMOVE_VOUCHER, SET_ASSOCIATED_PRODUCTS, REMOVE_ASSOCIATED_PRODUCTS} from '~/actions/voucherActions';
import remove from 'lodash/remove';
import values from 'lodash/values';


const initialState = {
    criteria: {
        totalCount: 0,
        totalPages: 0,
        page: 0,
        count: 25,
        filters: []
    },
    currentVouchers: [],
    products: [],
    fetchingData: true
};

export default function voucherReducer(state = initialState, action) {

  switch (action.type) {

    // VOUCHERS
    case SET_VOUCHERS:
      return Object.assign({}, state, action.data, { fetchingData: false });

    case REMOVE_ASSOCIATED_PRODUCTS:
          state.products = remove(values(state.products), (p) => {
            return p.product_id !== action.id;
          });
      return Object.assign({}, state);

    case SET_ASSOCIATED_PRODUCTS:

      return Object.assign({}, state, action.data, { fetchingData: false });


    case REMOVE_VOUCHER:

      remove(state.currentVouchers, (id) => {
        return Number(id) === Number(action.id);
      });

      state.criteria.totalCount -= 1;
      state.criteria.totalPages = Math.ceil(state.criteria.totalCount / state.criteria.count);

      return Object.assign({}, state);

    // VOUCHER'S FILTER
    case SET_VOUCHERS_FILTERS:
      return Object.assign({}, state, {
        criteria: {
          ...state.criteria,
          filters: action.data.slice()
        }
      });

    default:
      return state;
  }
}

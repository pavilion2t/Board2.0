import { SET_VOUCHER_COUPONS } from '~/actions/voucherActions';

const initialState = {
    criteria: {
      totalCount: 0,
      totalPages: 0,
      page: 0,
      perPage: 25,
    },
    currentCoupons: [],
    fetchingData: true
};

function voucherCouponReducer(state = initialState, action) {

  switch (action.type) {
    case SET_VOUCHER_COUPONS:
      return Object.assign({}, state, action.data, { fetchingData: false });

    default:
      return state;
  }
}

export default voucherCouponReducer;

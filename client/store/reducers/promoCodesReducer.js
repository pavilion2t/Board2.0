import { createReducer } from '~/helpers/reduxHelper';

import * as actionTypes from '~/actions/promoCodeActions';

import { PROMO_CODE } from '~/constants';

import {transformPromoCode} from '~/helpers/promoCodeHelper'

const {
  MODE,
  TAB,
} = PROMO_CODE;

const initialState = {
  mode:        MODE.VIEW,
  storeId:     null,
  promoCodeId: null,
  tab:         TAB.OVERVIEW,
  coupon:      transformPromoCode(),
  promoCodes: [],
  errMsg: null
};

const actionHandlers = {
  [actionTypes.MODE_CHANGE]: (state, {payload})=>({
    ...state, promoCodes:[], coupon:{}, ...payload
  }),
  [actionTypes.UPDATE_PROMO_CODE_ITEM_FIELD]: (state, { payload = {} }) => {
    const { field, value } = payload;
    if (field){
      const coupon = { ...state.coupon };
      coupon[field] = value;
      return { ...state, coupon };
    }
    return state;
  },
  [actionTypes.LOAD_PROMO_CODE_LIST_SUCCESS]: (state, {payload})=>({
    ...state, ...payload
  }),
  [actionTypes.LOAD_PROMO_CODE_ITEM_SUCCESS]: (state, {promoCode})=>({
    ...state, coupon: transformPromoCode(promoCode)
  })
};

export default createReducer(initialState, actionHandlers);

import { browserHistory } from 'react-router';

import { startFetch, stopFetch} from './baseActions'
import {alert} from './alertActions'

import { PROMO_CODE } from '~/constants';

import promoCodeService from '~/services/promoCodeService'

export const LOAD_PROMO_CODE_LIST_SUCCESS = 'LOAD_PROMO_CODE_LIST_SUCCESS'
export const LOAD_PROMO_CODE_ITEM_SUCCESS = 'LOAD_PROMO_CODE_ITEM_SUCCESS'

export const UPDATE_PROMO_CODE_ITEM_FIELD = 'UPDATE_PROMO_CODE_ITEM_FIELD';

export const MODE_CHANGE = 'MODE_CHANGE'

function loadPromoCodeListSuccess(promoCodes, totalEntries, totalPages) {
  return {
    type: LOAD_PROMO_CODE_LIST_SUCCESS,
    payload: {promoCodes, totalEntries, totalPages}
  }
}

export function modeChange(mode, extra) {
  return {
    type: MODE_CHANGE,
    payload: {
      mode,
      ...extra
    }
  }
}

export const loadPromoCodeList = (storeId, page, count, filters) => dispatch => {
  dispatch(startFetch());
  return promoCodeService.getList(storeId, page, count, filters)
  .then(response=>{
    let promoCodes = response.data.map(item=>item.coupon)
    return dispatch(loadPromoCodeListSuccess(promoCodes, response.totalCount, response.totalPages))
  }).catch(err=>{
    dispatch(alert('danger', err.message))
  }).then(()=>dispatch(stopFetch()))
}

export const loadPromoCodeItem = (storeId, promoCodeId) => dispatch => {
  dispatch(startFetch())
  dispatch(modeChange(PROMO_CODE.MODE.EDIT, {storeId, promoCodeId}))
  return promoCodeService.getItem(storeId, promoCodeId)
  .then(response=>{
    return dispatch({
      type: LOAD_PROMO_CODE_ITEM_SUCCESS,
      promoCode: response.coupon
    })
  }).catch(err=>dispatch(alert('danger', err.message)))
  .then(()=>dispatch(stopFetch()))
}

export const cancelEditPromoCode = (mode, storeId, promoCodeId) => {
  browserHistory.goBack();
  return modeChange(PROMO_CODE.MODE.VIEW)
};

export const updatePromoCodeField = (field, value) => {
  return {
    type: UPDATE_PROMO_CODE_ITEM_FIELD,
    payload: { field, value },
  };
};

export const savePromoCode = (storeId, promoCode) => dispatch => {
  if (!promoCode.code){
    return dispatch(alert('warning', 'code is required'))
  } else if (!promoCode.discount){
    return dispatch(alert('warning', 'discount is required'))
  }
  dispatch(startFetch())
  return promoCodeService.saveItem(storeId, promoCode)
  .then(()=>{
    dispatch(alert('success', 'Promo Code Saved'))
  })
  .catch(err=>{
    dispatch(alert('danger', err.message))
  })
  .then(()=>dispatch(stopFetch()))
}

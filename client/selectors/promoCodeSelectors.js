import { createSelector } from 'reselect';
import { get, pick } from 'lodash';

import { PROMO_CODE } from '~/constants';

export const getTotalEntries = (state, props) => get(state, 'promoCode.totalEntries', 0);

export const getTotalPages = (state, props) => get(state, 'promoCode.totalPages', 0);

export const getGridMeta = createSelector(
  [getTotalEntries, getTotalPages],
  (totalEntries, totalPages) => ({ totalEntries, totalPages }),
);

export const getPromoCodes = state => get(state, 'promoCode.promoCodes', [])

export const getErrMsg = state => get(state, 'promoCode.errMsg')

export const getPathState = (state) => get(state, 'promoCode', {});

export const getPageTitle = createSelector(
  [getPathState],
  (s) => s.mode === PROMO_CODE.MODE.NEW ? 'New Promotion Code' : `Promotion Code #${s.coupon.code}`,
);

export const getBreadcrumbTitle = createSelector(
  [getPathState],
  (s) => s.mode === PROMO_CODE.MODE.NEW ? 'New Promotion Code' : s.coupon.code,
);

export const getPathInfo = createSelector(
  [getPathState],
  (s) => pick(s, ['mode', 'storeId', 'promoCodeId', 'tab']),
);

export const getItem = createSelector(
  [getPathState],
  (s) => {
    const discount = get(s, 'discount', {});
    const coupon = get(s, 'coupon', {});
    return {
      discount,
      ...coupon,
    };
  },
);

export const getDiscountDetail = createSelector(
  [getPathState],
  (s) => {
    const discount = get(s, 'discount', {});
    const ret = pick(discount, [
      'id',
      'name',
      'code',
      'discountType',
      'amount',
      'percentage',
      'startFrom',
      'endAt',
    ]);
    ret.discountTypeDisplay = ret.amoun > 0 ? 'Amount Off' : 'Percentage Off';
    return ret;
  },
);

export const getReadOnlyConfig = createSelector(
  [getPathInfo],
  (info) => {
    // const isView = info.mode === PROMO_CODE.MODE.VIEW;
    const isNew = info.mode === PROMO_CODE.MODE.NEW;
    // const isEdit = info.mode === PROMO_CODE.MODE.EDIT;
    return {
      code:       !isNew,
      discount:   !isNew,
      userQuota:  false,
      totalQuota: false,
      usedQuota:  true,
    };
  },
);

export const getButtonShowConfig = createSelector(
  [getPathInfo],
  (info) => {
    // const isOverview = info.tab === PROMO_CODE.TAB.OVERVIEW;
    const isView = info.mode === PROMO_CODE.MODE.VIEW;
    // const isNew = info.mode === PROMO_CODE.MODE.NEW;
    // const isEdit = info.mode === PROMO_CODE.MODE.EDIT;
    return {
      edit:       isView,
      cancelEdit: !isView,
      saveEdit:   !isView,
    };
  },
);

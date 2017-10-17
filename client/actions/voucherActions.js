import { HANDLE_PROMISE } from '../store/middlewares/handlePromiseMiddleware';
import voucherService from '../services/voucherService';
import { REMOVE_ENTITY } from './entityActions';


export const REMOVE_VOUCHER = 'REMOVE_VOUCHER';
export const SET_VOUCHERS = 'SET_VOUCHERS';
export const SET_ASSOCIATED_PRODUCTS = 'SET_ASSOCIATED_PRODUCTS';
export const REMOVE_ASSOCIATED_PRODUCTS = 'REMOVE_ASSOCIATED_PRODUCTS';



export const SET_VOUCHERS_FILTERS = 'SET_VOUCHERS_FILTERS';
export const SET_VOUCHER_COUPONS = 'SET_VOUCHER_COUPONS';

export function getVouchers(storeId, page, count, orderBy, filters = []) {
  return {
    [HANDLE_PROMISE]: {
      promise: voucherService.getList(storeId, page, count, orderBy, filters),
      actions: {
        type: 'SET_VOUCHERS'
      }
    }
  };
}

export function getAssociateProducts(storeId, productsId) {
  return {
    [HANDLE_PROMISE]: {
      promise: voucherService.getAssociateProducts(storeId, productsId),
      actions: {
        type: SET_ASSOCIATED_PRODUCTS
      }
    }
  };
}

export function removeAssociateProduct(productId){
  return {
    type: REMOVE_ASSOCIATED_PRODUCTS,
    id: productId
  };
}

export function getVoucher(storeId, discountId) {
  return {
    [HANDLE_PROMISE]: {
      promise: voucherService.getItem(storeId, discountId),
      actions: [{
        type: 'SET_VOUCHERS'
      },{
        type: SET_ASSOCIATED_PRODUCTS
      }]
    }
  };
}

export function updateVoucher(storeId, discountId, voucher) {
  return {
    [HANDLE_PROMISE]: {
      promise: voucherService.updateItem(storeId, discountId, voucher),
      actions: [{
        type: 'SET_VOUCHERS'
      }]
    }
  };
}

export function createVoucher(storeId, voucher) {
  return {
    [HANDLE_PROMISE]: {
      promise: voucherService.createItem(storeId, voucher),
      actions: {
        type: 'SET_VOUCHERS'
      }
    }
  };
}

export function removeVoucher(storeId, discountId) {
  return {
    [HANDLE_PROMISE]: {
      promise: voucherService.removeItem(storeId, discountId),
      actions: [{
        type: REMOVE_VOUCHER,
        id: discountId
      },
      {
        type: REMOVE_ENTITY,
        collection: 'vouchers',
        id: discountId

      }]
    }
  };
}


export function updateVoucherFilters(filters = []){
  return {
    type: SET_VOUCHERS_FILTERS,
    data: filters
  };
}

export function getVoucherCoupons(storeId, discountId, page, perPage) {
  return {
    [HANDLE_PROMISE]: {
      promise: voucherService.getCoupons(storeId, discountId, page, perPage),
      actions: {
        type: 'SET_VOUCHER_COUPONS'
      }
    }
  };
}


export function createVoucherCoupons(storeId, discountId, data) {
  return {
    [HANDLE_PROMISE]: {
      promise: voucherService.putCoupons(storeId, discountId, data),
      actions: {
        type: 'SET_ENTITIES',
        collection: 'vouchers',
      }
    }
  };
}

export function cancelVoucherCoupons(storeId, discountId, id) {
  let coupon = {id: id, canceled: true};
  return {
    [HANDLE_PROMISE]: {
      promise: voucherService.putCoupons(storeId, discountId, coupon),
      actions: {
        type: 'SET_ENTITIES',
        collection: 'vouchers',
      }
    }
  };
}

export function deleteVoucherCoupon(storeId, discountId, id) {
  return {
    [HANDLE_PROMISE]: {
      promise: voucherService.deleteCoupon(storeId, discountId, id),
      actions: {
        type: 'SET_ENTITIES',
        collection: 'vouchers',
      }
    }
  };
}

export const importVoucher = (storeId, discountId, csv) => (dispatch) =>{
  dispatch(voucherService.importCoupons(storeId, discountId, csv))
    .then(resp =>{
      const { coupon_import } = resp.data;
      if (!coupon_import) {
        return { error: new Error(`Invalid response`)};
      } else {
        return { data:coupon_import };
      }
    })
    .catch(e => ({ error: e }));
};

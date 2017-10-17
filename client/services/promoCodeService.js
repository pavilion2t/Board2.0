import BindoService from './base/bindoService';
import config from '~/configs/config'
import filterHelper from '~/helpers/filterHelper'

class PromoCodeService extends BindoService {
  saveItem(storeId, promoCode){
    let {discount} = promoCode
    let path = `v2/stores/${storeId}/discounts/${discount.id}/coupons`;
    let {userQuota, totalQuota} = promoCode
    let data = {coupon:{
      individual_user_quota: userQuota===""?null:parseInt(promoCode.userQuota),
      total_quota: totalQuota===""?null:parseInt(promoCode.totalQuota),
    }}
    let api

    if (promoCode.id){
      path+=`/${promoCode.id}`
      api = super.put
    } else {
      data.coupon.is_promo = 1
      data.coupon.code = promoCode.code
      api = super.post
    }

    return api(path, data, config.gateway)
  }
  getItem(storeId, promoCodeId){
    let path = `v2/stores/${storeId}/coupons/${promoCodeId}`
    return super.get(path, null, config.gateway)
  }
  getList(storeId, page = 1, count = 25, filters=[]) {
    let path = `v2/stores/${storeId}/promo_codes`;
    filters = filterHelper.filtersToQueryString(filters)
    let query = {
      page: page,
      per_page: count,
      filters
    };

    return super.get(path, query, config.gateway);
  }
}

export default new PromoCodeService();

import Big from 'big.js';

function getQuota(quota){
  return quota===null?null:Big(quota)
}

export function transformPromoCode({id, code='', individual_user_quota=null, total_quota=null, used_quota=0, discount=null}={}) {
  return {
    id,
    code,
    userQuota: getQuota(individual_user_quota),
    totalQuota: getQuota(total_quota),
    usedQuota: used_quota,
    discount
  }
}

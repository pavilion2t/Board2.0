import BindoService from './base/bindoService';
import config from '~/configs/config'

class DiscountService extends BindoService {
  getList(storeId, page = 1, count = 999, orderBy = 'updated_at') {
    let path = `v2/stores/${storeId}/discounts`;
    let query = {
      page: page,
      per_page: count,
      filters: ["discount_type__equal__1"]
    };

    return super.get(path, query, config.gateway);
  }
}

export default new DiscountService();

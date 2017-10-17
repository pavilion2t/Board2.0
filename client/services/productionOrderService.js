import BindoService from './base/bindoService';
import FilterHelper from '../helpers/filterHelper';
import config from '~/configs/config';

class ProductionOrderService extends BindoService {
  getOrders(storeId, page = 1, count = 25, orderBy = 'name', filters = []) {
    let path = `v2/stores/${storeId}/production_orders`;
    let filtersQueryList = FilterHelper.filtersToQueryString(filters);

    let query = {
      page: page,
      per_page: count,
      order_by: orderBy,
      filters: filtersQueryList
    };

    return super.get(path, query, config.gateway);
  }

  getOrder(id, storeId) {
    let path = `v2/stores/${storeId}/production_orders/${id}`;
    return super.get(path, undefined, config.gateway);
  }

  update(data, id, storeId) {
    let path = `v2/stores/${storeId}/production_orders/${id}`;
    return super.put(path, data, config.gateway);
  }

  create(data, storeId) {
    let path = `v2/stores/${storeId}/production_orders`;
    return super.post(path, data, config.gateway);
  }

  // remove(id, storeId){
  //   let path = `v2/stores/${storeId}/production_orders/${id}`;
  //   return super.delete(path, undefined, config.gateway);
  // }

  approve(id, storeId) {
    let path = `v2/stores/${storeId}/production_orders/${id}/approve`;
    return super.put(path, undefined, config.gateway);
  }

  fulfill(data, id, storeId) {
    let path = `v2/stores/${storeId}/production_orders/${id}/fulfill`;
    return super.put(path, data, config.gateway);
  }

  cancel(id, storeId) {
    let path = `v2/stores/${storeId}/production_orders/${id}/cancel`;
    return super.put(path, undefined, config.gateway);
  }
}

export default new ProductionOrderService();

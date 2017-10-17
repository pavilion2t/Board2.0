import BindoService from './base/bindoService';
import FilterHelper from '../helpers/filterHelper';

class InventoryVarianceService extends BindoService {
  getVariances(storeId, page = 1, count = 25, orderBy = 'created_at', filters = []) {
    let path = `v2/stores/${storeId}/inventory_variances`;
    let filtersQueryList = FilterHelper.filtersToQueryString(filters);

    let query = {
      page: page,
      per_page: count,
      order_by: orderBy,
      order_asc: 'desc',
      filters: filtersQueryList
    };

    return super.get(path, query);
  }
  changeVarianceStatus(storeId, id, changeAction) {
      let path =
        `v2/stores/${storeId}/inventory_variances/${id}/${changeAction}`;
      return super.post(path, undefined);
  }
  getVariance(id, storeId) {
    let path = `v2/stores/${storeId}/inventory_variances/${id}`;
    return super.get(path, undefined);
  }

  update(data, id, storeId) {
    let path = `v2/stores/${storeId}/inventory_variances/${id}`;
    return super.put(path, data);
  }

  create(data, storeId) {
    let path = `v2/stores/${storeId}/inventory_variances`;
    return super.post(path, data);
  }
  getVarianceListings(id, storeId, page = 1, count = 25) {
      let query = {
        page: page,
        per_page: count
      };
      let path = `v2/stores/${storeId}/inventory_variances/${id}/items`;
      return super.get(path, query);
  }
}

export default new InventoryVarianceService();

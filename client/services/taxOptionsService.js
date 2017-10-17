import BindoService from './base/bindoService';

class TaxOptionService extends BindoService {
  getItem(storeId, taxOptionId) {
    let path = `v2/stores/${storeId}/tax_options/${taxOptionId}`;

    return super.get(path);
  }

  getList(storeId, page = 1, count = 999, orderBy = 'updated_at') {
    let path = `v2/stores/${storeId}/tax_options`;
    let query = {
      page: page,
      per_page: count,
      order_by: orderBy
    };

    return super.get(path, query);
  }
}

export default new TaxOptionService();

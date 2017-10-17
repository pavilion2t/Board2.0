import BindoService from './base/bindoService';

class SupplierService extends BindoService {
  getItem(storeId, listingId) {
    let path = `v2/stores/${storeId}/suppliers/${listingId}`;

    return super.get(path, listingId);
  }

  getList(storeId, page = 1, count = 50, orderBy = 'updated_at') {
    let path = `v2/stores/${storeId}/suppliers`;
    let query = {
      page: page,
      per_page: count,
      order_by: orderBy
    };

    return super.get(path, query);
  }
}

export default new SupplierService();

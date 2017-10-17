import BindoService from './base/bindoService';
import FilterHelper from '../helpers/filterHelper';

class CustomerService extends BindoService {
  search(storeId, page = 1, count = 50, orderBy = 'name', filters = []) {
    let path = `v2/stores/${storeId}/customers`;
    let filtersQueryList = FilterHelper.filtersToQueryString(filters);
    let query = {
      page: page,
      per_page: count,
      order_by: 'name',
      filters: filtersQueryList
    };

    return super.get(path, query).then((res) => {
      res.data = res.data.map(d => d.customer);
      return res;
    });
  }

  get(storeId, id) {
    let path = `v2/stores/${storeId}/customers/${id}`;
    return super.get(path).then((res) => {
      let { customer } = res;
      return customer;
    });
  }
}

export default new CustomerService();

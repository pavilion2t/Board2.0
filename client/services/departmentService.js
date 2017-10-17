import BindoService from './base/bindoService';

class DepartmentService extends BindoService {
  getItem(storeId, departmentId) {
    let path = `v2/stores/${storeId}/departments/${departmentId}`;

    return super.get(path, departmentId);
  }

  getList(storeId, page = 1, count = 999, orderBy = 'updated_at') {
    let path = `v2/stores/${storeId}/departments`;
    let query = {
      page: page,
      per_page: count,
      order_by: orderBy
    };

    return super.get(path, query);
  }
}

export default new DepartmentService();

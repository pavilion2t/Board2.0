import BindoService from './base/bindoService';
import FilterHelper from '../helpers/filterHelper';
import config from '../configs/config';

import { normalize, arrayOf } from 'normalizr';
import { OrderCorrespondenceSchema } from '../store/middlewares/schema';

class OrderCorrespondenceService extends BindoService {

  getList(storeId, page = 1, count = 50, orderBy = 'name', filters = [], params = {}) {
    let path = `v2/stores/${storeId}/order_correspondences`;
    let filtersQueryList = FilterHelper.filtersToQueryString(filters);
    let query = {
      page: page,
      per_page: count,
      order_by: 'name',
      filters: filtersQueryList,
      ...params
    };

    return super.get(path, query, config.gateway).then(
      res => {
        let { data, ...meta } = res;
        let ret = Object.assign({}, {meta}, normalize(data.order_correspondences, arrayOf(OrderCorrespondenceSchema)));
        return ret;
      }
    );
  }

}

export default new OrderCorrespondenceService();

import BindoService from './base/bindoService';
import FilterHelper from '../helpers/filterHelper';

class KdsService extends BindoService {
  getStations(storeId, page = 1, count = 25, orderBy = 'name', filters = []) {
    let path = `v2/stores/${storeId}/stations`;
    let filtersQueryList = FilterHelper.filtersToQueryString(filters);

    let query = {
      page: page,
      per_page: count,
      order_by: 'name',
      filters: filtersQueryList
    };

    return super.get(path, query);
  }

  linkStationToStore(data, storeId) {
    let path = `v2/stores/${storeId}/stations`;

    return super.post(path, {station: data});
  }

  getStation(id, storeId) {
    let path = `v2/stores/${storeId}/stations/${id}`;

    return super.get(path);
  }

  updateStation(data, id, storeId) {
    let path = `v2/stores/${storeId}/stations/${id}`;

    return super.put(path, {station: data});
  }

  removeStation(id, storeId) {
    let path = `v2/stores/${storeId}/stations/${id}`;

    return super.delete(path);
  }
}

export default new KdsService();

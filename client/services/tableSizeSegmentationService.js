import BindoService from './base/bindoService';
import config from '~/configs/config';

class TableSizeSegmentationService extends BindoService {
  get(storeId) {
    let path = `v2/stores/${storeId}/party_size_segments/current`;
    return super.get(path, undefined, config.gateway);
  }

  update(data, storeId){
    let path = `v2/stores/${storeId}/party_size_segments/current`;
    return super.put(path, { party_size_segment: data }, config.gateway);
  }

  create(data, storeId){
    let path = `v2/stores/${storeId}/party_size_segments`;
    return super.post(path, { party_size_segment: data }, config.gateway);
  }
  remove(storeId){
    let path = `v2/stores/${storeId}/party_size_segments`;
    return super.delete(path, config.gateway);
  }

  refresh(storeId) {
    let path = `v2/stores/${storeId}/party_size_segments/refresh_now`;
    return super.get(path, undefined, config.gateway);
  }
}

export default new TableSizeSegmentationService();

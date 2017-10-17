import BindoService from './base/bindoService';

class QueueingDisplayService extends BindoService {
  linkUpDisplay(key, storeId) {
    let path = `v2/stores/${storeId}/stations`;
    return super.post(path, { station: { station_key: key } });
  }
}

export default new QueueingDisplayService();

import BindoService from './base/bindoService';
import config from '../configs/config';

class UnitGroupsService extends BindoService {

  getItem(storeId, groupId) {
    let path = `v2/stores/${storeId}/unit_groups/${groupId}`;
    return this.get(path, null, config.bindo);
  }

}

export default new UnitGroupsService();
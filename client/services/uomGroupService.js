import BindoService from './base/bindoService';

class UomGroupService extends BindoService {
  create(unit_group, storeId) {
    let path = `v2/stores/${storeId}/unit_groups`;

    return super.post(path, { unit_group });
  }

  getGroups(storeId) {
    let path = `v2/stores/${storeId}/unit_groups`;

    return super.get(path);
  }

  getGroup(id, storeId) {
    let path = `v2/stores/${storeId}/unit_groups/${id}`;

    return super.get(path);
  }

  update(unit_group, id, storeId) {
    let path = `v2/stores/${storeId}/unit_groups/${id}`;

    return super.put(path, { unit_group });
  }

  remove(id, storeId) {
    let path = `v2/stores/${storeId}/unit_groups/${id}`;

    return super.delete(path);
  }
}

export default new UomGroupService();

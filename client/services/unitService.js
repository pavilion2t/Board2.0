import BindoService from './base/bindoService';

class UnitService extends BindoService {
  create(unit, unitGroupId, storeId) {
    let path = `v2/stores/${storeId}/unit_groups/${unitGroupId}/units`;

    return super.post(path, { unit });
  }

  getUnits(unitGroupId, storeId) {
    let path = `v2/stores/${storeId}/unit_groups/${unitGroupId}/units`;

    return super.get(path);
  }

  getUnit(id, unitGroupId, storeId) {
    let path = `v2/stores/${storeId}/unit_groups/${unitGroupId}/units/${id}`;

    return super.get(path);
  }

  update(unit, id, unitGroupId, storeId) {
    let path = `v2/stores/${storeId}/unit_groups/${unitGroupId}/units/${id}`;

    return super.put(path, { unit });
  }

  remove(id, unitGroupId, storeId) {
    let path = `v2/stores/${storeId}/unit_groups/${unitGroupId}/units/${id}`;

    return super.delete(path);
  }
}

export default new UnitService();

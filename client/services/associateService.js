import BindoService from './base/bindoService';
import { Schema, normalize, arrayOf } from 'normalizr';

const AssociateSchema = new Schema('associates');

class AssociateService extends BindoService {
  get(store_id, id) {
    let path = `v2/stores/${store_id}/associates`;

    if (id) {
      path = path + '/' + id;
    }
    return super.get(path, { per_page: 999999 }).then((res) => {
      let data = res.map(r => r.user);
      return normalize(data, arrayOf(AssociateSchema));
    });
  }

  create(store_id, data) {
    let path = `v2/stores/${store_id}/new_associate`;
    return super.post(path, data).then((res) => {
      return normalize(res.user, AssociateSchema);
    });
  }

  add(store_id, data) {
    let path = `v2/stores/${store_id}/associates`;
    return super.post(path, data).then((res) => {
      return normalize(res.user, AssociateSchema);
    });
  }

  promote(store_id, id, role_id) {
    let path = `v2/stores/${store_id}/associates/${id}/promote`;
    let params = { associate: {role_id: role_id} };
    return super.put(path, params).then((res) => {
      return normalize(res.user, AssociateSchema);
    });
  }

  remove(store_id, id) {
    let path = `v2/stores/${store_id}/associates/${id}`;
    return super.delete(path).then((res) => {
      return normalize(res.user, AssociateSchema);
    });
  }
}

export default new AssociateService;

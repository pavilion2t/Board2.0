import BindoService from './base/bindoService';
import config from '../configs/config';

class StoreService extends BindoService {
  get(id) {
    let path = 'v2/stores';

    if (id) {
      path = path + '/' + id;
    }
    return super.get(path, { per_page: 999999 });
  }
  update(id, data) {
    let path = `v2/stores/${id}`;

    return super.put(path, data);
  }

  getModule(id) {
    let path = `v2/stores/${id}/module`;
    return super.get(path);
  }

  updateModule(id, data) {
    let path = `v2/stores/${id}/module`;
    return super.put(path, data);
  }

  getPermissions(id) {
    let path = `v2/stores/${id}/store_permissions`;
    return super.get(path);
  }


  getChainInfo(id) {
    let path = `v2/stores/${id}/chain_info`;
    return super.get(path);
  }

  getOtherPaymentInstrument(id) {
    let path = `v2/stores/${id}/other_payment_instruments`;
    return super.get(path, null, config.gateway);
  }

  getPolicy(id) {
    let path = `v2/stores/${id}/policy`;
    return super.get(path);
  }

  updatePolicy(id, data) {
    let path = `v2/stores/${id}/policy`;
    return super.put(path, data);
  }

}

export default new StoreService;

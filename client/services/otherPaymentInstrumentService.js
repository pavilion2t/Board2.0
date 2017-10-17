import config from '../configs/config';
import BindoService from './base/bindoService';

class otherPaymentInstrumentService extends BindoService {

  getAll(storeId) {
    let path = `v2/stores/${storeId}/other_payment_instruments`;
    return this.get(path, null, config.gateway);
  }

  updateAll(storeId, data) {
    let path = `v2/stores/${storeId}/other_payment_instruments/update_all`;
    return this.post(path, data, config.gateway);
  }
}

export default new otherPaymentInstrumentService();

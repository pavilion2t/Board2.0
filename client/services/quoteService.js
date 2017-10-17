import BindoService from './base/bindoService';
import config from '../configs/config';

class QuoteService extends BindoService {

  getItem(storeId, number) {
    let path = `v2/stores/${storeId}/quotes/${number}`;
    return this.get(path, undefined, config.gateway);
  }

  createItem(storeId,  data) {
    let path = `v2/stores/${storeId}/quotes`;
    return this.post(path, data, config.gateway);
  }

  updateItem(storeId, number, data) {
    let path = `v2/stores/${storeId}/quotes/${number}`;
    return this.put(path, data, config.gateway);
  }

  convertToInvoice(storeId, number){
    let path = `v2/stores/${storeId}/quotes/${number}/convert_to_invoice`;
    return this.post(path, undefined, config.gateway);
  }

  cancelItem(storeId, number){
    let path = `v2/stores/${storeId}/quotes/${number}/cancel`;
    return this.post(path, undefined, config.gateway);
  }

}

export default new QuoteService();

import BindoService from './base/bindoService';
import config from '../configs/config';

class InvoiceService extends BindoService {

  getItem(storeId, number) {
    let path = `v2/stores/${storeId}/invoices/${number}`;
    return this.get(path, undefined, config.gateway);
  }

  createItem(storeId,  data) {
    let path = `v2/stores/${storeId}/invoices`;
    return this.post(path, data, config.gateway);
  }

  updateItem(storeId, number, data) {
    let path = `v2/stores/${storeId}/invoices/${number}`;
    return this.put(path, data, config.gateway);
  }

  cancelItem(storeId, number){
    let path = `v2/stores/${storeId}/invoices/${number}/cancel`;
    return this.post(path, undefined, config.gateway);
  }

  returnMoney(storeId, number, transactions_to_be_refunded = []){
    let path = `v2/stores/${storeId}/invoices/${number}/returns`;
    const data = {
      return: { transactions_to_be_refunded }
    };
    return this.post(path, data, config.gateway);
  }

  payMoney(storeId, number, payment){
    const path = `v2/stores/${storeId}/invoices/${number}/pay`;
    const data = {
      order: { payment }
    };
    return this.post(path, data, config.gateway);
  }

  getItemHistory(storeId, number) {
    let path = `v2/stores/${storeId}/quotes_and_invoices/${number}/history`;
    return this.get(path, undefined, config.gateway);
  }

  voidTransaction(storeId, number, transactionId){
    const path = `v2/stores/${storeId}/invoices/${number}/transactions/${transactionId}/void`;
    return this.put(path, undefined, config.gateway);
  }

  exportPdf(storeId, number){
    const path = `/v2/stores/${storeId}/invoices/${number}/download`;
    const data = {
      template_type: 'airprint_invoice',
    };
    return this.get(path, data, config.gateway);
  }

  voidItem(storeId, number){
    const path = `v2/stores/${storeId}/invoices/${number}/void`;
    return this.post(path, undefined, config.gateway);
  }
}

export default new InvoiceService();

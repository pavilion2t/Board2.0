import BindoService from './base/bindoService';

class LineItemStatusService extends BindoService {
  createLineItemStatus(status, color, storeId) {
    let path = `v2/stores/${storeId}/line_item_statuses`;

    return super.post(path, { "line_item_status": { status, color } });
  }

  getLineItemStatuses(storeId) {
    let path = `v2/stores/${storeId}/line_item_statuses`;

    return super.get(path);
  }

  updateLineItemStatus(id, status, storeId) {
    let path = `v2/stores/${storeId}/line_item_statuses/${id}`;

    return super.put(path, status);
  }

  removeLineItemStatus(id, storeId) {
    let path = `v2/stores/${storeId}/line_item_statuses/${id}`;

    return super.delete(path);
  }
}

export default new LineItemStatusService();

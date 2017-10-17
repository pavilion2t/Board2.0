import BindoService from './base/bindoService';
import config from '../configs/config';
import FilterHelper from '../helpers/filterHelper';
import { omit } from 'lodash';

import { normalize, arrayOf } from 'normalizr';
import { DeliveryOrderSchema, DeliveryOrderLogsSchema } from '../store/middlewares/schema';

class DeliveryOrderService extends BindoService {

    getList(storeId, page = 1, perPage = 25, orderBy = 'created_at', filters = []) {
        let path = `v2/stores/${storeId}/delivery_orders`;

        let filtersQueryList = FilterHelper.filtersToQueryString(filters);
        let query = {
            page,
            per_page: perPage,
            order_by: orderBy,
            filters: filtersQueryList
        };

        return super.get(path, query, config.gateway).then((res) => {
            // res.delivery_orders for mock server
            let deliveryOrders = res.delivery_orders || res.data.delivery_orders;

            let deliveryMeta = omit(res, 'data');

            //normalize
            let normalized = normalize(deliveryOrders, arrayOf(DeliveryOrderSchema));

            normalized.meta = deliveryMeta;
            return normalized;
        });
    }

    getItem(storeId, deliveryId) {
        let path = `v2/stores/${storeId}/delivery_orders/${deliveryId}`;
        return super.get(path, null, config.gateway).then(res => normalize(res.delivery_order, DeliveryOrderSchema));
    }

    getItems(storeId, filters = {}, page = 1, perPage = 25, orderBy = 'created_at'){
      const path = `v2/stores/${storeId}/delivery_orders`;
      const params = {
        ...filters,
        per_page: perPage,
        page,
        order_by: orderBy,
      };
      return super.get(path, params, config.gateway);
    }

    createItem(storeId, data) {
        let path = `v2/stores/${storeId}/delivery_orders`;

        return super.post(path, data, config.gateway).then((res) => {
            let deliveryOrder = res.delivery_order;

            //normalize
            return normalize(deliveryOrder, DeliveryOrderSchema);
        });
    }

    updateItem(storeId, orderId, data) {
        let path = `v2/stores/${storeId}/delivery_orders/${orderId}`;
        let {delivery_order, delivery_order_items} = data;
        let {order_ids = [], stock_transfer_ids = []} = delivery_order;
        if (order_ids.length === 0) {
            delivery_order = Object.assign({}, delivery_order);
            delete delivery_order.order_ids;
        }
        if (stock_transfer_ids.length === 0) {
            delivery_order = Object.assign({}, delivery_order);
            delete delivery_order.stock_transfer_ids;
        }

        return super.put(path, { delivery_order, delivery_order_items }, config.gateway).then((res) => {
            let deliveryOrder = res.delivery_order;

            //normalize
            return normalize(deliveryOrder, DeliveryOrderSchema);
        });

    }

    cancelItem(storeId, orderId) {
        let path = `v2/stores/${storeId}/delivery_orders/${orderId}/cancel`;

        return super.put(path, undefined, config.gateway).then((res) => {
            let deliveryOrder = res.delivery_order;

            //normalize
            return normalize(deliveryOrder, DeliveryOrderSchema);
        });
    }

    fulfillItem(storeId, orderId, data) {
        let path = `v2/stores/${storeId}/delivery_orders/${orderId}/receive`;

        return super.put(path, data, config.gateway).then((res) => {
            let deliveryOrder = res.delivery_order;

            //normalize
            return normalize(deliveryOrder, DeliveryOrderSchema);
        });
    }

    getItemLogs(storeId, orderId) {
        let path = `v2/stores/${storeId}/delivery_orders/${orderId}/histories`;

        return super.get(path, null, config.gateway).then((res) => {
            let { histories, ...meta } = res;
            let normalized = normalize(histories, arrayOf(DeliveryOrderLogsSchema));
            normalized.meta = meta;
            return normalized;
        });
    }
}

export default new DeliveryOrderService();

import map from 'lodash/map';
import { normalize , arrayOf } from 'normalizr';

import { SupplierSchema } from '../store/middlewares/schema';
import supplierService from '../services/supplierService';
import { SET_ENTITIES_SUPPLIERS } from './entityActions';

// LIST
export const SET_SUPPLIERS = 'SET_SUPPLIERS';
export const SET_SUPPLIERS_STATUS = 'SET_SUPPLIERS_STATUS';

// ITEM
export const SET_SUPPLIER = 'SET_SUPPLIER';

export function getSuppliers(storeId, page, count, orderBy) {
  return dispatch => {
    return supplierService.getList(storeId, page, count, orderBy)
      .then(data => {
        data.data = map(data.data, (d) => d.supplier);
        let suppliers = normalize(data, {
          data: arrayOf(SupplierSchema)
        });

        dispatch({ type: SET_ENTITIES_SUPPLIERS, data: suppliers.entities });
        dispatch({ type: SET_SUPPLIERS, data: { storeId: storeId, supplierIds: suppliers.result.data }});
      });
  };
}

export function getSupplier(storeId, supplierId) {
  return dispatch => {
    return supplierService.getItem(storeId, supplierId)
      .then(data => {
        let suppliers = normalize({data: [data.supplier]}, {
          data: arrayOf(SupplierSchema)
        });

        dispatch({ type: SET_ENTITIES_SUPPLIERS, data: suppliers.entities });
        dispatch({ type: SET_SUPPLIERS, data: { storeId: storeId, supplierIds: suppliers.result.data }});
      });
  };
}

import { camelizeKeys } from 'humps';
import billOfMaterialsService from '~/services/billOfMaterialsService';

export const GET_BILL_OF_MATERIALS_COLLECTION_REQUEST = 'GET_BILL_OF_MATERIALS_COLLECTION_REQUEST';
export const GET_BILL_OF_MATERIALS_COLLECTION_SUCCESS = 'GET_BILL_OF_MATERIALS_COLLECTION_SUCCESS';
export const GET_BILL_OF_MATERIALS_COLLECTION_FAILURE = 'GET_BILL_OF_MATERIALS_COLLECTION_FAILURE';
// export const GET_BILL_OF_MATERIALS_REQUEST = 'GET_BILL_OF_MATERIALS_REQUEST';
// export const GET_BILL_OF_MATERIALS_SUCCESS = 'GET_BILL_OF_MATERIALS_SUCCESS';
// export const GET_BILL_OF_MATERIALS_FAILURE = 'GET_BILL_OF_MATERIALS_FAILURE';
// export const CREATE_BILL_OF_MATERIALS_REQUEST = 'CREATE_BILL_OF_MATERIALS_REQUEST';
// export const CREATE_BILL_OF_MATERIALS_SUCCESS = 'CREATE_BILL_OF_MATERIALS_SUCCESS';
// export const CREATE_BILL_OF_MATERIALS_FAILURE = 'CREATE_BILL_OF_MATERIALS_FAILURE';
// export const UPDATE_BILL_OF_MATERIALS_REQUEST = 'UPDATE_BILL_OF_MATERIALS_REQUEST';
// export const UPDATE_BILL_OF_MATERIALS_SUCCESS = 'UPDATE_BILL_OF_MATERIALS_SUCCESS';
// export const UPDATE_BILL_OF_MATERIALS_FAILURE = 'UPDATE_BILL_OF_MATERIALS_FAILURE';
// export const REMOVE_BILL_OF_MATERIALS_REQUEST = 'REMOVE_BILL_OF_MATERIALS_REQUEST';
// export const REMOVE_BILL_OF_MATERIALS_SUCCESS = 'REMOVE_BILL_OF_MATERIALS_SUCCESS';
// export const REMOVE_BILL_OF_MATERIALS_FAILURE = 'REMOVE_BILL_OF_MATERIALS_FAILURE';

export const getCollection = (listingId, storeId, deep = 1) => (dispatch) => {
  if (Array.isArray(listingId)) {
    let promises = listingId.map(id => billOfMaterialsService.getCollections(id, storeId, deep).then(resp => {
        resp = camelizeKeys(resp);
        let data = resp.billOfMaterials;
        if (data) {
          return { id: id, data };
        } else {
          let error = new Error('Invalid response.');
          return { id: id, error };
        }
      }
    ));
    return Promise.all(promises)
      .then(resp => {
        let bomMap = {};
        let hasError;
        resp.forEach(d => {
          const { id, data, error } = d;
          bomMap[id] = data;
          hasError = hasError || error;
        });
        return { data: bomMap, error: hasError };
      })
      .catch(error => ({ error }));
  } else {
    return billOfMaterialsService.getCollections(listingId, storeId, deep)
      .then(resp => {
        resp = camelizeKeys(resp);
        let data = resp.billOfMaterials;
        if (data) {
          return { data };
        } else {
          let error = new Error('Invalid response.');
          return { error };
        }
      })
      .catch(error => ({ error }));
  }
};

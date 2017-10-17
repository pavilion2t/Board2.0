import keykey from 'keykey';
import { camelizeKeys } from 'humps';

import inventoryService from '~/services/inventoryService';
import { startFetch, stopFetch } from '../baseActions';

export const actionTypes = keykey([
  'ADD_LISTING_BY_BARCODE_CHANGE_INPUT',
  'ADD_LISTING_BY_BARCODE_SUBMIT_REQUEST',
  'ADD_LISTING_BY_BARCODE_SUBMIT_SUCCESS',
  'ADD_LISTING_BY_BARCODE_SUBMIT_FAILURE',
]);

export const changeInput = (value) => ({ type: actionTypes['ADD_LISTING_BY_BARCODE_CHANGE_INPUT'], value });
export const submit = (value, storeId, baseSearch) => (dispatch) => {
  dispatch({ type: actionTypes['ADD_LISTING_BY_BARCODE_SUBMIT_REQUEST'] });
  dispatch(startFetch());
  return inventoryService.searchByBarcode(storeId, value, baseSearch)
    .then(res => {
      const { data } = res;
      if (data.length) {
        const items = camelizeKeys(data);
        const listings = items.map((d) => {
          return d.listing;
        });
        const payload = { data: listings };
        dispatch(stopFetch());
        dispatch({ type: actionTypes['ADD_LISTING_BY_BARCODE_SUBMIT_SUCCESS'], data: payload });
        return payload;
      } else {
        throw new Error('Barcode not exist');
      }
    })
    .catch(error => {
      dispatch(stopFetch());
      alert(error.message);
      dispatch({ type: actionTypes['ADD_LISTING_BY_BARCODE_SUBMIT_FAILURE'], error });
      return { error };
    });
};

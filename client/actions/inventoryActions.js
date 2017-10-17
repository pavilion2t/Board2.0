import { map } from 'lodash';
import { normalize , arrayOf } from 'normalizr';
import { camelizeKeys } from 'humps';

import { ListingSchema, TaxOptionSchema } from '../store/middlewares/schema';
import inventoryService from '../services/inventoryService';
import taxOptionsService from '../services/taxOptionsService';
import {
  SET_ENTITIES,
  SET_ENTITIES_LISTINGS,
  ADD_ENTITY_LISTING_GRAPHIC,
  REMOVE_ENTITY_LISTING_GRAPHIC,
  ADD_ENTITY_LISTING_CUSTOM_ITEM,
  UPDATE_ENTITY } from './entityActions';

import { startFetch, stopFetch } from './baseActions';
import { alert, removeAlert } from './alertActions';

// LIST
export const SET_LISTINGS = 'SET_LISTINGS';
export const SET_LISTINGS_STATUS = 'SET_LISTINGS_STATUS';
export const SET_LISTING_QUANTITYHISTORY = 'SET_LISTING_QUANTITYHISTORY';
export const REMOVE_LISTING = 'REMOVE_LISTING';

export const REQUEST_VALIATATED = 'REQUEST_VALIATATED';
export const GET_IMPORTER_STATUS = 'GET_IMPORTER_STATUS';
export const REQUEST_UPLOAD_IMAGES = 'REQUEST_UPLOAD_IMAGES';

export const WAIT_SERVER_UPLOAD_IMAGES = 'WAIT_SERVER_UPLOAD_IMAGES';
export const UPLOADING_IMAGES = 'UPLOADING_IMAGES';
export const FINISH_UPLOAD_IMAGES = 'FINISH_UPLOAD_IMAGES';
export const ERROR_UPLOAD_IMAGES = 'ERROR_UPLOAD_IMAGES';


export function updateFilters(filters = []){
  let listingStatus ={
    filters: filters
  };

  return {
    type: SET_LISTINGS_STATUS,
    data: listingStatus
  };
}


export function validateImportInventory(storeId, file) {
  return dispatch => {
    return inventoryService.validateImportInventory(storeId, file).then(data => {
      inventoryService.getImagesUploadURL(storeId, data.id).then(uploaded => {
        dispatch({ type: REQUEST_VALIATATED, data: data, upload_url: uploaded.upload_url});
      });
    });
  };
}

export function postImportInventory(storeId, id) {
  return dispatch => {
    return inventoryService.postImportInventory(storeId, id).then(data => {
      dispatch({ type: REQUEST_VALIATATED, data: data});
    });
  };
}

export function postImagesToS3(path, file, store_id, import_id) {
  return dispatch => {
    let isProgressed = false;
    //if server response time take too long, xhr progress will fire twice, so we need it here.
    let progress = (evt) => {
      if (!isProgressed) {
        let percentComplete = Math.round(evt.loaded * 100 / evt.total);

        let data = {
          percentComplete: percentComplete
        };

        if (percentComplete === 100){
          dispatch({ type: WAIT_SERVER_UPLOAD_IMAGES, data });
          isProgressed = true;
        } else {
          dispatch({ type: UPLOADING_IMAGES, data });
        }
      }
    };
     return inventoryService.postImagesToS3(path, file, progress).then(data => {
      inventoryService.postImagesToValidate(store_id, import_id).then(data => {
        dispatch({ type: FINISH_UPLOAD_IMAGES, id:  import_id});
      });

    }).catch((e) => {
      dispatch({ type: ERROR_UPLOAD_IMAGES, data: e });
    });
  };
}

export function postCustomItem(storeId, listing) {
  return dispatch => {
    return inventoryService.postCustomItem(storeId, listing).then(data => {
      dispatch({ type: ADD_ENTITY_LISTING_CUSTOM_ITEM, data: data });
      return data[0].listing;
    });
  };
}

export function postItem(storeId, listing) {
  return dispatch => {
    return inventoryService.postItem(storeId, listing).then(data => {
      dispatch({ type: ADD_ENTITY_LISTING_CUSTOM_ITEM, data: data });
      return data[0].listing;
    });
  };
}

export function getImportInventory(storeId, inventory_import_id) {
  return dispatch => {
    return inventoryService.getImportInventory(storeId, inventory_import_id).then(data => {
      if (data.validation_progress_rate === "1.0") {
        inventoryService.getImagesUploadURL(storeId, data.id).then(uploaded => {
          data.upload_url = uploaded.upload_url;
          dispatch({ type: GET_IMPORTER_STATUS, data: data, upload_url: uploaded.upload_url});
        });
      } else {
        dispatch({ type: GET_IMPORTER_STATUS, data });
      }

    });
  };
}

export function getListings(storeId, page, count, orderBy, filters = []) {
  return dispatch => {
    dispatch(startFetch());
    dispatch({ type: SET_LISTINGS_STATUS, data: {loading: true} });

    return inventoryService.getList(storeId, page, count, orderBy, filters)
      .then(data => {
        data.data = map(data.data, (d) => d.listing);
        let listings = normalize(data, {
          data: arrayOf(ListingSchema)
        });
        let listingStatus = {
          totalCount: data.totalCount,
          totalPages: data.totalPages,
          page: data.page,
          count: data.count,
          filters: filters,
          loading: false,
        };

        dispatch({ type: SET_ENTITIES_LISTINGS, data: listings.entities });
        dispatch({ type: SET_LISTINGS_STATUS, data: listingStatus });
        dispatch({ type: SET_LISTINGS, data: listings.result.data });
        dispatch(stopFetch());

      }).catch(ex => {
        dispatch(stopFetch());

        let listingStatus = {
          loading: false,
        };
        dispatch({ type: SET_LISTINGS_STATUS, data: listingStatus });

      });
  };
}

export function getListingsByUPC(storeId, page, count, orderBy, filters = []) {
  return dispatch => {
    return inventoryService.getList(storeId, page, count, orderBy, filters);
  };
}

export function getProductByUPC(upc) {
  return dispatch => {
    return inventoryService.getProductByUPC(upc);
  };
}


export function getListing(storeId, listingId) {
  return dispatch => {
    return inventoryService.getItem(storeId, listingId)
      .then(data => {
        let listings = normalize({data: [data.listing]}, {
          data: arrayOf(ListingSchema)
        });

        dispatch({ type: SET_ENTITIES_LISTINGS, data: listings.entities });
      });
  };
}

export function deleteListing(storeId, listingId) {
  return dispatch => {
    return inventoryService.deleteItem(storeId, listingId)
      .then(data => {

        dispatch({ type: REMOVE_LISTING, id: listingId });
      });
  };
}

export function updateListing(storeId, listingId, data) {
  return dispatch => {
    return inventoryService.updateItem(storeId, listingId, data)
      .then(res => {
        dispatch({
          type: UPDATE_ENTITY,
          collection: 'listings',
          id: listingId,
          data: data
        });
      });
  };
}

export function getQuantityHistory(storeId, listingId) {
  return dispatch => {
    return inventoryService.getQuantityHistory(storeId, listingId)
      .then(data => {
        dispatch({
          type: UPDATE_ENTITY,
          collection: 'listings',
          id: listingId,
          data: { quantity_histories: data }
        });
      });
  };
}

export function getProductGraphics(listingId, productId) {
  return dispatch => {
    return inventoryService.getProductGraphics(productId)
      .then(data => {
        let product_graphics = map(data, 'product_graphic');
        dispatch({
          type: UPDATE_ENTITY,
          collection: 'listings',
          id:listingId,
          data: { product_graphics: product_graphics }
        });
      });
  };
}

export function uploadProductGraphics(listingId, productId, files) {
  return dispatch => {
    files.forEach(file => {
      dispatch(alert('warning', 'Uploading file ' + file.name));

      inventoryService.uploadProductGraphics(productId, file)
        .then(data => {
          dispatch({
            type: ADD_ENTITY_LISTING_GRAPHIC,
            listingId: listingId,
            graphicData: data.product_graphic,
          });

          dispatch(removeAlert('Uploading file ' + file.name));

        }).catch(()=>{
          dispatch(removeAlert('Uploading file ' + file.name));
        });
    });
  };
}

export function deleteProductGraphics(listingId, productId, graphicIds) {
  return dispatch => {
    graphicIds.forEach(graphicId => {
      inventoryService.deleteProductGraphics(productId, graphicId)
        .then(data => {
          dispatch({
            type: REMOVE_ENTITY_LISTING_GRAPHIC,
            listingId: listingId,
            graphicId: graphicId,
          });
        });
    });
  };
}

export function setDefaultProductGraphics(listingId, productId, graphicId) {
  return dispatch => {
    return inventoryService.setDefaultProductGraphics(productId, graphicId);
  };
}

export function getTaxOptions(storeId, listingId) {
  return dispatch => {
    return taxOptionsService.getList(storeId)
      .then(res => {
        let taxOptions = map(res.data, d => d.tax_option);
        let normalizedData = normalize(taxOptions, arrayOf(TaxOptionSchema));
        dispatch({
          type: SET_ENTITIES,
          collection: 'taxOptions',
          data: normalizedData.entities.taxOptions
        });
      });
  };
}

export const getListingItems = (listingIds, storeId) => (dispatch) => {
  return inventoryService.getItems(storeId, listingIds)
    .then(resp => {
      resp = camelizeKeys(resp);
      let data = resp.data.listings;
      if (Array.isArray(data)) {
        return { data };
      } else {
        let error = new Error('Invalid response.');
        return { error };
      }
    })
    .catch(error => ({ error }));
};

import { decamelizeKeys } from 'humps';

import BindoService from './base/bindoService';
import config from '../configs/config';
import FilterHelper from '../helpers/filterHelper';
import { uniqBy, merge } from 'lodash';


// import { normalize, arrayOf } from 'normalizr';
// import { ListingSchema } from '../store/middlewares/schema';

class InventoryService extends BindoService {
  validateImportInventory(storeId, data) {
    let path = `v2/stores/${storeId}/inventory_imports/`;
    return this.postFile(path, data);
  }

  postImportInventory(storeId, inventory_import_id) {
    let path = `v2/stores/${storeId}/inventory_imports/${inventory_import_id}/import`;
    let query = {
      inventory_import_id: inventory_import_id
    };
    return this.post(path, query);
  }

  postImagesToImportInventory(storeId, data, inventory_import_id, progress) {
    let path = `v2/stores/${storeId}/inventory_imports/${inventory_import_id}/images`;
    return this.postFileWithProgress(path, data, progress);
  }

  postImagesToS3(path, data, progress) {
    return this.postFileWithProgress(path, data, progress);
  }

  postImagesToValidate(storeId, inventory_import_id) {
    let path = `v2/stores/${storeId}/inventory_imports/${inventory_import_id}/verify_uploaded_images`;
    return this.put(path);
  }

  getImagesUploadURL(storeId, inventory_import_id) {
    let path = `v2/stores/${storeId}/inventory_imports/${inventory_import_id}/image_import_url`;
    return this.get(path);
  }

  getImportInventory(storeId, inventory_import_id) {
    let path = `v2/stores/${storeId}/inventory_imports/${inventory_import_id}`;
    return this.get(path);
  }

  postCustomItem(storeId, listing) {
    listing.barcode = listing.listing_barcode;   // POST .barcode will update .listing_barcode

    let path = `v2/stores/${storeId}/unique_products/`;
    let data = {
      unique_product: listing
    };
    return this.post(path, data);
  }

  postItem(storeId, listing) {
    let path = `v2/stores/${storeId}/listings/`;
    let data = {
      listing: listing
    };
    return this.post(path, data);
  }

  getItem(storeId, listingId) {
    let path = `v2/stores/${storeId}/listings/${listingId}`;

    return this.get(path);
  }

  getItems(storeId, listingIds) {
    let path = `v2/stores/${storeId}/listings/by`;
    let query = {
      listing_ids: listingIds.join(','),
    };

    return this.get(path, query);
  }

  updateItem(storeId, listingId, data) {
    data.barcode = data.listing_barcode;   // PUT .barcode will update .listing_barcode

    let path = `v2/stores/${storeId}/listings/${listingId}`;

    return this.put(path, { listing: data });
  }

  deleteItem(storeId, listingId) {
    let path = `v2/stores/${storeId}/listings/${listingId}`;

    return this.delete(path);
  }

  getList(storeId, page = 1, count = 25, orderBy = 'name', filters = []) {
    let path = `v2/stores/${storeId}/listings`;
    let filtersQueryList = FilterHelper.filtersToQueryString(filters);
    let query = {
      page: page,
      per_page: count,
      order_by: 'name',
      filters: filtersQueryList
    };

    return this.get(path, query);
  }

  search(storeId, page = 1, count = 50, orderBy = 'name', filters = []) {
    let path = `v2/stores/${storeId}/listings`;
    let filtersQueryList = FilterHelper.filtersToQueryString(filters);
    let query = {
      page: page,
      per_page: count,
      order_by: 'name',
      filters: filtersQueryList
    };

    return this.get(path, query).then((res) => {
      res.data = res.data.map(d => d.listing);
      return res;
    });
  }

  getQuantityHistory(storeId, listingId) {
    let path = `v3/stores/${storeId}/listings/${listingId}/quantity_histories`;

    return this.get(path, null, config.analytics);
  }

  getProductGraphics(productId) {
    let path = `v2/products/${productId}/product_graphics`;

    return this.get(path);
  }
  uploadProductGraphics(product_id, file) {
    let fd = new FormData();
    fd.append('product_graphic[image]', file);
    fd.append('product_graphic[default]', false);

    return this.postFile(`v2/products/${product_id}/product_graphics`, fd);
  }

  deleteProductGraphics(product_id, graphic_id) {
    let path = `v2/products/${product_id}/product_graphics/${graphic_id}`;

    return this.delete(path);
  }
  setDefaultProductGraphics(product_id, graphic_id) {
    let path = `v1/products/${product_id}/product_graphics/${graphic_id}/mark_as_default`;
    return super.put(path);
  }

  getProductByUPC(upc) {
    let path = `v2/products/${upc}/name`;
    return super.get(path);
  }

  searchEs(storeIds, searchParams = {}, page = 1, perPage = 20, fields) {
    const search = { ...searchParams };
    search.filter = { ...search.filter, storeId: storeIds };
    search.sort = search.sort || [ { createdAt: 'desc' } ]; // Default sroting
    if (fields){ search.fields = fields; }
    const data = decamelizeKeys({
      search,
      page,
      perPage,
    });
    const path = 'v2/listings/search';
    return this.post(path, data);
  }

  searchByBarcode(storeId, barcode, baseSearch) {
    let isExactMatch = false;
    let bcode = barcode;
    let typeOfCodeToSearch = ['upc', 'ean13', 'listing_barcode', 'bpid'];
    if (/^BP-.+/i.test(bcode)){
      isExactMatch = true;
      bcode = bcode.slice(3);
      typeOfCodeToSearch = ['bpid'];
    }
    const promises = typeOfCodeToSearch.map(type => {
      let search = isExactMatch ? { filter: { [type]: bcode } } : { wildcard: { [type]: bcode } };
      search = merge({}, search, baseSearch);
      return this.searchEs(storeId, search)
        .then(res => {
          // Match the old API data format for "v2/stores/${store_id}/listings"
          if (res.data && res.data.listings) {
            res.data = res.data.listings || [];
          }
          res.data = (res.data || []).map(item => ({ listing: item }));
          return res;
        });
    });
    return Promise.all(promises).then((res) => {
      let data = res.reduce((ret, r) => {
        return ret.concat(r.data);
      }, []);
      data = uniqBy(data, 'listing.id');
      return { data };
    });
  }
}

export default new InventoryService();

import BindoService from './base/bindoService';

class BillOfMaterialsService extends BindoService {
  getCollections(listingId, storeId, deep = 0) {
    let path = `v2/stores/${storeId}/listings/${listingId}/bill_of_materials`;
    return super.get(path);
  }

  getDeepCollections(listingId, storeId) {
    let path = `v2/stores/${storeId}/listings/${listingId}/bill_of_materials?deep=1`;
    return super.get(path);
  }

  getItem(id, listingId, storeId) {
    let path = `v2/stores/${storeId}/listings/${listingId}/bill_of_materials/${id}`;
    return super.get(path);
  }

  update(data, listingId, storeId){
    let path = `v2/stores/${storeId}/listings/${listingId}/bill_of_materials`;
    return super.put(path, { listing: data });
  }

  create(data, listingId, storeId){
    let path = `v2/stores/${storeId}/listings/${listingId}/bill_of_materials`;
    return super.post(path, { listing: data });
  }

  remove(id, listingId, storeId){
    let path = `v2/stores/${storeId}/listings/${listingId}/bill_of_materials/${id}`;
    return super.delete(path);
  }
}

export default new BillOfMaterialsService();

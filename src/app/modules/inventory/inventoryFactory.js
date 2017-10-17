export function InventoryFactory ($rootScope, $http, DashboardFactory, CommonFactory, messageFactory, gettextCatalog) {
  'ngInject';

  $rootScope.translate = function (str) {
    return gettextCatalog.getString(str);
  };
  var getInventory = function (id, store_id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + store_id + '/listings/' + id + '/with_suppliers')
  };

  var getInventoryWithMemebers = function (id, store_id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + store_id + '/listings/' + id + '/with_members')
  };

  var getInventorys = function () {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/listings')
  };

  var getInventoryList = function (ids) {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/listings/by?per_page=9999&listing_ids=' + ids.join(','));
  };

  var createItem = function (listing) {
    if (!listing.price) return messageFactory.add('A valid price for the listing required!');
    var data = {
      gtid: listing.gtid,
      price: listing.price,
      quantity: listing.quantity
    };
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/listings', { listing: data });
  };
  var createCustomItem = function (listing) {
    listing.barcode = listing.listing_barcode   // POST .barcode will update .listing_barcode
    return $http.post($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/unique_products', { unique_product: listing });
  };
  var updateInventory = function (id, newListing, oldListing, modifierGroups) {

    var newInventory = angular.copy(newListing);

    var diff = CommonFactory.getDiff(newListing, oldListing);


    // If UPC product, then do not allow to modify product's name, image, brand, category or custom attributes.
    if (oldListing.upc !== null) {
      delete diff.name;
      delete diff.image_url;
      delete diff.brand_id;
      delete diff.brand_name;
      delete diff.category_id;
      delete diff.category_name;
      delete diff.custom_field_values;
    }


    diff.barcode = diff.listing_barcode; // PUT barcode will update listing_barcode

    if ( !newListing.track_quantity ){
      diff.quantity = 0;
    }


    if (modifierGroups) {
      diff.modifier_group_ids = _.compact(_.map(modifierGroups, function (modifierGroup) {
        return modifierGroup.selected ? modifierGroup.id : null;
      }));
    }



    if (newInventory.upc !== null) {
      delete newInventory.name;
      delete newInventory.image_url;
      delete newInventory.brand_id;
      delete newInventory.brand_name;
      delete newInventory.category_id;
      delete newInventory.category_name;
      delete newInventory.custom_field_values;
    }
    newInventory.barcode = newInventory.listing_barcode;
    if (modifierGroups) {
      newInventory.modifier_group_ids = _.compact(_.map(modifierGroups, function (modifierGroup) {
        return modifierGroup.selected ? modifierGroup.id : null;
      }));
    }

    if (_.isNumber(newInventory.quantity)) {
      newInventory.track_quantity = true;
    }



    return $http.put($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/listings/' + id, { listing: diff });
  };
  var deleteInventory = function (id) {
    return $http.delete($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/listings/' + id);
  };
  var uploadProductImage = function (product_id, file) {
    var fd = new FormData();
    fd.append('product_graphic[image]', file);
    fd.append('product_graphic[default]', false);
    return $http.post($rootScope.api + '/api/v2/products/' + product_id + '/product_graphics', fd, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }
    });
  };

  var getProductImage = function (product_id, file) {
    return $http.get($rootScope.api + '/api/v2/products/' + product_id + '/product_graphics');
  };
  var deleteProductImage = function (product_id, image_id) {
    return $http.delete($rootScope.api + '/api/v2/products/' + product_id + '/product_graphics/' + image_id);
  };

  var getQuantityHistory = function (id) {
    return $http.get($rootScope.analytics + '/v3/stores/' + DashboardFactory.getStoreId() + '/listings/' + id + '/quantity_histories');
  };
  var getProduct = function (upc) {
    return $http.get($rootScope.api + '/api/v2/products/' + upc + '/name');
  };

  var checkProduct = function (upc) {
    return $http.get($rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/listings?per_page=999999&filters[]=upc__equal__' + upc);
  };

  var defaultProductImage = function (product_id, image_Id) {
    return $http.put($rootScope.api + '/api/v1/products/' + product_id + '/product_graphics/' + image_Id + '/mark_as_default');
  };

  var getBOM = function (id, store_id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + store_id + '/listings/' + id + '/bill_of_materials?page=1&per_page=9999');
  };

  var createBOM = function (id, store_id, bom) {
    return $http.post($rootScope.api + '/api/v2/stores/' + store_id + '/listings/' + id + '/bill_of_materials', { listing: { bill_of_materials_attributes: bom } });
  };

  var updateBOM = function (id, store_id, bom) {
    return $http.put($rootScope.api + '/api/v2/stores/' + store_id + '/listings/' + id + '/bill_of_materials', { listing: { bill_of_materials_attributes: bom } });
  };

  var deleteBOM = function (id, store_id, bom_id) {
    return $http.delete($rootScope.api + '/api/v2/stores/' + store_id + '/listings/' + id + '/bill_of_materials/' + bom_id);
  };

  var updateReferenceCodes = function (id, store_id, codes) {
    return $http.put($rootScope.api + '/api/v2/stores/' + store_id + '/listings/' + id + '/reference_codes', { codes });
  };
  var getStoreLevel = function(id, store_id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + store_id + '/listings/' + id + '/with_members')
  }

  var getStoreLevel = function(id, store_id) {
    return $http.get($rootScope.api + '/api/v2/stores/' + store_id + '/listings/' + id + '/with_members')
  }

  return {
    getInventory: getInventory,
    getInventorys: getInventorys,
    getInventoryWithMemebers: getInventoryWithMemebers,
    getInventoryList: getInventoryList,
    createItem: createItem,
    createCustomItem: createCustomItem,
    updateInventory: updateInventory,
    deleteInventory: deleteInventory,
    uploadProductImage: uploadProductImage,
    getProductImage: getProductImage,
    deleteProductImage: deleteProductImage,
    defaultProductImage: defaultProductImage,
    getQuantityHistory: getQuantityHistory,
    getProduct: getProduct,
    checkProduct: checkProduct,
    getBOM: getBOM,
    createBOM: createBOM,
    updateBOM: updateBOM,
    deleteBOM: deleteBOM,
    updateReferenceCodes,
    getStoreLevel
  };

}

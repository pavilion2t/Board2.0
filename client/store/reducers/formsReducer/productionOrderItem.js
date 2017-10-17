import {
  cloneDeep,
  isNumber,
  forEach,
  find,
  partition
} from 'lodash';
import arrayToTree from 'array-to-tree';
import uuid from 'uuid';
import Big from 'big.js';
import { actionTypes } from '~/actions/formActions/productionOrderItem';
import { createReducer } from '~/helpers/reduxHelper';

const QUANTITY_PRICISION = 4;

const initialState = {
  editMode: false,
  isCreating: false,

  isLoading: false,
  isSubmitting: false,

  isLoadingBom: false,
  isLoadingUom: false,
  isLoadingListing: false,

  errors: {
    loadBOM: [],
    loadUOM: [],
    loadListing: []
  },

  initialValues: {},
  initialProductionOrderItems: [],
  billOfMaterials: {},
  uomGroups: {},
  storeId: null,
  id: null,
  status: '',
  orderType: 1, //assemble
  productionOrderItems: [],
};

const turnBomToChildren = (items) => {
  items.forEach(i => {
    if (Array.isArray(i.billOfMaterials) && i.billOfMaterials) {
      i.children = turnBomToChildren(i.billOfMaterials);
      delete i.billOfMaterials;
    }
  });
  return items;
};

const patchBomUuid = (items) => {
  if (Array.isArray(items) && items.length) {
    items = items.map(c => patchChildBomUuid(c, null));
  }
  return items;
};

const patchChildBomUuid = (item, parentUuid) => {
  item.parentUuid = parentUuid;
  item.uuid = uuid.v4();
  if (Array.isArray(item.billOfMaterials) && item.billOfMaterials.length) {
    item.billOfMaterials = item.billOfMaterials.map(i => patchChildBomUuid(i, item.uuid));
  }
  return item;
};

const calculateItemQuantity = (item) => {
  let {
    ratio = 1,
    productionOrderItemMaterials = [],
    quantityInDisplayUnit = 0,
    qtyFulfilledInDisplayUnit = 0
  } = item;

  let multiplier = Big(quantityInDisplayUnit).times(ratio);
  item.quantity = multiplier.toFixed(QUANTITY_PRICISION);
  item.qtyFulfilled = Big(qtyFulfilledInDisplayUnit).times(ratio).toFixed(QUANTITY_PRICISION);
  let fulfillPercentage = quantityInDisplayUnit > 0 ? Big(qtyFulfilledInDisplayUnit).div(quantityInDisplayUnit) : Big(0);
  if (fulfillPercentage.gt(Big(1))) fulfillPercentage = Big(1);
  if (Array.isArray(productionOrderItemMaterials) && productionOrderItemMaterials.length) {
    let materialQuantityCalculator = calculateMaterialQuantity.bind(null, multiplier, fulfillPercentage);
    item.productionOrderItemMaterials = productionOrderItemMaterials.map(materialQuantityCalculator);
  }
  return item;
};

const calculateMaterialQuantity = (qtyMultiplier, fulfillPercentage, item) => {
  let thisQuantity = Big(item.bomRatio || 0).times(item.unitRatio || 1).times(qtyMultiplier);
  item.quantity = thisQuantity.toFixed(QUANTITY_PRICISION);
  item.quantityInDisplayUnit = Big(item.bomRatio || 0).times(qtyMultiplier).toFixed(QUANTITY_PRICISION);
  item.qtyFulfilled = thisQuantity.times(fulfillPercentage).toFixed(QUANTITY_PRICISION);
  item.qtyFulfilledInDisplayUnit = thisQuantity.times(item.unitRatio || 1).times(fulfillPercentage).toFixed(QUANTITY_PRICISION);
  if (Array.isArray(item.children) && item.children.length) {
    let calculator = calculateMaterialQuantity.bind(null, thisQuantity, fulfillPercentage);
    item.children = item.children.map(calculator);
  }
  return item;
};

const patchPOMaterialListingInfo = (item, entities) => {
  let listing = entities[item.listingId] || {};
  item.nameOfListing = listing.name;
  item.ean13 = listing.ean13;
  item.listingBarcode = listing.listingBarcode;
  item.listingQuantity = Big(listing.quantity || 0).toFixed(QUANTITY_PRICISION);
  item.listingQtyReservedForProductionOrder = Big(listing.qtyReservedForProductionOrder || 0).toFixed(QUANTITY_PRICISION);
  if (Array.isArray(item.children) && item.children.length) {
    item.children = item.children.map(i => patchPOMaterialListingInfo(i, entities));
  }
  return item;
};

const patchPOMaterialQuantity = (item, fulfillPercentage) => {
  if (!item.unitRatio) item.unitRatio = 1;
  if (!item.bomRatio) item.bomRatio = 0;
  if (!item.quantity) item.quantity = 0;
  if (!item.quantityInDisplayUnit) item.quantityInDisplayUnit = Big(item.quantity).div(item.unitRatio).toFixed(QUANTITY_PRICISION);
  if (!item.qtyFulfilled) item.qtyFulfilled = Big(item.quantity).times(fulfillPercentage).toFixed(QUANTITY_PRICISION);
  if (!item.qtyFulfilledInDisplayUnit) item.qtyFulfilledInDisplayUnit = Big(item.quantityInDisplayUnit).times(fulfillPercentage).toFixed(QUANTITY_PRICISION);
  if (Array.isArray(item.children) && item.children.length) {
    item.children = item.children.map(i => patchPOMaterialQuantity(i, fulfillPercentage));
  }
  return item;
};

const patchBomMaterial = (item, uomGroups) => {
  // get ratio and base unit
  let { displayUnitId } = item;
  if (!displayUnitId) item.ratio = 1;
  else {
    forEach(uomGroups, (group, unitGroupId) => {
      let { units } = group;
      let found = find(units, ['id', displayUnitId]);
      if (found) {
        item.ratio = found.ratio;
        item.unitGroupId = found.unitGroupId;
        let [baseUnit, normalUnit] = partition(group.units || [], 'isBaseUnit'); // eslint-disable-line  no-unused-vars
        if (baseUnit.length) {
          // PO need base unit
          item.baseUnit = baseUnit[0].name;
          item.baseUnitId = baseUnit[0].id;
        }
      }
    });
    if (!item.ratio) {
      item.ratio = 1;
      console.warn(`Cannot find unit group for BOM item:`, item);
    }
  }

  item.bomRatio = item.quantityInDisplayUnit || 0;
  item.unitRatio = item.ratio || 1;

  // item.quantity = 0;
  // item.quantityInDisplayUnit = 0;
  // item.qtyFulfilled = 0;
  // item.qtyFulfilledInDisplayUnit = 0;

  // transform display name: BOM -> PO
  item.displayUnit = item.displayUnitName;

  // transform name: BOM -> PO
  item.name = item.nameOfMaterial;

  // transform ean13: BOM -> PO
  item.ean13 = item.materialEan13;

  // transform listingBarcode
  item.listingBarcode = item.materialListingBarcode;

  // transform bomType: BOM -> PO
  item.bomType = item.materialBomType;

  // no need to process sub materials if need to track item quantity
  if (item.trackQuantity) {
    item.children = [];
  }

  if (Array.isArray(item.children) && item.children.length) {
    item.children = item.children.map(i => patchBomMaterial(i, uomGroups));
  }

  return item;
};

const processRawItem = (item) => {
  if (!item.quantity) item.quantity = 0;
  if (!item.quantityInDisplayUnit) item.qtyFulfilledInDisplayUnit = 0;
  if (!item.qtyFulfilledInDisplayUnit) item.qtyFulfilledInDisplayUnit = 0;
  if (!item.qtyFulfilled) item.qtyFulfilled = 0;
  if (!item.ratio) item.ratio = 1;
  let fulfillPercentage = item.quantity > 0 ? Big(item.qtyFulfilled).div(item.quantity) : Big(0);
  if (fulfillPercentage.gt(Big(1))) fulfillPercentage = Big(1);
  if (Array.isArray(item.productionOrderItemMaterials) && item.productionOrderItemMaterials.length) {
    item.productionOrderItemMaterials = arrayToTree(item.productionOrderItemMaterials, {
      parentProperty: 'parentUuid',
      customID: 'uuid'
    });
    item.productionOrderItemMaterials = item.productionOrderItemMaterials.map(i => patchPOMaterialQuantity(i, fulfillPercentage));
  }
  return item;
};

const patchPOItemListingInfo = (item, entities) => {
  let listing = entities[item.listingId] || {};
  item.nameOfListing = listing.name;
  item.name = listing.name;
  item.ean13 = listing.ean13;
  item.listingBarcode = listing.listingBarcode;
  item.imageUrl = listing.imageUrl;
  item.unitGroupId = listing.unitGroupId;
  item.listingQuantity = Big(listing.quantity).toFixed(4);
  item.listingQtyReservedForProductionOrder = Big(listing.qtyReservedForProductionOrder).toFixed(4);
  if (Array.isArray(item.productionOrderItemMaterials) && item.productionOrderItemMaterials.length) {
    item.productionOrderItemMaterials = item.productionOrderItemMaterials.map(m => patchPOMaterialListingInfo(m, entities));
  }
  return item;
};

const actionHandlers = {
  [actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_REQUEST]: (state, action) => {
    const { id, storeId } = action;
    return { ...state, storeId, isLoading: false, isCreating: !id, id };
  },
  [actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_SUCCESS]: (state, action) => {
    let data = cloneDeep(action.data);
    let { productionOrderItems = [] } = data;
    productionOrderItems = productionOrderItems.map(processRawItem);

    return {
      ...state,
      productionOrderItems: cloneDeep(productionOrderItems),
      initialProductionOrderItems: cloneDeep(productionOrderItems),
      initialValues: data,
      isLoading: false
    };
  },
  [actionTypes.OPEN_PRODUCTION_ORDER_OVERVIEW_FAILURE]: (state, action) => {
    let { errors } = state;
    errors.loadProductionOrder = action.error;
    return { ...state, isLoading: false, errors };
  },
  [actionTypes.CLOSE_PRODUCTION_ORDER_OVERVIEW]: () => initialState,
  [actionTypes.DISCARD_PRODUCTION_ORDER_OVERVIEW]: (state) => {
    const { initialValues, listings } = state;

    let productionOrderItems = cloneDeep(initialValues.productionOrderItems);
    productionOrderItems.forEach(item => {
      let listing = listings[item.listingId] || {};
      item.name = listing.name;
      item.ean13 = listing.ean13;
      item.listingBarcode = listing.listingBarcode;
      item.imageUrl = listing.imageUrl;
      item.unitGroupId = listing.unitGroupId;
      item.listingQuantity = Big(listing.quantity).toFixed(QUANTITY_PRICISION);
      item.listingQtyReservedForProductionOrder = Big(listing.qtyReservedForProductionOrder).toFixed(QUANTITY_PRICISION);
    });
    return { ...state, productionOrderItems: productionOrderItems, editMode: false };
  },
  [actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_REQUEST]: (state) => {
    return { ...state, isSubmitting: true };
  },
  [actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_SUCCESS]: (state, action) => {
    const { data } = action;
    let { productionOrderItems = [] } = data;
    productionOrderItems = productionOrderItems.map(processRawItem).map(i => patchPOItemListingInfo(i, state.listings));
    return {
      ...state,
      isSubmitting: false,
      editMode: false,
      productionOrderItems: cloneDeep(productionOrderItems),
      initialProductionOrderItems: cloneDeep(productionOrderItems),
      initialValues: data,
    };
  },
  [actionTypes.SUBMIT_PRODUCTION_ORDER_OVERVIEW_FAILURE]: (state) => {
    return { ...state, isSubmitting: false, editMode: false };
  },
  [actionTypes.LOAD_LISTINGS_FOR_PRODUCTION_ORDER_REQUEST]: (state) => {
    return { ...state, isLoadingListing: true };
  },
  [actionTypes.LOAD_LISTINGS_FOR_PRODUCTION_ORDER_SUCCESS]: (state, action) => {
    const { data } = action;
    let entities = {};
    data.forEach(d => entities[d.id] = d);
    let { productionOrderItems = [] } = state;
    productionOrderItems = productionOrderItems.map(i => patchPOItemListingInfo(i, entities));
    return { ...state, isLoadingListing: false, productionOrderItems, listings: entities };
  },
  [actionTypes.LOAD_LISTINGS_FOR_PRODUCTION_ORDER_FAILURE]: (state, action) => {
    let { errors } = state;
    if (errors.hasOwnProperty('loadListing')) errors.loadListing.push(action.error);
    else errors.loadListing = [action.error];
    return { ...state, isLoadingListing: false, errors };
  },
  [actionTypes.LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_REQUEST]: (state) => {
    return { ...state, isLoadingBom: true };
  },
  [actionTypes.LOAD_BOM_FOR_PRODUCTION_ORDER_ITEM_SUCCESS]: (state, action) => {
    const { data } = action;
    let { billOfMaterials } = state;
    Object.keys(data).forEach(listingId => {
      let itsBom = data[listingId];
      itsBom = patchBomUuid(itsBom);
      billOfMaterials[listingId] = turnBomToChildren(itsBom);
    });
    return { ...state, billOfMaterials, isLoadingBom: false };
  },
  [actionTypes.LOAD_BOM_OF_PRODUCTION_ORDER_ITEM_FAILURE]: (state, action) => {
    let { errors } = state;
    if (errors.hasOwnProperty('loadBom')) errors.loadBom.push(action.error);
    else errors.loadBom = [action.error];
    return { ...state, isLoadingBom: false };
  },
  [actionTypes.LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_REQUEST]: (state) => {
    return { ...state, isLoadingUom: true };
  },
  [actionTypes.LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_SUCCESS]: (state, action) => {
    const { data } = action;
    let { productionOrderItems } = state;
    let entities = {};
    data.forEach(d => entities[d.id] = d);
    productionOrderItems.forEach(item => {
      if (!item.unitGroupId) {
        item.units = [];
        item.unitMap = {};
        item.ratio = 1;
      } else {
        item.units = entities[item.unitGroupId].units;
        item.unitMap = {};
        item.units.forEach(u => {
          const { id } = u;
          item.unitMap[id] = u;
        });
        item.ratio = item.unitMap[item.displayUnitId].ratio;
      }
    });
    return { ...state, uomGroups: entities, isLoadingUom: false, productionOrderItems: productionOrderItems.slice() };
  },
  [actionTypes.LOAD_ALL_UOM_FOR_PRODUCTION_ORDER_FAILURE]: (state, action) => {
    let { errors } = state;
    if (errors.hasOwnProperty('loadUom')) errors.loadUom.push(action.error);
    else errors.loadBom = [action.error];
    return { ...state, isLoadingUom: false, errors };
  },
  [actionTypes.ENABLE_PRODUCTION_ORDER_EDITMODE]: (state) => {
    return { ...state, editMode: true };
  },
  [actionTypes.CHANGE_PRODUCTION_ORDER_TYPE]: (state, action) => {
    return { ...state, orderType: action.value };
  },
  [actionTypes.CHANGE_PRODUCTION_ORDER_PLANNED_QUANTITY]: (state, action) => {
    const { index, value } = action;
    let { productionOrderItems } = state;
    productionOrderItems[index].quantityInDisplayUnit = isNumber(value) ? Math.floor(value * 10000) / 10000 : value;
    productionOrderItems[index] = calculateItemQuantity(productionOrderItems[index]);
    return { ...state, productionOrderItems: productionOrderItems.slice() };
  },
  [actionTypes.CHANGE_PRODUCTION_ORDER_PROCESSED_QUANTITIY]: (state, action) => {
    const { index, value } = action;
    let { productionOrderItems } = state;
    productionOrderItems[index].qtyFulfilledInDisplayUnit = isNumber(value) ? Math.floor(value * 10000) / 10000 : value;
    productionOrderItems[index] = calculateItemQuantity(productionOrderItems[index]);
    return { ...state, productionOrderItems: productionOrderItems.slice() };
  },
  [actionTypes.CHANGE_PRODUCTION_ORDER_UOM]: (state, action) => {
    const { index, value } = action;
    let { productionOrderItems } = state;
    productionOrderItems[index].displayUnitId = value.id;
    productionOrderItems[index].displayUnit = value.name;
    productionOrderItems[index].ratio = value.ratio;
    productionOrderItems[index] = calculateItemQuantity(productionOrderItems[index]);
    return { ...state, productionOrderItems: productionOrderItems.slice() };
  },
  [actionTypes.REMOVE_PRODUCTION_ORDER_LISTING_ITEM]: (state, action) => {
    const { index } = action;
    let { productionOrderItems } = state;
    productionOrderItems.splice(index, 1);
    return { ...state, productionOrderItems: productionOrderItems.slice() };
  },
  [actionTypes.ADD_PRODUCTION_ORDER_LISTING_ITEM]: (state, action) => {
    const { data } = action;
    const { uomGroups } = state;
    let { productionOrderItems } = state;

    data.forEach((listing) => {
      let newItem = {
        name: listing.name,
        imageUrl: listing.imageUrl,
        listingId: listing.id,
        ean13: listing.ean13,
        quantity: 0,
        quantityInDisplayUnit: 0,
        qtyFulfilledInDisplayUnit: 0,
        qtyFulfilled: 0,
        trackQuantity: listing.hasOwnProperty('trackQuantity') ? listing.trackQuantity : 1,
        listingBarcode: listing.listingBarcode,
        listingQuantity: Big(listing.quantity || 0).toFixed(QUANTITY_PRICISION),
        listingQtyReservedForProductionOrder: Big(listing.qtyReservedForProductionOrder || 0).toFixed(QUANTITY_PRICISION),
      };

      if (listing.unitGroupId) {
        newItem.hasUnitGroup = true;
        if (uomGroups[listing.unitGroupId]) {
          newItem.units = uomGroups[listing.unitGroupId].units || [];
          newItem.unitMap = {};
          newItem.units.forEach(u => {
            const { id } = u;
            newItem.unitMap[id] = u;
          });
          let baseUnit = newItem.units.filter(u => u.isBaseUnit);
          if (baseUnit.length) baseUnit = baseUnit[0];
          else baseUnit = {};
          newItem.baseUnitId = baseUnit.id;
          newItem.baseUnit = baseUnit.name;
          newItem.displayUnitId = baseUnit.id;
          newItem.displayUnit = baseUnit.name;
        }
      }
      newItem.ratio = 1;
      if (newItem.trackQuantity) {
        newItem.productionOrderItemMaterials = [];
      } else {
        newItem.productionOrderItemMaterials = state.billOfMaterials[listing.id] || [];
        if (Array.isArray(newItem.productionOrderItemMaterials) && newItem.productionOrderItemMaterials.length) {
          newItem.productionOrderItemMaterials = newItem.productionOrderItemMaterials.map(i => patchBomMaterial(i, uomGroups));
        }
      }
      productionOrderItems.push(calculateItemQuantity(newItem));
    });

    return { ...state, productionOrderItems: productionOrderItems.slice() };
  }
};

export default createReducer(initialState, actionHandlers);

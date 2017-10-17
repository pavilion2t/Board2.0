import filter from 'lodash/filter';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';

import {
  SET_ENTITIES_LISTINGS,
  SET_PRIVATE_ENTITIES_LISTINGS,
  ADD_PRIVATE_ENTITIES_LISTINGS,
  CLEAR_PRIVATE_ENTITIES_LISTINGS,
  ADD_ENTITY_LISTING_GRAPHIC,
  REMOVE_ENTITY_LISTING_GRAPHIC,
  SET_ENTITIES_SUPPLIERS,
  SET_ENTITIES,
  ADD_ENTITY_LISTING_CUSTOM_ITEM,
  REMOVE_ENTITY,
  UPDATE_ENTITY,
  UPDATE_PRIVATE_ENTITY,
  ADD_PRIVATE_ENTITY,
  ADD_ENTITY} from '../../actions/entityActions';

const initialState = {
  listings: null,
  suppliers: null,
  departments: null,
  vouchers: null,
  stations: null,
  lineItemStatuses: null,
  workflows: null,
  uomGroups: null,
  productionOrders: null,
  private_listings: null
};

function mergeCustomizer(objValue, srcValue) {
  if (isArray(srcValue)) {
    return srcValue;
  }
}

export default function entityReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PRIVATE_ENTITIES_LISTINGS: {
        //merge two objects
        state.private_listings = state.private_listings || {};
        forEach(action.data.listings, (listing, key) => {
            // we may modified private listings locally and not committed yet
            // so need to retain it till committing.
            if (state.private_listings.hasOwnProperty(key)) {
                action.data.listings[key] =
                    Object.assign({}, action.data.listings[key], state.private_listings[key]);
            }
        });
        state.private_listings = Object.assign({}, state.private_listings, action.data.listings);
        return Object.assign({}, state, {private_listings: state.private_listings});
    }
    case CLEAR_PRIVATE_ENTITIES_LISTINGS: {
        return Object.assign({}, state, {private_listings: null});
    }
    case SET_PRIVATE_ENTITIES_LISTINGS: {
      state.private_listings = state.private_listings || {};
      return Object.assign({}, state, {private_listings: action.data.listings});
    }
    case ADD_PRIVATE_ENTITY: {
        state.private_listings = state.private_listings || {};

        state.private_listings = Object.assign({}, state.private_listings, { [action.id]: action.data });
        return Object.assign({}, state);
    }
    case UPDATE_PRIVATE_ENTITY: {
        state.private_listings[action.id] = Object.assign({}, state.private_listings[action.id], action.data);
        return Object.assign({}, state, {private_listings: state.private_listings});
    }
    case SET_ENTITIES_LISTINGS: {
      state.listings = state.listings || {};

      forEach(action.data.listings, (listing, key) => {
        action.data.listings[key] = Object.assign({}, state.listings[key], action.data.listings[key]);
      });

      let newListings = Object.assign({}, state.listings, action.data.listings);

      return Object.assign({}, state, {listings: newListings});
    }

    case REMOVE_ENTITY_LISTING_GRAPHIC: {
      let targetListing = state.listings[action.listingId];
      if (targetListing) {
        let removedProductGraphics = filter(targetListing.product_graphics, (g) => g.id !== action.graphicId);

        targetListing.product_graphics = removedProductGraphics;

        let newListing = Object.assign({}, targetListing, { product_graphics: removedProductGraphics});
        let newListings = Object.assign({}, state.listings, {[action.listingId]: newListing });

        return Object.assign({}, state, { listings: newListings });

      } else {
        return state;
      }
    }

    case ADD_ENTITY_LISTING_GRAPHIC: {
      let targetListing = state.listings[action.listingId];
      if (targetListing) {
        targetListing.product_graphics.push(action.graphicData);

        let newListing = Object.assign({}, targetListing);
        let newListings = Object.assign({}, state.listings, {[action.listingId]: newListing });

        return Object.assign({}, state, { listings: newListings });

      } else {
        return state;
      }
    }

    case SET_ENTITIES_SUPPLIERS:
      state.suppliers = Object.assign({}, state.suppliers, action.data.suppliers);
      return Object.assign({}, state);

    case SET_ENTITIES:
      state[action.collection] = merge({}, state[action.collection], action.data);
      return Object.assign({}, state);

    case 'SET_HANDLE_PROMISE_ENTITIES':
      return mergeWith({}, state, action.data, mergeCustomizer);

    case UPDATE_ENTITY:
      state[action.collection][action.id] = Object.assign({}, state[action.collection][action.id], action.data);
      state[action.collection] = Object.assign({}, state[action.collection]);

      return Object.assign({}, state);

    case ADD_ENTITY_LISTING_CUSTOM_ITEM:{
      if (typeof state.listings === 'undefined'){
          state.listings = {};
      }
      let listingId = action.data[0].listing.id;
      state.listings[listingId] = Object.assign({}, action.data[0].listing);
      return Object.assign({}, state);
    }

    case REMOVE_ENTITY:
      delete state[action.collection][action.id];
      return Object.assign({}, state, action.data);

    case ADD_ENTITY:
      state[action.collection] = Object.assign({}, state[action.collection], { [action.id]: action.data });
      return Object.assign({}, state);

    default:
      return state;
  }
}

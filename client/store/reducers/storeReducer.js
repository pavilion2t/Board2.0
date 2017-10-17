import unionBy from 'lodash/unionBy';
import find from 'lodash/find';
import map from 'lodash/map';
import merge from 'lodash/merge';

import { SET_STORES, UPDATE_STORE, CLEAR_STORE } from '../../actions/storeActions';

const initialState = [];

export default function storeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STORES: {
      let mergedStore = map(state, store => {
        let matchedStore = find(action.stores, {id: store.id });
        if (matchedStore) {
          Object.assign(store, matchedStore);
        }
        return store;
      });

      return unionBy(mergedStore, action.stores, 'id');
    }

    case UPDATE_STORE: {
      let targetStore = find(state, {id: action.id});
      if (targetStore) {
        merge(targetStore, action.data);
      } else {
        state.push(Object.assign(action.data, { id: action.id }));
      }

      return state.slice();
    }

    case CLEAR_STORE: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

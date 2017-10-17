import find from 'lodash/find';

export function buildStoreTree(stores) {
  let rootStores = stores.reduce((acc, store, index, stores) => {
    if (!find(stores, {id: store.parent_id})) {
      acc.push(store);
    }
    return acc;
  }, []);

  rootStores.forEach((rootStore) => {
    rootStore._children = stores.filter(store => store.parent_id == rootStore.id);
  }, []);

  return rootStores;
}

export function moduleEnabled(name, storeModule) {
  const m = storeModule || {};
  const mm = m.module || {};
  return !!(m)[name] || !!(mm||{})[name];
}

export function isAllowStoreTransfer(chain_info) {
  try {
    return chain_info.allow_store_transfer.current.length > 0;
    // console.log('chain_info.allow_store_transfer.current.length > 0', chain_info.allow_store_transfer.current.length > 0);

  } catch (e) {
    return false;
  }
}

export const SAVE_FILTER = 'SAVE_FILTER';
export const REMOVE_SAVED_FILTER = 'REMOVE_SAVED_FILTER';

export function saveFilter(group, name, filter) {
  // TODO: handle same name
  let data = {
    [group]: {
      [name]: filter
    }
  };

  return {
    type: SAVE_FILTER,
    data: data
  };
}

export function removeFilter(group, name){
  return {
    type: REMOVE_SAVED_FILTER,
    data: {
      group: group,
      name: name
    }
  };
}
